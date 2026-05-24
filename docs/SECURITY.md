# Security Architecture

## Authentication

- JWT access tokens with short TTL.
- Rotating refresh tokens stored as hashes in `user_sessions`.
- Optional OAuth/SSO and 2FA per company policy.
- Device trust tracking through `user_devices`.

## Authorization

- RBAC through `roles`, `permissions`, and `role_permissions`.
- Company tenant middleware required on all business routes.
- Agent tool calls require both user permission and agent tool policy.
- Admin and customer dashboards are separated by route, permission, and audit domain.

## Data Protection

- Encrypt API keys, OAuth tokens, webhook secrets, and file credentials.
- Store file uploads in private object storage with signed URLs.
- Use tenant-scoped Qdrant namespaces and PostgreSQL indexes that start with `company_id`.
- Log all high-risk actions in `audit_logs` with IP, actor, target, and trace ID.

## Application Security

- CSRF protection for browser sessions.
- Rate limiting by user, company, route, token, and AI meter.
- Strict file validation for attachments and website-builder assets.
- XSS prevention through escaped rendering and sanitized HTML/code previews.
- SQL injection prevention through ORM parameter binding and migrations.

## Operations

- OpenTelemetry trace IDs across frontend, API, queues, AI engine, and tool runner.
- Prometheus metrics for queues, agent success, token cost, voice latency, and error budgets.
- Backups for PostgreSQL, object storage, and critical configuration.
- Incident alerts for provider failures, billing anomalies, token spikes, and suspicious logins.
