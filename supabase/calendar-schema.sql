-- =====================================================
-- Selah Study — Google Calendar connection
-- Run this in the Supabase SQL Editor after schema.sql.
--
-- Google Calendar itself stores the events; this table only holds the
-- OAuth tokens that let the site act on your behalf.
--
-- Safe to run more than once.
-- =====================================================

create table if not exists public.google_tokens (
  user_id       uuid primary key references auth.users(id) on delete cascade,
  refresh_token text not null,
  access_token  text,
  expires_at    timestamptz,
  google_email  text,
  calendar_id   text not null default 'primary',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.google_tokens enable row level security;

drop policy if exists "Users can view their own google tokens" on public.google_tokens;
create policy "Users can view their own google tokens"
  on public.google_tokens for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own google tokens" on public.google_tokens;
create policy "Users can insert their own google tokens"
  on public.google_tokens for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own google tokens" on public.google_tokens;
create policy "Users can update their own google tokens"
  on public.google_tokens for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete their own google tokens" on public.google_tokens;
create policy "Users can delete their own google tokens"
  on public.google_tokens for delete
  using (auth.uid() = user_id);
