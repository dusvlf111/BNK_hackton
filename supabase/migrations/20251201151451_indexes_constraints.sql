set statement_timeout = 0;
set lock_timeout = 0;
set idle_in_transaction_session_timeout = 0;
set client_encoding = 'UTF8';
set standard_conforming_strings = on;
select pg_catalog.set_config('search_path', 'public', false);

alter table public.guardians
	add constraint guardians_user_fk
		foreign key (user_id)
		references public.users (id)
		on delete cascade,
	add constraint guardians_guardian_fk
		foreign key (guardian_id)
		references public.users (id)
		on delete cascade;

alter table public.transactions
	add constraint transactions_user_fk
		foreign key (user_id)
		references public.users (id)
		on delete cascade,
	add constraint transactions_guardian_fk
		foreign key (guardian_id)
		references public.users (id)
		on delete set null,
	add constraint transactions_risk_score_check
		check (risk_score between 0 and 100),
	add constraint transactions_status_check
		check (status in ('pending', 'requires_review', 'blocked', 'approved'));

alter table public.voice_calls
	add constraint voice_calls_transaction_fk
		foreign key (transaction_id)
		references public.transactions (id)
		on delete cascade;

alter table public.alerts
	add constraint alerts_user_fk
		foreign key (user_id)
		references public.users (id)
		on delete cascade,
	add constraint alerts_guardian_fk
		foreign key (guardian_id)
		references public.users (id)
		on delete cascade,
	add constraint alerts_transaction_fk
		foreign key (transaction_id)
		references public.transactions (id)
		on delete cascade;

create index if not exists transactions_user_created_idx
	on public.transactions (user_id, created_at desc);

create index if not exists alerts_guardian_is_read_idx
	on public.alerts (guardian_id, is_read);
