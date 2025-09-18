# Contributing to PMIS Monorepo

Thank you for your interest in contributing!
This repository follows enterprise-grade practices to ensure quality, security, and maintainability across all teams.

---

## 📋 Code of Conduct

All contributors must follow our [Code of Conduct](CODE_OF_CONDUCT.md).
Treat each other with respect. Harassment or inappropriate behavior will not be tolerated.

---

## 🏗 Repository Structure

### Backend (`pmis-backend/`)
- `api-gateway/` → ASP.NET Core reverse proxy gateway (YARP).
- `scheduling/` → ASP.NET Core scheduling microservice (Minimal API, EF Core, Scalar).

### Frontend (`pmis-frontend/`)
- `host/` → Angular host shell (Tailwind + PrimeNG, Webpack Module Federation).
- `scheduling-mfe/` → Angular remote micro-frontend for scheduling.

### Shared & Meta
- `packages/` → Shared libraries, contracts, generated clients, configurations (future use).
- `docs/` → Developer setup, contracts lifecycle, CI/CD processes.
- `AGENTS.md` → Rules of engagement for AI agents.
- `CONTRIBUTING.md` → Contribution guidelines.
- `turbo.json`, `pnpm-workspace.yaml` → Turborepo + workspace config.

---

## 🔀 Branching Strategy

* `main` → Production-ready code. Protected branch.
* `develop` → Integration branch for upcoming releases.
* Feature branches → `feature/<ticket-id>-short-description`
* Bugfix branches → `fix/<ticket-id>-short-description`
* Hotfix branches → `hotfix/<ticket-id>-short-description`

All changes must flow through **Pull Requests**.

---

## ✅ Commit Messages

We use **Conventional Commits**:

* `feat: add new scheduling API endpoint`
* `fix: correct validation logic for vessel types`
* `docs: update contracts lifecycle`
* `chore: dependency bump for Angular`

This allows automated changelogs and semantic versioning.

---

## 🔎 Pull Requests

* All PRs must target `develop` (unless hotfix).
* PRs must pass CI (build, lint, test) before review.
* At least **1 approval** from a domain CODEOWNER is required.
* Include a clear description of the change, its impact, and any contract updates.
* Link the relevant Jira ticket (or issue).

---

## 🧪 Testing Expectations

* Unit tests are mandatory for new features and bug fixes.
* Integration tests required when adding/modifying APIs.
* Golden contract tests must be updated if schemas change.
* Coverage must not decrease; aim for **70%+** per app.

Run tests locally before opening a PR:

```bash
pnpm test
```

---

## 🖊 Code Style & Standards

* **TypeScript**: Prettier + ESLint.
* **C#**: `dotnet format`.
* **Angular**: Standalone components + Reactive Forms.
* **.NET APIs**: Minimal API style, FluentValidation, ProblemDetails for errors.
* **UI**: Tailwind for layout/spacing, approved component library only.

---

## 🔒 Security Guidelines

* Never commit secrets, tokens, or credentials.
* Use `.env.example` to document new env vars.
* All dependencies must be approved licenses (MIT, Apache 2.0, BSD, MPL 2.0).
* Paid/closed dependencies require approval.

---

## 🚀 CI/CD

CI/CD is handled per app/service with reusable workflows.
Your PR must pass:

* Build + lint + test jobs (per app touched).
* Docker image build for backend services.
* Static analysis/security scans.

---

## 📜 Contracts

Contracts are source of truth for communication between services and MFEs:

* Defined via OpenAPI specs.
* Generated clients stored in `packages/pmis-shared`.
* Do not hand-edit generated clients.
* Contract changes must bump semver and be reviewed by platform owners.

---

## 🧭 Getting Help

* **Slack/Teams channel:** `#pmis-dev`
* **Platform owners:** `@platform-team`
* **Domain owners:** See `CODEOWNERS` file.
* For urgent production issues, escalate via the on-call rotation.

---

## 🎉 Final Notes

Contributions of all sizes are welcome—bug fixes, docs, or features.
By following these guidelines, we ensure a consistent, reliable, and secure codebase for all teams.
