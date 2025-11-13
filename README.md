**Project**: Minimal monorepo for assessment — Next.js apps + shared packages

- **Purpose**: Example monorepo containing multiple Next.js applications and shared packages (Prisma DB client, shared schemas, UI primitives, and tooling configs).

**Layout**
- **apps/**: Contains runnable applications (Next.js services).
	- `docs/` — documentation Next app
	- `web/` — frontend Next app
	- `product-service/` — Next app exposing product APIs under `src/app/api/products`
	- `order-service/` — Next app exposing order APIs under `src/app/api/order`
	- Typical files in each app: `package.json`, `tsconfig.json`, `next.config.js`, `src/app/` (routes + pages), and `public/`.
- **packages/**: Shared packages used across apps.
	- `common/` — shared Zod schemas and utilities (import from `@repo/common`)
	- `db/` — Prisma schema and a wrapped Prisma client (`@repo/db`). The generated client lives under `packages/db/generated/prisma`.
	- `ui/` — shared UI primitives/components (`@repo/ui`)
	- `eslint-config/`, `typescript-config/` — shared tooling configs

**Quickstart — run locally (PowerShell)**
1) Install dependencies

```powershell
# Using Bun (if available)
bun install

# Or using pnpm
pnpm install

# Or npm
npm install
```

2) Set up environment

Create a `.env` in the repo root or `packages/db` with a `DATABASE_URL` pointing to your Postgres DB:

```powershell
# Example (replace credentials/host)
setx DATABASE_URL "postgresql://user:password@localhost:5432/mydb?schema=public"
# Or create a .env file containing:
# DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
```

3) Generate Prisma client

```powershell
cd packages/db
bun db:generate
```

4) (Optional) Apply migrations (development DB only)

```powershell
cd packages/db
bun db:migrate
```

5) Start the apps

Start all apps using Turbo (runs `dev` for each app):

```powershell
# from repo root
bun run dev
```

Start a single app directly (example: product-service):

```powershell
cd apps/product-service
npm run dev
```

**Notes & Tips**
- After changing `packages/db/prisma/schema.prisma`, re-run `prisma generate` to update the generated client.
- API routes for products: `apps/product-service/src/app/api/products` and `apps/product-service/src/app/api/products/[id]`.
- API routes for orders: `apps/order-service/src/app/api/order` and `apps/order-service/src/app/api/order/[id]`.
- If TypeScript shows weird missing exports, restart your editor's TypeScript server or re-install dependencies.
- To type-check a single package: `npx tsc -p tsconfig.json` in that package folder.

If you want, I can also add example `.env` files, list default ports, or add scripts for starting individual services. Tell me which you prefer.
