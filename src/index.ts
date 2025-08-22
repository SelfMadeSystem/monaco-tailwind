export { tailwindcssData } from './cssData';
import { TailwindHandler, TailwindMonacoConfig } from './TailwindHandler';
export { defaultLanguageSelector } from './TailwindHandler';

/**
 * Configures the Monaco Editor instance to support Tailwind CSS features.
 *
 * This function initializes a `TailwindHandler`, applies its configuration to the provided
 * Monaco Editor instance, and returns the handler for further customization or disposal.
 *
 * @param monaco - The Monaco Editor API object to configure.
 * @param options - Optional configuration settings for the Tailwind integration.
 * @returns The initialized `TailwindHandler` instance.
 */
export function configureMonacoTailwindcss(
  monaco: typeof import('monaco-editor'),
  options: Partial<TailwindMonacoConfig> = {},
) {
  const handler = new TailwindHandler();
  handler.configureMonaco(monaco, options);
  return handler;
}
