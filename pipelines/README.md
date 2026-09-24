# CI/CD pipelines

This directory contains pipeline definitions for validating, packaging, and eventually deploying Banddle.

- `ci.yml` performs repeatable continuous-integration checks.
- Deployment stages will be added only after the Azure infrastructure and environment strategy are agreed.
- Secrets must come from protected pipeline variables or Azure Key Vault, never from YAML files.
