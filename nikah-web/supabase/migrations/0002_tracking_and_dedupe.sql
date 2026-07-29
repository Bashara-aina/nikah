alter table public.guests
  add column if not exists opened_confirmed_count integer not null default 0,
  add column if not exists opened_confirmed_at timestamptz;

create or replace function public.confirm_guest_open(guest_slug text) returns void
language sql
security invoker
set search_path = public
as $$
  update public.guests
     set opened_confirmed_count = opened_confirmed_count + 1,
         opened_confirmed_at = now(),
         opened_last_at = now()
   where slug = guest_slug;
$$;

create or replace view public.latest_rsvps
with (security_invoker = true)
as
select distinct on (guest_id) *
  from public.rsvps
 where guest_id is not null
 order by guest_id, created_at desc;

alter table public.wishes
  add column if not exists hidden boolean not null default false;

create index if not exists wishes_visible_idx
  on public.wishes (created_at desc)
  where not hidden;

create table if not exists public.auth_attempts (
  ip text not null,
  attempted_at timestamptz not null default now()
);

create index if not exists auth_attempts_ip_idx
  on public.auth_attempts (ip, attempted_at desc);

alter table public.auth_attempts enable row level security;

revoke all on table public.guests from anon, authenticated;
revoke all on table public.rsvps from anon, authenticated;
revoke all on table public.wishes from anon, authenticated;
revoke all on table public.auth_attempts from anon, authenticated;
revoke all on table public.latest_rsvps from anon, authenticated;
revoke execute on function public.track_guest_open(text) from public, anon, authenticated;
revoke execute on function public.confirm_guest_open(text) from public, anon, authenticated;

grant select, insert, update, delete on table public.guests to service_role;
grant select, insert, update, delete on table public.rsvps to service_role;
grant select, insert, update, delete on table public.wishes to service_role;
grant select, insert, update, delete on table public.auth_attempts to service_role;
grant select on table public.latest_rsvps to service_role;
grant execute on function public.track_guest_open(text) to service_role;
grant execute on function public.confirm_guest_open(text) to service_role;
