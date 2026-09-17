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

## Product & UX Direction

Nurexi is a nursing education and exam-preparation platform. The learner-facing experience should feel authoritative, focused, trustworthy, spacious, and intentional.

The interface should guide learners toward an appropriate next action rather than simply presenting available features.

For every major page or section, determine:

1. What is the learner trying to accomplish?
2. What information do they need first?
3. What should their primary action be?
4. What actions are secondary?
5. What information can be deferred, grouped, or removed?

A learner should be able to quickly understand:

- Where am I?
- Why does this section matter?
- What should I do next?

Prefer one obvious primary action over several equally weighted calls to action.

### Visual References

Use these products as design references, not templates to copy.

#### PayPal Nigeria

https://www.paypal.com/ng/home

Reference PayPal for:

- generous whitespace
- strong visual hierarchy
- confident typography
- restrained information density
- clear calls to action
- spacious sections
- minimal visual clutter
- polished, trustworthy presentation

#### HLT / NCLEX-RN Mastery

https://hltmastery.com/nursing/nclex-rn

Reference HLT Mastery for:

- nursing education UX
- exam-preparation positioning
- communicating educational value
- practice-oriented experiences
- learner progression
- educational calls to action

Do not copy branding, components, copy, imagery, or page layouts from either reference.

Extract the underlying design principles and apply them using Nurexi's own brand and product requirements.

## Information Hierarchy

Every section must have a clear intention.

Avoid adding UI merely because information is available.

Prefer:

- clear section hierarchy
- generous whitespace
- concise supporting copy
- strong typography hierarchy
- restrained use of cards
- fewer unnecessary borders
- obvious primary actions
- purposeful empty states
- progressive disclosure
- contextual recommendations
- clear feedback after user actions

Avoid:

- dashboard clutter
- excessive nested cards
- excessive badges
- competing CTAs
- unnecessary gradients
- repetitive information
- decorative UI without a functional purpose
- displaying too many choices simultaneously

When reviewing an existing interface, consider whether elements should be removed or consolidated before adding new components.

## Guided Learner Experience

Nurexi should help learners decide what to do next.

Where sufficient information exists, prioritize contextual actions such as:

- Continue an unfinished exam.
- Resume the next lesson in a course.
- Review results from a recently completed exam.
- Practice a weak topic.
- Purchase an exam session when the learner does not have access.
- Start a purchased exam session.
- Continue an unfinished course.

Do not fabricate recommendations when the application does not have sufficient data to support them.

Interactive quizzes should remain part of the experience where appropriate, but they must have a clear purpose such as practice, assessment, engagement, or identifying knowledge gaps.

## Purchase Experience

Exam-session purchase interfaces should optimize for clarity and informed conversion.

A learner considering an exam session should quickly understand:

1. What they are purchasing.
2. What the session contains.
3. Why it is useful.
4. How much it costs.
5. What access they receive after payment.
6. What they can do immediately after purchasing.

Keep purchase calls to action prominent without using manipulative or misleading patterns.

Payment-provider-specific UI should remain reasonably decoupled from the product experience because payment providers may change in the future.

## Motion & Interaction

Animation should communicate:

- state changes
- hierarchy
- continuity
- progress
- success or completion
- interaction feedback

Do not add animation solely to make a page appear dynamic.

Prefer subtle, fast transitions and microinteractions that make the interface easier to understand.

Avoid:

- excessive entrance animations
- long transitions
- animating every section on scroll
- motion that delays interaction
- distracting continuous animation

Respect `prefers-reduced-motion`.

For complex motion, prioritize performance and avoid unnecessary client-side JavaScript.

## Responsive Design

Treat mobile as a primary experience rather than a reduced desktop layout.

For interface changes:

- verify mobile and desktop layouts
- maintain clear CTA hierarchy on small screens
- ensure touch targets are appropriately sized
- avoid horizontal overflow
- avoid excessive vertical stacking caused by unnecessary containers
- preserve readable typography and spacing across breakpoints

## UI Implementation

### shadcn/ui

Nurexi uses shadcn/ui as the primary UI component foundation.

Before building a new UI component:

1. Check `components/ui/` for an existing shadcn/ui primitive.
2. Prefer composing existing shadcn/ui primitives over building equivalents from scratch.
3. If an appropriate shadcn/ui component is not installed, consider adding it through the shadcn CLI before creating a custom primitive.
4. Customize shadcn/ui components to match Nurexi's design language rather than preserving their default appearance.
5. Do not introduce another component library for functionality already covered by shadcn/ui.
6. Preserve accessibility behavior provided by shadcn/Radix primitives.
7. Avoid unnecessary abstractions around shadcn components.

Use Tailwind CSS for styling and maintain consistency with existing design tokens and `app/globals.css`.
