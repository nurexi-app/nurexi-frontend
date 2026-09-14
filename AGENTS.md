# Repository Guidelines

## Project Structure & Module Organization

This is the Nurexi frontend, built with Next.js 16, React 19, and strict TypeScript.

- `app/` contains routes, layouts, and API handlers. Route groups separate marketing pages (`(marketing)`) from learner and educator areas (`(user)`).
- `components/` holds reusable UI, website sections, and feature components; check `components/ui/` before adding shared primitives.
- `lib/` contains server actions, Supabase and Cloudinary clients, validators, types, and Redux features.
- `hooks/` contains custom hooks; `context/` contains application providers.
- `public/` stores images, icons, animations, and PWA assets. Styles live in `app/globals.css` and `styles/`.
- Consult `BACKEND_SCHEMA.md` when changing data-related behavior.

## Build, Test, and Development Commands

Use pnpm and keep `pnpm-lock.yaml` synchronized with dependency changes.

- `pnpm install`: install dependencies.
- `pnpm dev`: start local development at `http://localhost:3000`.
- `pnpm build`: create a production build.
- `pnpm start`: serve the production build after building.
- `pnpm lint`: run ESLint with Next.js Core Web Vitals and TypeScript rules.

## Coding Style & Naming Conventions

Follow surrounding code: two-space indentation, double quotes, and semicolons. Use TypeScript for new code and preserve strict typing. Use the `@/` alias for imports rooted at the repository directory.

Use PascalCase for React component names and a `use` prefix for hooks. Existing filenames mix PascalCase and kebab-case; match the local directory rather than renaming unrelated files. Reuse existing Tailwind utilities and UI components. No dedicated formatter configuration is present.

## Testing Guidelines

No automated test runner, test script, or coverage threshold is currently configured. Run `pnpm lint` and `pnpm build` before submitting changes, and manually verify affected routes and user flows. For interface changes, check mobile and desktop layouts. Record verification steps and any failures in the PR.

## Commit & Pull Request Guidelines

Recent commits use prefixes such as `feat:` and scoped subjects such as `feat(learner): learn course interface`. Write concise, descriptive subjects following that pattern.

Branch from updated `development`, using names such as `feature/your-feature-name`. Do not commit directly to `main` or `development`; submit feature-branch PRs against `development`. Include a description, related issues, verification results, and screenshots for visible changes.

## Security & Configuration

Keep credentials in ignored environment files such as `.env.local`. Never commit secrets or expose server credentials through public environment variables. Avoid committing generated output from `.next/`, `build/`, or coverage directories.
