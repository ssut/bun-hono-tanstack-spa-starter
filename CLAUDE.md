Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Use `bunx <package> <command>` instead of `npx <package> <command>`
- Bun automatically loads .env, so don't use dotenv.

# Architecture

Monorepo-style SPA starter with separate server and web apps sharing a single `package.json`.

- **Server** (`src/server/`): Hono on Bun runtime, port 3001
- **Web** (`src/web/`): React 19 SPA with TanStack Router + TanStack Query, served by Vite on port 3000
- Vite proxies `/api` requests to the Hono server during development
- TypeScript strict mode with split tsconfigs: `tsconfig.server.json` (Bun types) and `tsconfig.web.json` (Vite/DOM types), both extending `tsconfig.base.json`

# Tech Stack

- **Runtime**: Bun
- **Server**: Hono (with Zod validator middleware)
- **Frontend**: React 19, TanStack Router (file-based routing), TanStack Query
- **Database**: PostgreSQL via Kysely (query builder, CamelCasePlugin enabled) + postgres.js (driver)
- **Styling**: Tailwind CSS v4, shadcn/ui (new-york style, lucide icons)
- **Validation**: Zod v4
- **Env**: `@t3-oss/env-core` for type-safe env variables (server: `src/server/env.ts`, client: `src/web/env.ts`)
- **Linting/Formatting**: oxfmt (single quotes, spaces, trailing commas, sorted imports) + oxlint
- **Type checking**: `@typescript/native-preview` (tsgo)

# Commands

- `bun run dev:all` - start both server and web in parallel
- `bun run dev` - server only (hot reload)
- `bun run dev:web` - web only (Vite dev server)
- `bun run build:web` - production build (output: `dist/client/`)
- `bun run start` - production server
- `bun run migrate` - run database migrations
- `bun run typecheck` - typecheck both server and web with tsgo
- `bun run fix` - run formatter and linter fixes
- `bun run format` - format the repo with oxfmt
- `bun run lint` - oxlint with safe fixes on `src/`
- `bun run check` - format check + lint check + typecheck
- `bun run shadcn` - add shadcn/ui components

# Workflow

- After every code change, run `bun run check` (format check + lint check + typecheck) and fix any errors before responding
- Never use the `any` type — use `unknown`, generics, or proper type narrowing instead

# Conventions

- API routes are prefixed with `/api`
- Web path alias: `@/*` maps to `src/web/*`
- File-based routing under `src/web/routes/` (TanStack Router auto-generates `routeTree.gen.ts`)
- `src/web/routeTree.gen.ts` is generated and excluded from both oxfmt and oxlint
- Root route injects `QueryClient` into router context (`RouterContext.queryClient`)
- Server uses pino for structured JSON logging (`src/server/lib/logger.ts`), with `hono-pino` middleware for HTTP request logging. Pino call signature is `logger.info(obj, msg)` — data object first, message string second
- Dev server pipes through `pino-pretty` for readable output; production outputs raw JSON
- Do NOT use `pino.transport()` on Bun — it's broken due to worker thread incompatibility; always pipe via CLI instead
- Server env vars: `DATABASE_URL` (required), `PORT` (default 3001)
- Client env vars: `VITE_BASE_URL` (default http://localhost:3000), must be prefixed with `VITE_`
- UI components live in `src/web/components/ui/` (shadcn-managed)
- Dark mode supported via `prefers-color-scheme` and `.dark` class
- React Compiler is enabled via `babel-plugin-react-compiler` in Vite — do NOT use manual `useMemo`, `useCallback`, or `React.memo`; the compiler handles memoization automatically
- Kysely uses `CamelCasePlugin` — write TypeScript types/interfaces in camelCase; the plugin auto-maps to snake_case DB columns. Migration files use snake_case for column names, TypeScript `Database` types use camelCase
- DB connection configured in `src/server/db/kysely.ts`, types in `src/server/db/types.ts`
- Migrations use `FileMigrationProvider` from `src/server/db/migrations/` directory, run via `bun run migrate`
