import type * as m from "monaco-editor";
import { tailwindcssData } from "./cssData";
import {
  createCodeActionProvider,
  createColorProvider,
  createHoverProvider,
  createMarkerDataProvider,
} from "./providers";
import type {
  RealTailwindcssWorker,
  TailwindcssWorker,
} from "./tailwind.worker";
import {
  fromCompletionContext,
  fromPosition,
  toCompletionList,
} from "monaco-languageserver-types";
import { registerMarkerDataProvider } from "monaco-marker-data-provider";

/**
 * Represents the result of compiling CSS with Tailwind class extraction.
 *
 * @property css - The final compiled CSS string.
 * @property tailwindClasses - An array of objects, each containing a Tailwind class name and its corresponding CSS.
 * @property notTailwindClasses - An array of class names that are not recognized as Tailwind classes.
 * @property errors - (Optional) An array of error messages encountered during compilation.
 * @property warnings - (Optional) An array of warning messages encountered during compilation.
 */
export type CssCompilerResult = {
  css: string;
  tailwindClasses: {
    className: string;
    css: string;
  }[];
  notTailwindClasses: string[];
  errors?: string[];
  warnings?: string[];
};

/**
 * Configuration options for integrating Tailwind CSS support with Monaco Editor.
 *
 * @property languageSelector - An array of language identifiers for which Tailwind CSS features should be enabled in Monaco Editor.
 */
export type TailwindMonacoConfig = {
  languageSelector: readonly string[];
};

let worker: m.editor.MonacoWebWorker<RealTailwindcssWorker> | null = null;

export const defaultLanguageSelector = [
  "css",
  "javascript",
  "html",
  "mdx",
  "typescript",
] as const;

export async function getWorker(...resources: m.Uri[]) {
  if (!worker) {
    throw new Error("Monaco worker not initialized");
  }
  return worker.withSyncedResources(resources);
}

/**
 * Handles integration of Tailwind CSS features into the Monaco Editor environment.
 *
 * The `TailwindHandler` class provides methods to configure Monaco Editor with Tailwind CSS
 * support, including completion, color, hover, and code action providers, as well as
 * utilities for compiling Tailwind CSS based on provided classes and files.
 *
 * @remarks
 * - Maintains internal state to optimize CSS compilation and avoid redundant builds.
 * - Registers various Monaco language features for Tailwind CSS support.
 *
 * @example
 * ```typescript
 * const handler = new TailwindHandler();
 * const monacoConfig = handler.configureMonaco(monaco);
 * // Later, to dispose:
 * monacoConfig.dispose();
 * ```
 */
export class TailwindHandler {
  private previousCss = "";
  private previousClasses: string[] = [];
  private previousBuildCss: Awaited<ReturnType<TailwindcssWorker["buildCss"]>> =
    {
      css: "",
      tailwindClasses: [],
      notTailwindClasses: [],
    };

  /**
   * Configures Monaco Editor to support Tailwind CSS features.
   *
   * This method sets up a web worker for Tailwind CSS, extends Monaco's CSS language features
   * with Tailwind-specific data providers, and registers various language service providers
   * such as completion, color, hover, and code actions for the specified languages.
   * It also registers marker data providers for each language.
   *
   * @param monaco - The Monaco Editor API instance.
   * @param options - Optional configuration for the Tailwind integration, including language selectors.
   * @returns An object with a `dispose` method to clean up all registered providers and resources.
   */
  public configureMonaco(
    monaco: typeof m,
    {
      languageSelector = defaultLanguageSelector,
    }: Partial<TailwindMonacoConfig> = {}
  ): m.IDisposable {
    const ww = monaco.editor.createWebWorker<RealTailwindcssWorker>({
      label: "tailwindcss",
      moduleId: "/tailwindcss/tailwind.worker",
    });

    worker = ww;

    const options = monaco.languages.css.cssDefaults.options;
    monaco.languages.css.cssDefaults.setOptions({
      ...options,
      data: {
        ...options.data,
        dataProviders: {
          ...options.data?.dataProviders,
          tailwindcss: tailwindcssData,
        },
      },
    });

    const disposables: m.IDisposable[] = [
      ww,
      monaco.languages.registerCompletionItemProvider(
        languageSelector,
        createCompletionItemProvider()
      ),
      monaco.languages.registerColorProvider(
        languageSelector,
        createColorProvider(monaco, getWorker)
      ),
      monaco.languages.registerHoverProvider(
        languageSelector,
        createHoverProvider(getWorker)
      ),
      monaco.languages.registerCodeActionProvider(
        languageSelector,
        createCodeActionProvider(getWorker)
      ),
    ];

    for (const language of languageSelector) {
      disposables.push(
        registerMarkerDataProvider(
          monaco,
          language,
          createMarkerDataProvider(getWorker)
        )
      );
    }

    return {
      dispose() {
        disposables.forEach((d) => d.dispose());
      },
    };
  }

  /**
   * Builds the CSS output by processing the provided CSS string, Tailwind classes, and file contents.
   * Utilizes caching to avoid redundant builds if the input CSS and classes have not changed since the last invocation.
   *
   * @param css - The base CSS string to process.
   * @param classes - An array of Tailwind class names to include in the build.
   * @param files - A record mapping file paths to their contents, used for context during the build.
   * @returns A promise that resolves to a `CssCompilerResult` containing the compiled CSS and related metadata.
   */
  public async buildCss(
    css: string,
    classes: string[],
    files: Record<string, string>
  ): Promise<CssCompilerResult> {
    if (
      this.previousCss === css &&
      classes.every((c) => this.previousClasses.includes(c))
    ) {
      return this.previousBuildCss;
    }
    this.previousCss = css;
    this.previousClasses = classes;
    this.previousBuildCss = await (
      await getWorker()
    ).buildCss(css, files, classes);
    return this.previousBuildCss;
  }
}

function createCompletionItemProvider(): m.languages.CompletionItemProvider {
  return {
    async resolveCompletionItem(item) {
      return (await getWorker()).resolveCompletionItem(item);
    },

    async provideCompletionItems(model, position, context) {
      const completionList = await (
        await getWorker(model.uri)
      ).doComplete(
        model.uri.toString(),
        model.getLanguageId(),
        fromPosition(position),
        fromCompletionContext(context)
      );

      if (!completionList) {
        return;
      }

      const wordInfo = model.getWordUntilPosition(position);

      return toCompletionList(completionList, {
        range: {
          startLineNumber: position.lineNumber,
          startColumn: wordInfo.startColumn,
          endLineNumber: position.lineNumber,
          endColumn: wordInfo.endColumn,
        },
      });
    },
  };
}
