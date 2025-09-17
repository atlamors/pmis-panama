# PMIS Panama Monorepo

Turborepo-managed monorepo for front-end MFEs (Angular) and back-end microservices (.NET 8).

## Layout

```
pmis-frontend/
  host/
  scheduling-mfe/
pmis-backend/
  api-gateway/
  scheduling/
```

## Prerequisites

- Node.js ≥ 18 (recommend 20+)
- npm ≥ 9
- .NET 8 SDK (for backend apps)

## Install

- Install in root and all workspaces:

```
npm run install:all
```

- CI install:

```
npm run ci:all
```

- Reinstall everything (cleans node_modules):

```
npm run reinstall:all
```

## Common scripts

- Dev (all): `npm run dev`
- Dev (frontend only): `npm run dev:fe`
- Dev (backend only): `npm run dev:be`
- Build (all): `npm run build`
- Test (all): `npm run test`
- Clean: `npm run clean`
- Enforce TS (allows common CJS build configs): `npm run enforce:ts`

## Frontend notes

- Angular 18 + Webpack 5 Module Federation (CJS configs)
- Tailwind via `tailwind.config.cjs` per app; styles in `src/styles.css`
- Host dev proxy: `host/proxy.conf.json` routes `/api/*` → `http://localhost:5000`

## Backend notes

- `api-gateway`: YARP reverse proxy, `/scheduling/*` → `http://localhost:5073`
- `scheduling`: OpenAPI + Scalar UI enabled

---

## Phase 0 Docs

Goal: establish a scalable monorepo foundation while keeping the MVP simple.

### Monorepo Management
- Orchestrator: Turborepo
- Workspaces: `pmis-frontend/*`, `pmis-backend/*`

#### Naming
- Frontend MFEs: `-mfe` suffix (e.g., `scheduling-mfe/`)
- Frontend host shell: `host/`
- Backend services: domain (e.g., `scheduling/`, `api-gateway/`)

### Frontend (target)
- Angular 18
- Webpack 5 Module Federation
- PrimeNG + Tailwind
- Reactive Forms
- PrimeNG: InputNumber, InputText, Dropdown, Calendar, InputSwitch; Card, Table, Toolbar, Divider; Toast, ProgressSpinner; Button

Apps:
- `pmis-frontend/host` (shell)
- `pmis-frontend/scheduling-mfe` (remote)

### Backend (target)
- ASP.NET Core 8 Minimal API
- EF Core (SqlServer)
- FluentValidation
- Serilog (+ Console; Seq optional)
- Scalar.AspNetCore (API docs)
- MediatR (optional)
- ProblemDetails middleware

Apps:
- `pmis-backend/api-gateway`
- `pmis-backend/scheduling`

### Phase 0 Fixups (implemented)
- Reverted frontend build configs to CJS (`tailwind.config.cjs`, `webpack.config.cjs`, `module-federation.config.cjs`)
- Added MF placeholders (host + remote)
- Wired Tailwind content paths; added `src/styles.css` in both MFEs
- Host dev proxy: `/api/*` → `http://localhost:5000`
- YARP in gateway: `/scheduling/*` → `http://localhost:5073`
- Scalar in scheduling: OpenAPI + Scalar UI mapped
- Restored TS-only enforcement script while allowing required CJS configs

### Next Steps
- Scaffold Angular apps fully and integrate `@angular-architects/module-federation`
- Add PrimeNG + Tailwind to MFEs and wire styles via builder/angular.json
- Add EF Core, FluentValidation, Serilog, MediatR, ProblemDetails to backend
- Align turbo pipeline outputs with real Angular/.NET build artifacts
