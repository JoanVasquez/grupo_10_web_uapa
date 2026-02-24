# Product App

React + TypeScript application built with Vite.

## Requirements

- Node.js 24.x
- npm 10+

## Getting Started

```bash
npm install
npm run dev
```

App runs locally with Vite dev server (default: `http://localhost:5173`).

## Available Scripts

- `npm run dev`: start local development server.
- `npm run build`: type-check and build production files into `dist/`.
- `npm run preview`: preview the production build locally.
- `npm run lint`: run ESLint checks.
- `npm run test`: run unit tests once with Vitest.
- `npm run test:watch`: run Vitest in watch mode.

## Project Structure

```text
src/
  components/   reusable UI and feature components
  pages/        route-level pages
  utils/        UI/config helpers
  types/        shared TypeScript types
  test/         test setup
```

## Quality Checks

Run before pushing code:

```bash
npm run lint
npm run test
```

## GitHub Actions

Workflows in `.github/workflows`:

- `eslint.yml`: runs ESLint on pull requests targeting `master`.
- `test.yml`: runs unit tests on pull requests targeting `master`.
- `deploy.yml`: builds and deploys the static app to GitHub Pages on pushes to `master` (including merge commits).

## Deployment

Deployment uses GitHub Pages via Actions.

One-time repo setup:

1. Go to repository `Settings`.
2. Open `Pages`.
3. Set source to `GitHub Actions`.
