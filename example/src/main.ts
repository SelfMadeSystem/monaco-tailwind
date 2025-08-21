/// <reference types="vite/client" />
import * as monaco from "monaco-editor";
import { configureMonacoTailwindcss } from "monaco-tailwind";
import TailwindWorker from "monaco-tailwind/tailwind.worker?worker";
import EditorWorkerServiceWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import CssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import HtmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";

// Configure Monaco Environment for web workers
self.MonacoEnvironment = {
  getWorker(_moduleId: string, label: string) {
    switch (label) {
      case "editorWorkerService":
        return new EditorWorkerServiceWorker();
      case "css":
        return new CssWorker();
      case "html":
        return new HtmlWorker();
      case "tailwindcss":
        return new TailwindWorker();
      default:
        throw new Error(`Unknown label ${label}`);
    }
  },
};

// Configure Monaco for Tailwind CSS
const tw = configureMonacoTailwindcss(monaco);

// The CSS used in the preview
const defaultCSS = /* css */ `@import "tailwindcss";
`;

// Sample HTML content with Tailwind classes
const defaultHTML = /* html */ `\
<div class="min-h-screen flex items-center justify-center p-4">
  <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
    <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-8">
      <div class="uppercase tracking-wide text-sm text-white font-semibold">
        Welcome
      </div>
      <h1 class="mt-2 text-white text-xl font-bold">
        Monaco Tailwind CSS
      </h1>
      <p class="mt-2 text-blue-100">
        Experience the power of Tailwind CSS with Monaco Editor autocompletion!
      </p>
    </div>
    
    <div class="p-8">
      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <div>
          <div class="text-xl font-medium text-black">Try editing this HTML!</div>
          <p class="text-gray-500">Add more Tailwind classes and see the autocompletion in action.</p>
        </div>
      </div>
      
      <div class="mt-8 space-y-4">
        <button class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
          Primary Button
        </button>
        <button class="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">
          Success Button
        </button>
        <button class="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">
          Danger Button
        </button>
      </div>
      
      <div class="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-yellow-700">
              <strong>Tip:</strong> Try typing new class names in the editor. You'll see Tailwind CSS suggestions!
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`;
const previewFrame = document.getElementById("preview") as HTMLIFrameElement;
const liveLoading = document.getElementById("live-loading") as HTMLSpanElement;

// Create the models
const htmlModel = monaco.editor.createModel(defaultHTML, "html");
const cssModel = monaco.editor.createModel(defaultCSS, "css");
const outputCssModel = monaco.editor.createModel("", "css");

// Create the editor
const editorElement = document.getElementById("editor");
if (!editorElement) {
  throw new Error("Editor element not found");
}

editorElement.innerHTML = ""; // Clear any existing content

const editor = monaco.editor.create(editorElement, {
  model: htmlModel, // Start with HTML model
  theme: "vs-dark",
  minimap: {
    enabled: false,
  },
  fontSize: 14,
  lineHeight: 20,
  wordWrap: "on",
  scrollBeyondLastLine: false,
  renderWhitespace: "boundary",
  folding: true,
  lineNumbers: "on",
  glyphMargin: false,
  renderLineHighlight: "line",
  scrollbar: {
    vertical: "visible",
    horizontal: "visible",
    verticalScrollbarSize: 12,
    horizontalScrollbarSize: 12,
  },
});

// Tab switching functionality
const tabButtons = document.querySelectorAll(".tab-button");
const headerText = document.getElementById("editor-header-text");

function switchTab(tabName: string) {
  // Update tab buttons
  tabButtons.forEach((button) => {
    button.classList.toggle(
      "active",
      button.getAttribute("data-tab") === tabName
    );
  });

  // Switch editor model and set readonly state
  if (tabName === "html") {
    editor.setModel(htmlModel);
    editor.updateOptions({ readOnly: false });
    if (headerText) {
      headerText.textContent =
        "HTML Editor - Try typing Tailwind classes with autocompletion";
    }
  } else if (tabName === "css") {
    editor.setModel(cssModel);
    editor.updateOptions({ readOnly: false });
    if (headerText) {
      headerText.textContent =
        "CSS Editor - Edit Tailwind CSS configuration and custom styles";
    }
  } else if (tabName === "output-css") {
    editor.setModel(outputCssModel);
    editor.updateOptions({ readOnly: true });
    if (headerText) {
      headerText.textContent =
        "Output CSS - Generated Tailwind CSS (Read-only)";
    }
  }

  // Focus the editor
  editor.focus();
}

// Add click handlers to tab buttons
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tabName = button.getAttribute("data-tab");
    if (tabName) {
      switchTab(tabName);
    }
  });
});

function extractClasses(htmlContent: string): string[] {
  const classRegex = /class\s*=\s*["']([^"']*?)["']/gi;
  const classes = new Set<string>();

  let match;
  while ((match = classRegex.exec(htmlContent)) !== null) {
    // Split multiple classes and trim whitespace
    const classString = match[1];
    const classArray = classString
      .split(/\s+/)
      .map((cls) => cls.trim())
      .filter((cls) => cls.length > 0);

    classArray.forEach((cls) => classes.add(cls));
  }

  return Array.from(classes).sort();
}

async function updatePreview() {
  liveLoading.classList.remove("hidden");

  const htmlContent = htmlModel.getValue();
  const cssContent = cssModel.getValue();

  const allClasses = extractClasses(htmlContent);

  const cssResult = await tw.buildCss(
    cssContent,
    [...allClasses, "bg-gray-100", "font-sans"],
    {
      // No extra files in this simple example
    }
  );

  // Update the output CSS model with the generated CSS
  outputCssModel.setValue(cssResult.css);

  const html = /* html */ `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tailwind CSS Example</title>
    <style>${cssResult.css}</style>
  </head>
  <body class="bg-gray-100 font-sans">${htmlContent}
  </body>
</html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  previewFrame.src = url;

  liveLoading.classList.add("hidden");
}

// Update preview on content change for both models
htmlModel.onDidChangeContent(() => {
  updatePreview();
});

cssModel.onDidChangeContent(() => {
  updatePreview();
});

// Initial preview update
updatePreview();

// Add context-sensitive tips action
editor.addAction({
  id: "show-tips",
  label: "Show Tips",
  contextMenuGroupId: "navigation",
  run: () => {
    const currentModel = editor.getModel();
    const isHtml = currentModel === htmlModel;

    const tipMessage = isHtml
      ? `
HTML + Tailwind CSS Tips:
• Type "bg-" and see background color suggestions
• Try arbitrary values like "bg-[#ff0000]"
• Use "hover:", "focus:", "md:" prefixes for modifiers
• IntelliSense shows available utilities as you type
• Invalid classes are underlined in red
    `.trim()
      : `
CSS + Tailwind Tips:
• Use @import "tailwindcss"; to include base Tailwind styles
• Add custom CSS rules that work alongside Tailwind
• Use @apply directive to apply Tailwind utilities in custom CSS
• Configure Tailwind with @tailwind directives
• Add custom properties and components here
    `.trim();

    monaco.editor.setModelMarkers(currentModel!, "tips", [
      {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 1,
        message: tipMessage,
        severity: monaco.MarkerSeverity.Info,
      },
    ]);
  },
});

console.log("Monaco Tailwind CSS example loaded successfully!");
console.log(
  "Try editing the HTML and see Tailwind CSS autocompletion in action!"
);
