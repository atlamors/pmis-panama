# PMIS Panama Monorepo

Turborepo-managed monorepo for front-end MFEs (Angular) and back-end microservices (.NET 8). This repository contains both the web **micro-frontend** applications and the .NET **microservice** APIs in one unified codebase.

## Structure

The codebase is divided into two main sections: **pmis-frontend/** (Angular apps) and **pmis-backend/** (ASP.NET Core services). Key directories include:

```filetree
pmis-frontend/
  host/
  scheduling-mfe/
pmis-backend/
  api-gateway/
  scheduling/
pmis-docs/
```

## Prerequisites

* **Node.js** – version 18 or above (Node 20+ recommended)
* **pnpm** – JavaScript package manager (v7+; install via `npm i -g pnpm`)
* **.NET 8 SDK** – for running the backend services

> **Note:** Ensure these tools are installed and available in your PATH before proceeding.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-org/pmis-panama.git
   cd pmis-panama
   ```
2. **Install dependencies** in all projects:

   ```bash
   pnpm install
   ```

### Running Locally

3. **Start the development servers** (in separate terminals if not using the all-in-one command):

   * **All apps**: `pnpm dev` – starts the Angular host on **localhost:4200** and the API Gateway on **localhost:5000**. (The Scheduling MFE is lazy-loaded under the host at `/scheduling`.)
   * **Frontend only**: `pnpm dev:fe` – runs only the Angular applications (host shell and MFEs).
   * **Backend only**: `pnpm dev:be` – runs only the .NET services (API Gateway and microservices).

Once running, open **[http://localhost:4200](http://localhost:4200)** to view the web application. The host UI will proxy API calls to **[http://localhost:5000/api/](http://localhost:5000/api/)** (served by the API Gateway).

## Common Commands

* **Build**: `pnpm build` – Compile and bundle all apps for production.
* **Test**: `pnpm test` – Run the full test suite for both frontends and backends.
* **Clean**: `pnpm clean` – Remove all node modules and build artifacts.

*(Run `pnpm <command>:fe` or `pnpm <command>:be` to target only Frontend or Backend, respectively, for certain commands like `dev`, `test`, etc.)*

## Documentation

For more details on project standards and architecture, see the **internal documentation** in `/pmis-docs`:

* **Contributing Guidelines** – development process, branching strategy, and code style conventions.
* **Development Guide** – workflow, best practices, and coding standards.
* **Architecture Overview** – system design and Micro-Frontend architecture details.

Be sure to review these docs for in-depth information on the codebase and development workflow.
