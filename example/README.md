# Monaco Tailwind CSS Example

This is a demonstration site showing how to use the `monaco-tailwind` library to add Tailwind CSS autocompletion and intellisense to Monaco Editor.

## Features Demonstrated

- **Tailwind CSS Autocompletion**: Type class names and see intelligent suggestions
- **Syntax Highlighting**: Tailwind classes are properly highlighted in the editor
- **Error Detection**: Invalid Tailwind classes are underlined with error indicators
- **Live Preview**: See your HTML with Tailwind styles applied in real-time
- **Arbitrary Value Support**: Use arbitrary values like `bg-[#ff8888]`
- **Modifier Support**: Autocomplete for responsive, hover, focus, and other modifiers

## Getting Started

1. Install dependencies:

   ```bash
   bun i
   ```

2. Start the development server:

   ```bash
   bun dev
   ```

3. Open your browser to `http://localhost:3000`

## How to Use

1. **Edit the HTML**: Use the Monaco Editor on the left to edit HTML content
2. **See Live Updates**: The preview pane on the right updates automatically
3. **Try Autocompletion**: Start typing Tailwind class names to see suggestions
4. **Explore Features**: Try different Tailwind utilities, modifiers, and arbitrary values

## Example Usage

Try typing these in the editor to see autocompletion in action:

- `bg-` - Background color utilities
- `text-` - Text color and size utilities
- `hover:bg-` - Hover state modifiers
- `md:text-` - Responsive breakpoint modifiers
- `bg-[#ff0000]` - Arbitrary color values
- `p-` - Padding utilities
- `flex` - Flexbox utilities

## Project Structure

- `index.html` - Main HTML file with the demo interface
- `src/main.ts` - TypeScript entry point that configures Monaco and Tailwind integration
- `package.json` - Dependencies and scripts
- `vite.config.ts` - Vite configuration for bundling

## Dependencies

- `monaco-editor` - The Monaco Editor library
- `monaco-tailwind` - The Tailwind CSS integration library (local dependency)
- `vite` - Build tool and development server
- `typescript` - TypeScript support
