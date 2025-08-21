# Monaco Tailwindcss

[![npm version](https://img.shields.io/npm/v/monaco-tailwind)](https://www.npmjs.com/package/monaco-tailwind)

[Tailwindcss](https://tailwindcss.com) integration for
[Monaco editor](https://microsoft.github.io/monaco-editor).

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Related projects](#related-projects)
- [Showcase](#showcase)
- [License](#license)

## Installation

```sh
npm install monaco-tailwind
```

## Usage

Import `monaco-tailwind` and configure it before an editor instance is created.

```typescript
import * as monaco from 'monaco-editor'
import { configureMonacoTailwindcss, tailwindcssData } from 'monaco-tailwind'

monaco.languages.css.cssDefaults.setOptions({
  data: {
    dataProviders: {
      tailwindcssData
    }
  }
})

configureMonacoTailwindcss(monaco)

monaco.editor.create(document.createElement('editor'), {
  language: 'html',
  value: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
  </head>
  <body>
    <div class="w-6 h-6 text-gray-600 bg-[#ff8888] hover:text-sky-600 ring-gray-900/5"></div>
  </body>
</html>
`
})
```

Also make sure to register the web worker. When using Webpack 5, this looks like the code below.
Other bundlers may use a different syntax, but the idea is the same. Languages you don’t used can be
omitted.

```js
window.MonacoEnvironment = {
  getWorker(moduleId, label) {
    switch (label) {
      case 'editorWorkerService':
        return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url))
      case 'css':
      case 'less':
      case 'scss':
        return new Worker(new URL('monaco-editor/esm/vs/language/css/css.worker', import.meta.url))
      case 'handlebars':
      case 'html':
      case 'razor':
        return new Worker(
          new URL('monaco-editor/esm/vs/language/html/html.worker', import.meta.url)
        )
      case 'json':
        return new Worker(
          new URL('monaco-editor/esm/vs/language/json/json.worker', import.meta.url)
        )
      case 'javascript':
      case 'typescript':
        return new Worker(
          new URL('monaco-editor/esm/vs/language/typescript/ts.worker', import.meta.url)
        )
      case 'tailwindcss':
        return new Worker(new URL('monaco-tailwind/tailwindcss.worker', import.meta.url))
      default:
        throw new Error(`Unknown label ${label}`)
    }
  }
}
```

## Related projects

- [demo page](https://selfmadesystem.github.io/monaco-tailwind) - A demo page for this package
- [monaco-tailwindcss](https://monaco-tailwindcss.js.org) - like this package, but for TailwindCSS v3.0 and made by [Remco Haszing](https://remcohaszing.nl)
- [monaco-unified](https://monaco-unified.js.org)
- [monaco-yaml](https://monaco-yaml.js.org)

## Showcase

- [uiverse](https://uiverse.io) - A website to find and share UI components, built with this package
- [Live JSX App](https://live-jsx-app.shoghisimon.ca) - A live demo of this package for TailwindCSS v4.0

## License

[MIT](LICENSE.md) © [SelfMadeSystem](https://shoghisimon.ca)
