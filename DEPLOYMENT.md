# GitHub Pages Deployment Guide

This repository is configured to automatically deploy the example site to GitHub Pages when changes are pushed to the `main` branch.

## How it works

1. **GitHub Actions Workflow** (`.github/workflows/deploy.yml`):
   - Triggers on pushes to the `main` branch
   - Uses Bun to install dependencies and build the project
   - Builds the main library first, then the example
   - Deploys the built example to GitHub Pages

2. **Vite Configuration** (`example/vite.config.ts`):
   - Sets the correct base path for GitHub Pages (`/monaco-tailwind/`)
   - Only applies the base path in production builds

3. **Static Files** (`example/public/.nojekyll`):
   - Prevents Jekyll from processing the site

## Deployment URL

Once deployed, your example will be available at:

<https://selfmadesystem.github.io/monaco-tailwind/>

## Manual Deployment

You can also trigger a manual deployment by:

1. Going to the "Actions" tab in your GitHub repository
2. Clicking on "Deploy Example to GitHub Pages"
3. Clicking "Run workflow"

## Local Development

For local development, the site will continue to work normally at `http://localhost:3000` with:

```bash
cd example
bun install
bun dev
```

## First-Time Setup

To enable GitHub Pages for your repository:

1. Go to your repository settings
2. Navigate to "Pages" in the sidebar
3. Under "Source", select "GitHub Actions"
4. The workflow will handle the rest automatically

## Troubleshooting

- **404 errors**: Make sure the base path is correctly set in `vite.config.ts`
- **Assets not loading**: Check that all asset paths are relative or use the correct base path
- **Build failures**: Check the Actions tab for detailed error logs

## File Structure

```text
.github/workflows/deploy.yml  # GitHub Actions workflow
example/
  ├── vite.config.ts         # Vite config with GitHub Pages base path
  ├── public/.nojekyll       # Prevents Jekyll processing
  └── dist/                  # Built files (generated during deployment)
```
