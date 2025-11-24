# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Important commands

### Install dependencies

Use your preferred package manager; examples below assume `npm`:

- Install: `npm install`

### Run the dev server

- Start Next.js dev server on port 3000: `npm run dev`

### Build and run in production mode

- Build the app: `npm run build`
- Start the production server (after building): `npm run start`

### Linting

ESLint is configured with `eslint-config-next`:

- Lint the project: `npm run lint`
- Lint a single file: `npx eslint app/page.tsx`

### Testing

There is no test runner configured in `package.json`. If you add tests (e.g. with Jest or Vitest), also add the corresponding `test` script so future agents can run them via `npm test`.

## Project architecture

### Framework and runtime

- Next.js 16 using the App Router (entry under `app/`).
- React 19 with TypeScript; strict type-checking is enabled in `tsconfig.json`.
- Styling is handled via Tailwind CSS v4 (and `tw-animate-css`) with a single global stylesheet `app/globals.css`.
- Fonts are configured in `app/layout.tsx` using `next/font/google` (`Schibsted_Grotesk` and `Martian_Mono`).
- The app uses the experimental React Compiler (`reactCompiler: true`) and component caching (`cacheComponents: true`) as configured in `next.config.ts`.

### Top-level layout and pages

- `app/layout.tsx`
  - Defines `RootLayout` with HTML `<body>` fonts, global background, and shared chrome.
  - Renders the global `NavBar` component and a full-screen `LightRays` background effect behind the main content.
  - Exposes site-wide `metadata` (title `DevEvent` and description).
- `app/page.tsx`
  - Home page; renders the hero section, description, and a list of featured events.
  - Imports `events` from `lib/constants.ts` and maps them into `EventCard` components.
  - Uses `ExploreBtn` to scroll to the events section.
- `app/about/page.tsx`
  - Simple static "About" page; currently only returns a placeholder `<div>About</div>`.

### Components

All reusable UI components live under `components/`:

- `components/NavBar.tsx`
  - Top navigation bar with logo and links (`Home`, `Events`, `Create Event`).
  - Uses `next/image` and `next/link` and relies on layout/styling from `app/globals.css`.
- `components/EventCard.tsx`
  - Card for a single event; receives `title`, `image`, `slug`, `location`, `date`, and `time` as props.
  - Wraps content in a `next/link` to `/events/${slug}`.
  - Uses icon assets under `/public/icons` and poster images under `/public/images`.
  - Styling is driven by `#event-card` rules in `app/globals.css`.
- `components/ExploreBtn.tsx`
  - Button that links to the events section via an anchor (`href="#events"`).
  - Styled as a pill-like CTA button via `#explore-btn` in `app/globals.css`.
- `components/LightRays.tsx`
  - `"use client"` WebGL/`ogl`-based background effect used in the root layout.
  - Creates an `IntersectionObserver` to only initialize WebGL when visible.
  - Sets up an `ogl.Renderer`, `Triangle`, and `Program` with a custom fragment shader for animated light rays.
  - Uniforms include ray origin/direction, color, speed, spread, length, fade distance, saturation, mouse position, noise, and distortion.
  - Supports optional mouse-follow behavior with smoothed cursor tracking.
  - Carefully cleans up WebGL resources and event listeners on unmount or visibility changes.

When modifying layout or global visuals, prefer updating `NavBar`, `LightRays`, or styles in `app/globals.css` rather than duplicating logic in pages.

### Lib utilities and domain data

The `lib/` folder centralizes shared utilities and data:

- `lib/constants.ts`
  - Contains the `events` array of hard-coded event metadata (slug, image, title, location, date, time).
  - Used by `app/page.tsx` to render the featured events list.
  - If you add dynamic event fetching later (e.g. from MongoDB), this is a good place to define types and data-mapping helpers.
- `lib/mongodb.ts`
  - Provides an async `connectDB()` function that establishes and caches a MongoDB connection using `mongoose`.
  - Uses a custom `MongooseCache` type stored on `global.mongoose` to avoid opening multiple connections during dev hot reloads.
  - Reads `MONGODB_URI` from environment variables and throws a clear error if it is missing.
  - Intended to be reused by future route handlers or server components that need database access.
- `lib/utils.ts`
  - Exposes a `cn(...inputs)` helper that merges class names with `clsx` and `tailwind-merge`.
  - Use this anywhere you need conditional Tailwind class composition.

### Global styling and design system

- `app/globals.css`
  - Imports Tailwind v4 and `tw-animate-css`.
  - Defines CSS custom properties for colors, radii, charts, and sidebar design, then maps them into Tailwind theme tokens via `@theme inline`.
  - Defines several `@utility` classes:
    - `flex-center`, `text-gradient`, `glass`, `card-shadow`.
  - `@layer base`:
    - Applies `bg-background` and `text-foreground` to the `body`.
    - Centers the main content via `main` container utilities.
    - Standardizes `h1` and `h3` typography.
  - `@layer components`:
    - Styles for the home section, `#explore-btn`, global `header`/`nav`, `.events` grid, and `#event-card` layout.
    - Defines a comprehensive styling block for `#event` (header, details, booking, forms, pills), which appears to be used for a detailed event page even if that page is not yet implemented.

When adding new pages or components, prefer reusing these utilities (`glass`, `card-shadow`, `pill`, layout classes) to maintain visual consistency.

### Routing, assets, and path aliases

- Routing is handled via the App Router under `app/`.
  - Existing routes: `/` (home) and `/about`.
  - Event detail routes like `/events/[slug]` are implied by `EventCard` links but not yet implemented; create corresponding route segments under `app/events/[slug]/page.tsx` if you build them out.
- Static images and icons referenced in components are expected to live under `public/` (e.g. `/icons/*.svg`, `/icons/logo.png`, `/images/*.png`).
- A path alias `@/*` is configured in `tsconfig.json`, pointing at the repo root. Use absolute imports like `@/components/NavBar` and `@/lib/mongodb` instead of deep relative paths.

### Next.js configuration

- `next.config.ts`
  - Enables the React Compiler (`reactCompiler: true`) and `cacheComponents: true`.
  - Enables `experimental.turbopackFileSystemCacheForDev` to speed up dev builds.
  - Sets up `rewrites` so requests to `/ingest/static/:path*` and `/ingest/:path*` are proxied to the appropriate PostHog endpoints.
  - Sets `skipTrailingSlashRedirect: true` to avoid automatic trailing-slash redirects.

If you introduce API routes or route handlers that send analytics to PostHog, reuse these rewrites and keep the ingest paths consistent.

## Notes for future agents

- There is currently no test setup; if you add one, document how to run a single test and where tests live.
- MongoDB integration is prepared but unused by the current pages; if you add database-backed routes, centralize connection logic by importing `connectDB()` from `lib/mongodb.ts`.
- The `#event` styles in `app/globals.css` suggest a future detailed event view; align new event-related pages with these styles for consistency.
