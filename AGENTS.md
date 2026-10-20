<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

Bengali-language ("বাজার দর" / BazarDor) daily-price tracker. Next.js 16 App Router + React 19, auth via Better Auth + MongoDB, product data from a public REST API. npm only (`package-lock.json`).

## Commands

- `npm run dev` — dev server (Turbopack). It regenerates the `nextjs-agent-rules` block above; keep it committed.
- `npm run build` / `npm start`
- `npm run lint` — ESLint flat config (`eslint` directly, not `next lint`).
- No test suite and no `typecheck` script. Typecheck with `npx tsc --noEmit`.

## Next.js 16 quirks (differ from older training data)

- `middleware.ts` is renamed to **`proxy.ts`**. Auth gating lives in `src/proxy.ts`, exporting a function named `proxy` (not `middleware`) with `config.matcher` for `/product/:path*` and `/profile/:path*`; it redirects to `/signin` when there is no session.
- Route `params` are Promises: `const { slug } = await params` (see `src/app/product/[slug]/page.tsx`).
- `src/app/layout.tsx` uses the generated global `LayoutProps<"/">` type; `PageProps`/types come from the build, not imports.
- React Compiler is enabled in `next.config.ts`.
- Before using any Next API, read the matching file under `node_modules/next/dist/docs/`.

## Structure

- `@/*` aliases `src/*`.
- `src/app/**` — App Router pages: `/`, `/category/[slug]`, `/product/[slug]`, `/profile`, `/profile/update`, `/signin`, `/signup`; shared components in `src/app/components/`.
- `src/lib/auth.ts` (server: Better Auth + Mongo adapter, DB `bazar-dor`) and `src/lib/auth-client.ts` (client). Mounted at `src/app/api/auth/[...all]/route.ts`.
- `src/lib/utils.ts` — shared `Product`/`Category` types plus Bengali formatting helpers.

## Data & conventions

- No local product DB. Product/category data is fetched from `https://openapi.programming-hero.com/api/bazardor/*`: server components use `{ next: { revalidate: 60 } }`, client components fetch in `useEffect`.
- UI text and number formatting are Bengali. Use the helpers in `src/lib/utils.ts` (`formatPrice`, `toBengaliNumber`, `getUnitBn`, `getBanglaDate`) instead of inline number/date formatting.
- Styling: Tailwind v4 + daisyUI (`@plugin "daisyui"`) plus HeroUI (`@import "@heroui/styles"`) in `src/app/globals.css`; theme via `data-theme="light"` on `<html>`. There is no `tailwind.config.*` — CSS loaders are wired through `turbopack.rules` in `next.config.ts`.

## Env

`.env` is gitignored but required: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `MONGODB_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`. `src/lib/auth.ts` throws at import if `MONGODB_URL` is missing.

## "আমার বাজার" basket feature

- Works logged-out via `localStorage`, backed by `useSyncExternalStore` in `src/lib/bazar-store.ts` (server snapshot is `[]` to avoid hydration mismatches). Mongo sync (`bazars` collection) only happens when signed in — `/bazar` is intentionally **not** in the `proxy.ts` matcher.
- Pure pricing/optimizer logic lives in `src/lib/bazar.ts` (client-safe); Mongo access is isolated in `src/lib/bazar-server.ts`; mutations are Server Actions in `src/app/bazar/actions.ts`.
- Shareable report card is `next/og` at `src/app/bazar/slip/route.tsx`. Satori renders Bengali as tofu without a bundled font → `assets/fonts/NotoSerifBengali-Bold.ttf` is required (`process.cwd()` path). Also: every Satori `<div>` with more than one child (including multiple text nodes) needs explicit `display: flex` — use template literals for mixed text.
