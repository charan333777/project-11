# Banddle frontend demo

This folder contains the frontend-only Banddle application used by the Azure DevOps learning project.
It was copied from `/Users/charan/Desktop/a-version-1` without changing that original project.

## Demo behaviour

- No Supabase project, backend, secrets, or environment variables are required.
- Accounts, job applications, profile changes, and contact messages are stored in browser local storage.
- The seeded login is `demo@banddle.local` with password `Demo123!`.
- Every verification flow uses the demo code `12345678`.
- Data is for demonstration only and can be cleared through browser storage.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Node.js 20.9 or newer is required.

## Validation

```bash
npm run lint
npm run typecheck
npm run build
```

Run all validation checks together with `npm run verify` or `./scripts/verify.sh`.

## DevOps structure

- `Dockerfile` packages the application as a non-root production container with a health check.
- `pipelines/` contains CI/CD definitions.
- `terraform/` contains reusable modules and environment compositions.
- `scripts/` contains repeatable operational commands.
- `docs/architecture/` records design decisions and diagrams.
- `docs/reliability/` records availability and recovery requirements.
- `docs/runbooks/` contains operational procedures.
- `docs/security/` records security controls and decisions.
