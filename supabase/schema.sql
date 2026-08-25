-- =====================================================
-- Selah Study — Database Schema
-- Run this in Supabase SQL Editor to create all tables + RLS policies.
-- Each user only sees their own rows thanks to RLS + auth.uid().
-- =====================================================

-- ---------------------------
-- CLASSES
-- ---------------------------
create table public.classes (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  slug          text not null,
  course_code   text not null,
  title         text not null,
  department    text,
  credits       integer,
  color         text,
  instructor    jsonb,                     -- { name, email, officeHours }
  additional_staff jsonb,                  -- [{ role, name, email }]
  meeting_times jsonb,                     -- [{ days, time, location, note }]
  overview      text,
  learning_outcomes jsonb,                 -- string[]
  textbooks     jsonb,                     -- string[]
  grading       jsonb,                     -- [{ item, weight }]
  grading_scale text,
  key_dates     jsonb,                     -- [{ label, date, detail }]
  attendance    text,
  late_policy   text,
  ai_policy     text,
  grade_inquiry_policy text,
  notes         jsonb,                     -- string[]
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (user_id, slug)
);

alter table public.classes enable row level security;

create policy "Users can view their own classes"
  on public.classes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own classes"
  on public.classes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own classes"
  on public.classes for update
  using (auth.uid() = user_id);

create policy "Users can delete their own classes"
  on public.classes for delete
  using (auth.uid() = user_id);

-- ---------------------------
-- READINGS (article/chapter notes tied to a class)
-- ---------------------------
create table public.readings (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  class_id     uuid not null references public.classes(id) on delete cascade,
  slug         text not null,
  title        text not null,
  author       text,
  source       text,
  reading_date text,
  url          text,
  assigned_for text,
  thesis       text,
  summary      text,
  key_ideas    jsonb,                      -- string[]
  key_quotes   jsonb,                      -- [{ quote, note }]
  vocabulary   jsonb,                      -- [{ term, definition }]
  discussion_questions jsonb,              -- string[]
  response_paper_prompts jsonb,            -- string[]
  personal_notes text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (class_id, slug)
);

alter table public.readings enable row level security;

create policy "Users can view their own readings"
  on public.readings for select
  using (auth.uid() = user_id);

create policy "Users can insert their own readings"
  on public.readings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own readings"
  on public.readings for update
  using (auth.uid() = user_id);

create policy "Users can delete their own readings"
  on public.readings for delete
  using (auth.uid() = user_id);

-- ---------------------------
-- RECORDINGS (lecture transcriptions + AI notes)
-- ---------------------------
create table public.recordings (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  class_id        uuid references public.classes(id) on delete set null,
  title           text not null,
  transcript      text not null,
  highlights      jsonb default '[]'::jsonb,
  generated_notes text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.recordings enable row level security;

create policy "Users can view their own recordings"
  on public.recordings for select
  using (auth.uid() = user_id);

create policy "Users can insert their own recordings"
  on public.recordings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own recordings"
  on public.recordings for update
  using (auth.uid() = user_id);

create policy "Users can delete their own recordings"
  on public.recordings for delete
  using (auth.uid() = user_id);

-- ---------------------------
-- INDEXES for fast lookups
-- ---------------------------
create index classes_user_id_idx    on public.classes (user_id);
create index readings_user_id_idx   on public.readings (user_id);
create index readings_class_id_idx  on public.readings (class_id);
create index recordings_user_id_idx on public.recordings (user_id);
create index recordings_class_id_idx on public.recordings (class_id);

-- ---------------------------
-- updated_at trigger
-- ---------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger classes_updated_at    before update on public.classes    for each row execute function public.set_updated_at();
create trigger readings_updated_at   before update on public.readings   for each row execute function public.set_updated_at();
create trigger recordings_updated_at before update on public.recordings for each row execute function public.set_updated_at();
