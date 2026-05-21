# Fasciculum Instrumentorum

Fasciculum Instrumentorum is an application monorepo built from the Next.js + Node.js base template. The project keeps the template's useful development foundation while using this repository as the home for the Fasciculum Instrumentorum app.

## Stack

- Monorepo: Turborepo with pnpm workspaces
- Frontend: Next.js App Router, TypeScript, Tailwind CSS
- Backend: Express, TypeScript, Prisma
- Data services: PostgreSQL and Redis through Docker Compose
- Testing: Vitest, Playwright, and Cucumber BDD features
- Tooling: ESLint, Prettier, Husky, ADR utilities, and BDD status scripts

## Prerequisites

- Node.js 25+
- pnpm 8+
- Docker and Docker Compose
- VS Code with Dev Containers, if you use the container workflow

## Package Manager

This repository uses pnpm. The pinned version is declared in `package.json`:

```bash
pnpm --version
pnpm install
```

The devcontainer bootstrap installs pnpm automatically when it is missing, then runs `pnpm install`.

## Quick Start

### Dev Container

1. Open the repository in VS Code.
2. Choose **Reopen in Container**.
3. Wait for the post-create setup to install dependencies.
4. Start development:

```bash
pnpm dev
```

### Local Development

```bash
pnpm install
docker compose up -d postgres redis
pnpm db:migrate
pnpm dev
```

The local development servers use:

- Frontend: <http://localhost:3100>
- Backend: <http://localhost:3101/health>

## Environment Files

Use separate env files for local app development and Docker Compose:

- Docker Compose: copy `.env.docker.example` to `.env`
- Backend local dev: copy `apps/backend/.env.example` to `apps/backend/.env`
- Frontend local dev: copy `apps/frontend/.env.local.example` to `apps/frontend/.env.local`

When working with app-specific env vars, prefer scoped commands such as:

```bash
pnpm --filter backend dev
pnpm --filter frontend dev
pnpm --filter frontend test:e2e
```

## Common Commands

```bash
pnpm dev
pnpm dev:frontend
pnpm dev:backend
pnpm build
pnpm test
pnpm test:e2e
pnpm lint
pnpm format:check
pnpm typecheck
pnpm bdd:status
```

## Project Layout

```text
apps/
  backend/     Express API, Prisma schema, backend tests, backend BDD features
  frontend/    Next.js app, frontend tests, frontend BDD features
packages/
  types/       Shared TypeScript types
  constants/   Shared constants
  config/      Shared configuration package
  utils/       Shared utilities
docs/          Architecture, testing, Docker, BDD, and operations docs
scripts/       Repo automation scripts
```

## More Documentation

- [Setup](SETUP.md)
- [Docker](docs/DOCKER.md)
- [Testing](docs/TESTING.md)
- [BDD](docs/BDD.md)
- [Architecture Decisions](docs/adr/README.md)
