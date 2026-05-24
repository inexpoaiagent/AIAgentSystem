# Production QA Protocol

This product must be tested as a paying enterprise customer, not as a static design.

## Customer Scenarios

1. Signup -> onboarding -> subscription -> team setup -> workflow creation -> agent execution -> report.
2. SEO audit -> content plan -> social campaign -> approval -> publishing workflow.
3. Ticket creation -> admin response -> notification delivery -> status closure.
4. Agent meeting -> task split -> human approval -> sandbox execution -> memory sync.

## No-Dead-Action Rule

Every visible action must do at least one of the following:

- Navigate to a valid route.
- Validate and submit a form.
- Create a runtime event.
- Open a configuration flow.
- Queue an approval.
- Create a notification.
- Export or download an artifact.

Dead buttons are treated as release blockers.

## Required Checks

- All routes resolve or render the professional NotFound page.
- Forms have validation, loading, success, and friendly error states.
- Sensitive actions create approval requests before execution.
- Runtime actions are logged to the notification/event feed.
- Agent actions produce trace IDs and are visible in observability.
- Mobile layouts preserve readable text and usable controls.
- Persian RTL layout is manually checked on landing and key dashboards.
- Production build completes without chunk warnings.

## Security Checks

- Auth flows never expose raw backend errors.
- High-risk actions are blocked by human approval policy.
- API tokens and external credentials are represented as encrypted secrets.
- File uploads must be validated by type, size, and tenant policy.
- Tool execution must run in an isolated runtime unless explicitly trusted.

## Performance Checks

- Frontend routes are code-split by vendor groups.
- Long-running agent work is queued, not handled in request/response paths.
- Observability writes are append-only and indexed by `company_id` and `trace_id`.
- Token and model routing is measured by provider, model, cache hit, and task type.
