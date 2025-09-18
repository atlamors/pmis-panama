# AGENTS.md — PMIS Monorepo

## Mission

You are assisting on a micro-frontend + microservice MVP.
Default to **KISS** (Keep It Simple, Stupid).
Preserve the architecture.
Never introduce new frameworks, dependencies, or cross-cutting changes without justification and human approval.

---

## Core Principles (Invariants)

* **Single entrypoint:** Frontend code calls a single API gateway; no direct service calls.
* **Contracts are law:** All communication between frontends and services uses versioned contracts (e.g., OpenAPI specs → generated clients).
* **Type safety:** Consumers never hand-roll DTOs. Generated clients are the only source of truth.
* **Security:**
  * No secrets in the repo.
  * Always use `.env.example` for new variables.
  * Assume OIDC-based auth for CI/CD.
* **Reliability:**
  * Services must expose health endpoints.
  * Errors should use structured formats (Problem Details or equivalent).
* **Accessibility:** UIs must remain keyboard-navigable with sufficient contrast and semantic markup.

---

## Conventions

* **Repo layout:**

  * Backend services → `pmis-backend/<domain>/`
  * API gateway → `pmis-backend/api-gateway/`
  * Frontend host shell → `pmis-frontend/host/`
  * Frontend MFEs → `pmis-frontend/<domain>-mfe/`
  * Shared packages (contracts, configs, clients) → `packages/`

* **Repo naming (mirrors):**

  * Frontend host → `pmis-frontend-host`
  * Frontend MFE → `pmis-frontend-<domain>-mfe`
  * Backend service → `pmis-backend-<domain>`
  * Gateway → `pmis-backend-api-gateway`

* **Contracts:**

  * Generated and stored in `packages/pmis-shared`.
  * Must be semver versioned.
  * All consuming apps must import the generated package.

---

## Coding Standards

* Coding standards, commit conventions, and PR rules are defined in [CONTRIBUTING.md](CONTRIBUTING.md).
* Agents must follow those guidelines when generating or modifying code.
* **Frontend (Angular):**

  * Standalone components and Reactive Forms by default.
  * Tailwind for layout and spacing.
  * Use approved component library (currently PrimeNG).
  * No custom CSS unless Tailwind cannot express the requirement.
* **Backend (.NET):**

  * Minimal APIs with record types for DTOs.
  * FluentValidation for request validation.
  * Serilog for logging.
  * Scalar (or equivalent) for API docs.

---

## Process Control (for Agents)

* **Small changes:**

  * You may implement directly (e.g., add a component, add a validator, wire a route).
* **Large or cross-cutting changes:**

  * You must propose a plan first (diff summary or outline).
  * Wait for human confirmation before making edits.
* **Dangerous changes:**

  * Deleting files, altering contracts, changing gateway paths → must always be clarified first.
  * Provide a rollback note (what to revert if change is rejected).

---

## Testing & Quality Expectations

* Follow testing requirements outlined in [CONTRIBUTING.md](CONTRIBUTING.md).
* **Unit tests:**

  * Angular: components, services, utilities.
  * .NET: validators, Minimal API handlers.
* **Integration tests:**

  * At least one end-to-end happy path per service.
* **Coverage baseline:**

  * Maintain or improve repo-wide coverage.
  * New modules should include tests that demonstrate critical paths.
* **Golden tests:**

  * Preserve contract schemas (e.g., OpenAPI snapshots) to detect breaking changes.
* **CI/CD gates:**

  * Code must build, lint, and test cleanly in affected apps.
  * Services must containerize successfully.
  * No merge without passing checks.

---

## Safety Rails

* ✅ You may:

  * Create or modify code within a single app.
  * Regenerate clients from contracts.
  * Update docs alongside code.
* ⛔ Do not:

  * Store secrets.
  * Hand-edit generated clients.
  * Introduce new libraries, frameworks, or services without explicit approval.
  * Change gateway entrypoints or cross-cutting contracts on your own.
* ❓ Always ask before:

  * Large refactors or reorganizations.
  * Changes that affect more than one app.
  * Adjusting architectural invariants (gateway, contracts, type enforcement).

---

## Expected Outcomes

Following this guide ensures that:

* Agents contribute code consistent with human standards.
* Contracts remain the single source of truth across frontends and services.
* CI/CD runs cleanly without surprises.
* Human developers remain in control of risky or structural changes.
* The repo evolves predictably, without spaghetti drift.

---

This file is the **rules of engagement for all agents**.
If in doubt → stop, ask, clarify.
Agents must also comply with [CONTRIBUTING.md](CONTRIBUTING.md).
