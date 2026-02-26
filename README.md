# bun-hono-tanstack-spa-starter

A minimal SPA starter template optimized for AI-assisted development with Claude Code and similar coding agents. Ships with a `CLAUDE.md` so agents understand the project structure and conventions out of the box.

## Stack

- **Runtime**: Bun
- **Server**: Hono + pino logging
- **Frontend**: React 19 + TanStack Router + TanStack Query
- **Database**: PostgreSQL via Kysely + postgres.js
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Validation**: Zod v4
- **Tooling**: Biome (lint/format), tsgo (typecheck), React Compiler

## Setup

```bash
bun install
cp .env.example .env
```

## Development

```bash
bun run dev:all    # server (3001) + web (3000)
bun run dev        # server only (pipes through pino-pretty)
bun run dev:web    # web only
```

## Other Commands

```bash
bun run check      # lint + typecheck
bun run migrate    # run database migrations
bun run build:web  # production build
bun run start      # production server
```
