# Laravel Backend Blueprint

This folder documents the Laravel service that should back the UI.

Recommended modules:

- `Auth`: Sanctum, OAuth, SSO hooks, MFA-ready user model.
- `Tenancy`: company resolution, tenant middleware, tenant-scoped policies.
- `Billing`: Stripe plans, invoices, coupons, usage metering, trials.
- `Agents`: installed agents, capabilities, task dispatch, approval policies.
- `Workflows`: triggers, node graph, queue-backed execution, retry policies.
- `Memory`: canonical memories, document ingestion, vector sync jobs.
- `Voice`: session creation, provider tokens, minute metering, summaries.
- `Audit`: immutable logs for admin and compliance review.

The sample migration and API contract files are intentionally framework-light so the generated UI can evolve while preserving production architecture decisions.
