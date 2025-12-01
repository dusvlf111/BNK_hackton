set statement_timeout = 0;
set lock_timeout = 0;
set idle_in_transaction_session_timeout = 0;
set client_encoding = 'UTF8';
set standard_conforming_strings = on;
select pg_catalog.set_config('search_path', 'public', false);

alter table public.users enable row level security;
alter table public.transactions enable row level security;
alter table public.alerts enable row level security;

create policy "service role full access on users"
	on public.users for all
	using (auth.role() = 'service_role')
	with check (auth.role() = 'service_role');

create policy "users select self"
	on public.users for select
	using (auth.uid() = id);

create policy "users update self"
	on public.users for update
	using (auth.uid() = id)
	with check (auth.uid() = id);

create policy "service role full access on transactions"
	on public.transactions for all
	using (auth.role() = 'service_role')
	with check (auth.role() = 'service_role');

create policy "transactions owner read"
	on public.transactions for select
	using (auth.uid() = user_id);

create policy "transactions owner write"
	on public.transactions for insert
	with check (auth.uid() = user_id);

create policy "transactions owner update"
	on public.transactions for update
	using (auth.uid() = user_id)
	with check (auth.uid() = user_id);

create policy "transactions guardian read"
	on public.transactions for select
	using (
		exists (
			select 1 from public.guardians g
			where g.user_id = transactions.user_id
			  and g.guardian_id = auth.uid()
			  and g.status = 'accepted'
		)
	);

create policy "service role full access on alerts"
	on public.alerts for all
	using (auth.role() = 'service_role')
	with check (auth.role() = 'service_role');

create policy "alerts owner read"
	on public.alerts for select
	using (auth.uid() = user_id);

create policy "alerts guardian read"
	on public.alerts for select
	using (auth.uid() = guardian_id);
