create extension if not exists "uuid-ossp";
create extension if not exists pg_trgm;

create table companies (
  id uuid primary key,
  name text not null,
  industry text not null,
  locale text not null default 'en',
  timezone text not null default 'UTC',
  domain text,
  logo_url text,
  brand_voice jsonb not null default '{}',
  status text not null default 'active' check (status in ('active', 'suspended', 'trialing', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table users (
  id uuid primary key,
  company_id uuid not null references companies(id),
  name text not null,
  email text not null unique,
  password_hash text,
  role text not null check (role in ('owner', 'admin', 'manager', 'member', 'viewer')),
  status text not null default 'active',
  two_factor_enabled boolean not null default false,
  last_login_at timestamptz,
  created_at timestamptz not null default now()
);

create table user_profiles (
  user_id uuid primary key references users(id) on delete cascade,
  avatar_url text,
  phone text,
  job_title text,
  locale text not null default 'en',
  metadata jsonb not null default '{}'
);

create table user_settings (
  user_id uuid primary key references users(id) on delete cascade,
  theme text not null default 'dark',
  notification_preferences jsonb not null default '{}',
  ai_preferences jsonb not null default '{}'
);

create table user_sessions (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  refresh_token_hash text not null,
  ip_address inet,
  user_agent text,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table user_devices (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  device_name text not null,
  device_fingerprint text not null,
  trusted boolean not null default false,
  last_seen_at timestamptz not null default now()
);

create table roles (
  id uuid primary key,
  company_id uuid references companies(id),
  name text not null,
  description text,
  unique (company_id, name)
);

create table permissions (
  id uuid primary key,
  key text not null unique,
  description text
);

create table role_permissions (
  role_id uuid not null references roles(id) on delete cascade,
  permission_id uuid not null references permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

create table api_tokens (
  id uuid primary key,
  company_id uuid not null references companies(id),
  user_id uuid references users(id),
  name text not null,
  token_hash text not null,
  scopes text[] not null default '{}',
  last_used_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table packages (
  id uuid primary key,
  slug text not null unique,
  name text not null,
  billing_interval text not null,
  price_cents integer,
  currency text not null default 'usd',
  limits jsonb not null default '{}',
  active boolean not null default true
);

create table package_features (
  id uuid primary key,
  package_id uuid not null references packages(id) on delete cascade,
  feature_key text not null,
  label text not null,
  limit_value numeric,
  metadata jsonb not null default '{}'
);

create table subscriptions (
  id uuid primary key,
  company_id uuid not null references companies(id),
  package_id uuid references packages(id),
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null,
  trial_ends_at timestamptz,
  current_period_ends_at timestamptz,
  created_at timestamptz not null default now()
);

create table invoices (
  id uuid primary key,
  company_id uuid not null references companies(id),
  stripe_invoice_id text,
  number text not null,
  amount_cents integer not null,
  tax_cents integer not null default 0,
  currency text not null default 'usd',
  status text not null,
  hosted_url text,
  issued_at timestamptz not null default now()
);

create table transactions (
  id uuid primary key,
  company_id uuid not null references companies(id),
  invoice_id uuid references invoices(id),
  gateway text not null,
  gateway_reference text,
  amount_cents integer not null,
  status text not null,
  created_at timestamptz not null default now()
);

create table wallets (
  company_id uuid primary key references companies(id),
  balance_cents integer not null default 0,
  credits numeric(16,4) not null default 0
);

create table coupons (
  id uuid primary key,
  code text not null unique,
  percent_off numeric(5,2),
  amount_off_cents integer,
  expires_at timestamptz,
  max_redemptions integer,
  active boolean not null default true
);

create table leads (
  id uuid primary key,
  company_id uuid not null references companies(id),
  name text not null,
  email text,
  phone text,
  source text,
  score integer not null default 0,
  stage text not null default 'new',
  owner_user_id uuid references users(id),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table customers (
  id uuid primary key,
  company_id uuid not null references companies(id),
  name text not null,
  email text,
  phone text,
  lifecycle_stage text not null default 'customer',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table pipelines (
  id uuid primary key,
  company_id uuid not null references companies(id),
  name text not null,
  stages jsonb not null default '[]'
);

create table deals (
  id uuid primary key,
  company_id uuid not null references companies(id),
  pipeline_id uuid references pipelines(id),
  lead_id uuid references leads(id),
  customer_id uuid references customers(id),
  title text not null,
  amount_cents integer not null default 0,
  stage text not null,
  probability integer not null default 0,
  close_date date,
  created_at timestamptz not null default now()
);

create table crm_activities (
  id uuid primary key,
  company_id uuid not null references companies(id),
  lead_id uuid references leads(id),
  customer_id uuid references customers(id),
  activity_type text not null,
  notes text,
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table social_accounts (
  id uuid primary key,
  company_id uuid not null references companies(id),
  provider text not null,
  handle text not null,
  encrypted_credentials text,
  status text not null default 'connected'
);

create table social_posts (
  id uuid primary key,
  company_id uuid not null references companies(id),
  account_id uuid references social_accounts(id),
  campaign_id uuid,
  caption text not null,
  media jsonb not null default '[]',
  status text not null check (status in ('draft', 'scheduled', 'published', 'failed')),
  scheduled_at timestamptz,
  published_at timestamptz
);

create table social_analytics (
  id uuid primary key,
  company_id uuid not null references companies(id),
  post_id uuid references social_posts(id),
  impressions integer not null default 0,
  clicks integer not null default 0,
  comments integer not null default 0,
  engagement_rate numeric(6,3) not null default 0,
  captured_at timestamptz not null default now()
);

create table website_projects (
  id uuid primary key,
  company_id uuid not null references companies(id),
  domain text not null,
  name text not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table keywords (
  id uuid primary key,
  company_id uuid not null references companies(id),
  project_id uuid references website_projects(id),
  keyword text not null,
  country text not null default 'US',
  intent text,
  difficulty numeric(5,2),
  volume integer
);

create table competitors (
  id uuid primary key,
  company_id uuid not null references companies(id),
  project_id uuid references website_projects(id),
  domain text not null,
  notes text
);

create table seo_audits (
  id uuid primary key,
  company_id uuid not null references companies(id),
  project_id uuid references website_projects(id),
  status text not null,
  score integer,
  summary text,
  results jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table seo_technical_issues (
  id uuid primary key,
  company_id uuid not null references companies(id),
  audit_id uuid references seo_audits(id) on delete cascade,
  severity text not null,
  url text not null,
  title text not null,
  recommendation text
);

create table agents (
  id uuid primary key,
  company_id uuid not null references companies(id),
  slug text not null,
  name text not null,
  industry_suite text not null,
  capabilities jsonb not null default '[]',
  prompt_template text,
  memory_policy jsonb not null default '{}',
  tool_policy jsonb not null default '{}',
  status text not null default 'idle',
  performance_score numeric(5,2) not null default 0,
  created_at timestamptz not null default now(),
  unique (company_id, slug)
);

create table agent_tasks (
  id uuid primary key,
  company_id uuid not null references companies(id),
  agent_id uuid references agents(id),
  title text not null,
  prompt text not null,
  status text not null check (status in ('queued', 'running', 'needs_approval', 'completed', 'failed')),
  priority integer not null default 5,
  cost_cents integer not null default 0,
  result jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table agent_meetings (
  id uuid primary key,
  company_id uuid not null references companies(id),
  objective text not null,
  moderator_agent_id uuid references agents(id),
  status text not null default 'active' check (status in ('queued', 'active', 'awaiting_approval', 'completed', 'failed')),
  consensus_score numeric(5,2),
  approval_state text not null default 'pending',
  trace_id text,
  summary text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table agent_meeting_participants (
  meeting_id uuid not null references agent_meetings(id) on delete cascade,
  agent_id uuid not null references agents(id),
  role text not null,
  joined_at timestamptz not null default now(),
  primary key (meeting_id, agent_id)
);

create table agent_messages (
  id uuid primary key,
  company_id uuid not null references companies(id),
  meeting_id uuid references agent_meetings(id) on delete cascade,
  agent_id uuid references agents(id),
  role text not null,
  content text not null,
  confidence numeric(5,2),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table agent_votes (
  id uuid primary key,
  meeting_id uuid not null references agent_meetings(id) on delete cascade,
  agent_id uuid not null references agents(id),
  decision text not null,
  confidence numeric(5,2) not null,
  reason text,
  created_at timestamptz not null default now()
);

create table llm_providers (
  id uuid primary key,
  name text not null unique,
  status text not null default 'active',
  encrypted_api_key text,
  routing_weight integer not null default 100,
  rate_limit_per_minute integer,
  cost_policy jsonb not null default '{}'
);

create table ai_requests (
  id uuid primary key,
  company_id uuid not null references companies(id),
  agent_id uuid references agents(id),
  provider_id uuid references llm_providers(id),
  model text not null,
  prompt_hash text not null,
  status text not null,
  trace_id text,
  created_at timestamptz not null default now()
);

create table ai_responses (
  id uuid primary key,
  request_id uuid not null references ai_requests(id) on delete cascade,
  response_hash text,
  summary text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table prompt_logs (
  id uuid primary key,
  company_id uuid not null references companies(id),
  ai_request_id uuid references ai_requests(id) on delete cascade,
  prompt_template_key text,
  prompt_hash text not null,
  redacted_prompt text,
  model text not null,
  trace_id text,
  created_at timestamptz not null default now()
);

create table token_usage (
  id uuid primary key,
  company_id uuid not null references companies(id),
  ai_request_id uuid references ai_requests(id) on delete cascade,
  provider text not null,
  model text not null,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  cached_tokens integer not null default 0,
  cost_cents integer not null default 0,
  created_at timestamptz not null default now()
);

create table agent_traces (
  id uuid primary key,
  company_id uuid not null references companies(id),
  trace_id text not null,
  parent_span_id text,
  span_id text not null,
  agent_id uuid references agents(id),
  event_type text not null,
  payload jsonb not null default '{}',
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create table execution_replays (
  id uuid primary key,
  company_id uuid not null references companies(id),
  trace_id text not null,
  replay_manifest jsonb not null,
  artifact_url text,
  created_at timestamptz not null default now()
);

create table usage_records (
  id uuid primary key,
  company_id uuid not null references companies(id),
  meter text not null,
  quantity numeric(16,4) not null,
  unit text not null,
  provider text,
  trace_id text,
  created_at timestamptz not null default now()
);

create table memories (
  id uuid primary key,
  company_id uuid not null references companies(id),
  source_type text not null,
  memory_type text not null check (memory_type in ('short_term', 'long_term', 'meeting', 'shared_agent')),
  title text not null,
  body text not null,
  vector_namespace text,
  vector_point_id text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table workflows (
  id uuid primary key,
  company_id uuid not null references companies(id),
  name text not null,
  status text not null check (status in ('draft', 'active', 'paused')),
  graph jsonb not null,
  approval_policy jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table workflow_nodes (
  id uuid primary key,
  workflow_id uuid not null references workflows(id) on delete cascade,
  node_key text not null,
  node_type text not null,
  config jsonb not null default '{}',
  position jsonb not null default '{}',
  unique (workflow_id, node_key)
);

create table workflow_runs (
  id uuid primary key,
  company_id uuid not null references companies(id),
  workflow_id uuid not null references workflows(id),
  status text not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  output jsonb
);

create table workflow_logs (
  id uuid primary key,
  company_id uuid not null references companies(id),
  workflow_run_id uuid not null references workflow_runs(id) on delete cascade,
  node_key text,
  level text not null,
  message text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table tool_registry (
  id uuid primary key,
  slug text not null unique,
  name text not null,
  provider text not null,
  risk_level text not null,
  requires_sandbox boolean not null default true,
  requires_human_approval boolean not null default false,
  schema jsonb not null default '{}',
  active boolean not null default true
);

create table tool_connections (
  id uuid primary key,
  company_id uuid not null references companies(id),
  tool_id uuid not null references tool_registry(id),
  name text not null,
  encrypted_credentials text,
  scopes text[] not null default '{}',
  status text not null default 'connected',
  created_at timestamptz not null default now()
);

create table tool_executions (
  id uuid primary key,
  company_id uuid not null references companies(id),
  tool_id uuid not null references tool_registry(id),
  agent_task_id uuid references agent_tasks(id),
  status text not null,
  input_hash text,
  output_hash text,
  risk_level text not null,
  trace_id text,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create table sandbox_jobs (
  id uuid primary key,
  company_id uuid not null references companies(id),
  tool_execution_id uuid references tool_executions(id),
  runtime text not null,
  image text,
  network_policy text not null default 'restricted',
  filesystem_policy text not null default 'ephemeral',
  cpu_limit numeric(6,2),
  memory_limit_mb integer,
  timeout_seconds integer,
  status text not null default 'queued',
  logs_url text,
  created_at timestamptz not null default now(),
  finished_at timestamptz
);

create table approval_requests (
  id uuid primary key,
  company_id uuid not null references companies(id),
  requested_by_agent_id uuid references agents(id),
  requested_by_user_id uuid references users(id),
  target_type text not null,
  target_id uuid,
  action text not null,
  risk_level text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'expired')),
  reason text,
  decided_by_user_id uuid references users(id),
  decided_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table website_builder_projects (
  id uuid primary key,
  company_id uuid not null references companies(id),
  agent_id uuid references agents(id),
  business_type text not null,
  brand_colors jsonb not null default '[]',
  design_style text not null,
  language text not null,
  pages jsonb not null default '[]',
  generated_code text,
  seo_score integer,
  accessibility_score text,
  performance_score integer,
  created_at timestamptz not null default now()
);

create table tickets (
  id uuid primary key,
  company_id uuid not null references companies(id),
  requester_id uuid not null references users(id),
  assignee_id uuid references users(id),
  subject text not null,
  status text not null default 'open',
  priority text not null default 'medium',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table ticket_replies (
  id uuid primary key,
  ticket_id uuid not null references tickets(id) on delete cascade,
  user_id uuid references users(id),
  body text not null,
  internal boolean not null default false,
  created_at timestamptz not null default now()
);

create table ticket_attachments (
  id uuid primary key,
  ticket_id uuid not null references tickets(id) on delete cascade,
  file_url text not null,
  mime_type text,
  size_bytes integer,
  created_at timestamptz not null default now()
);

create table notification_templates (
  id uuid primary key,
  key text not null unique,
  channel text not null,
  locale text not null,
  subject text,
  body text not null
);

create table notifications (
  id uuid primary key,
  company_id uuid not null references companies(id),
  user_id uuid references users(id),
  type text not null,
  title text not null,
  body text not null,
  read_at timestamptz,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table email_logs (
  id uuid primary key,
  company_id uuid references companies(id),
  to_email text not null,
  template_key text,
  status text not null,
  provider_message_id text,
  created_at timestamptz not null default now()
);

create table system_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table feature_flags (
  key text primary key,
  enabled boolean not null default false,
  rules jsonb not null default '{}'
);

create table audit_logs (
  id uuid primary key,
  company_id uuid references companies(id),
  actor_user_id uuid references users(id),
  action text not null,
  target_type text not null,
  target_id text,
  ip_address inet,
  risk_level text not null default 'low',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index idx_users_company_status on users(company_id, status);
create index idx_sessions_user_expires on user_sessions(user_id, expires_at);
create index idx_agents_company_status on agents(company_id, status);
create index idx_tasks_company_status on agent_tasks(company_id, status, priority);
create index idx_meetings_company_status on agent_meetings(company_id, status, created_at desc);
create index idx_agent_messages_meeting on agent_messages(meeting_id, created_at);
create index idx_approvals_company_status on approval_requests(company_id, status, risk_level);
create index idx_workflows_company_status on workflows(company_id, status);
create index idx_tool_exec_company_trace on tool_executions(company_id, trace_id);
create index idx_sandbox_company_status on sandbox_jobs(company_id, status, created_at);
create index idx_memories_company_type on memories(company_id, memory_type, created_at desc);
create index idx_usage_company_meter on usage_records(company_id, meter, created_at desc);
create index idx_token_usage_company_model on token_usage(company_id, provider, model, created_at desc);
create index idx_agent_traces_trace on agent_traces(company_id, trace_id, started_at);
create index idx_audit_company_created on audit_logs(company_id, created_at desc);
create index idx_tickets_company_status on tickets(company_id, status, priority);
create index idx_notifications_user_read on notifications(user_id, read_at, created_at desc);
create index idx_leads_company_stage on leads(company_id, stage, score desc);
create index idx_deals_company_stage on deals(company_id, stage, close_date);
create index idx_keywords_company_project on keywords(company_id, project_id);
create index idx_social_posts_company_status on social_posts(company_id, status, scheduled_at);
