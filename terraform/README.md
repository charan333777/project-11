# Terraform infrastructure

Terraform will define the Azure infrastructure required to run and observe Banddle.

## Planned layout

- `modules/` contains reusable infrastructure building blocks.
- `environments/dev/` composes modules for development.
- `environments/staging/` composes modules for pre-production validation.
- `environments/prod/` composes modules for production.

No cloud resources are defined yet. Provider versions, naming, regions, cost limits, remote state, and authentication will be decided before the first resource is created.

Never commit Terraform state, plan files, credentials, subscription secrets, or variable files containing sensitive values.
