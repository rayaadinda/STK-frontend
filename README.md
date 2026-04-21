# STK Frontend

Frontend dashboard for module-based menu tree CRUD, built with Next.js (App Router), TypeScript, and shadcn/ui.

## Prerequisites

- Node.js 20+
- npm 10+
- Backend API running on `http://localhost:8080` (default)

## Setup Instructions

1. Move to frontend folder.

```bash
cd frontend
```

2. Copy environment template.

```bash
cp .env.example .env.local
```

3. Install dependencies.

```bash
npm install
```

## Run in Development Mode

```bash
npm run dev
```

App will run on `http://localhost:3000`.

## Run in Production Mode

1. Build app:

```bash
npm run build
```

2. Start production server:

```bash
npm run start
```

## Run with Docker

There is no dedicated frontend container in current repository setup.

If you want to run dependencies via Docker (bonus setup), run backend + database from repository root:

```bash
docker compose up -d --build
```

Then run frontend locally with:

```bash
npm run dev
```

## API Documentation

This frontend consumes backend API documented at:

- Swagger UI: `http://localhost:8080/api/docs`
- OpenAPI YAML: `http://localhost:8080/openapi.yaml`

## Technology Choices and Architecture Decisions

- Framework: Next.js App Router for route-based module pages.
- Language: TypeScript for safer UI and API integration.
- UI system: shadcn/ui + Tailwind CSS v4 for composable design system.
- State management: Zustand for menu tree state and async CRUD actions.
- API layer separation:
	- `services/http/api-client.ts` as generic HTTP client + envelope/error handling
	- `services/menu/menu.service.ts` as menu domain service
	- `stores/menu.store.ts` as UI-facing state/actions
- Reusable dashboard architecture:
	- `MenuDashboardPage` reused across app routes with route-specific `scopeKey`
	- each route has isolated CRUD tree data in backend scope namespace
- Responsive-first improvements:
	- mobile-friendly tree layout
	- adaptive action buttons and details panel
	- mobile sidebar integrated via sheet-based navigation.
