create extension if not exists "pgcrypto";

set statement_timeout = 0;
set lock_timeout = 0;
set idle_in_transaction_session_timeout = 0;
set client_encoding = 'UTF8';
set standard_conforming_strings = on;
select pg_catalog.set_config('search_path', 'public', false);

create table if not exists public.users (
	id uuid primary key default gen_random_uuid(),
	email text not null unique,
	phone text,
	name text,
	role text not null default 'user',
	created_at timestamptz not null default timezone('utc', now()),
	updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.guardians (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null,
	guardian_id uuid not null,
	permissions jsonb not null default '{}'::jsonb,
	status text not null default 'pending',
	created_at timestamptz not null default timezone('utc', now()),
	updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.transactions (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null,
	guardian_id uuid,
	amount numeric(14,2) not null,
	merchant_name text not null,
	merchant_category text not null,
	risk_score int not null default 0,
	risk_level text not null default 'low',
	risk_reasons jsonb not null default '[]'::jsonb,
	status text not null default 'pending',
	voice_call_sid text,
	voice_responses jsonb not null default '[]'::jsonb,
	guardian_action text,
	created_at timestamptz not null default timezone('utc', now()),
	updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.voice_calls (
	id uuid primary key default gen_random_uuid(),
	transaction_id uuid not null,
	call_sid text not null,
	duration_seconds int,
	responses jsonb not null default '[]'::jsonb,
	recording_url text,
	created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.alerts (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null,
	guardian_id uuid,
	transaction_id uuid,
	type text not null,
	severity text not null,
	message text,
	payload jsonb not null default '{}'::jsonb,
	is_read boolean not null default false,
	created_at timestamptz not null default timezone('utc', now())
);

