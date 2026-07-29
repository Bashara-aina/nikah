-- 0001_guests.sql — guest list, RSVP, and wishes storage.
--
-- Run once in the Supabase SQL Editor (Dashboard → SQL Editor → New query → Run).
--
-- RLS is enabled with no policies on purpose: every read and write goes through
-- Next.js route handlers using the secret key, which bypasses RLS. The
-- publishable key therefore has zero access to guest phone numbers even if it
-- leaks, and no Supabase call is ever made from the browser.

create extension if not exists pgcrypto;

do $$ begin
  create type guest_group as enum ('groom_family', 'bride_family', 'friend');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type invite_type as enum ('venue', 'online');
exception when duplicate_object then null;
end $$;

create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  -- Typed by the couple, not derived. Lowercase kebab-case; forms the URL
  -- `/undangan/<slug>`. The invite type is deliberately NOT in the URL, so a
  -- guest editing the address cannot upgrade themselves to the venue variant.
  slug text not null unique
    constraint guests_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  -- Printed verbatim in the invitation, honorific included
  -- (e.g. "Bapak Achmad Fuad Bay").
  display_name text not null constraint guests_display_name_present check (length(btrim(display_name)) > 0),
  whatsapp_name text,
  -- E.164 digits, no leading '+' — the shape wa.me expects.
  phone text constraint guests_phone_format check (phone is null or phone ~ '^[1-9][0-9]{7,14}$'),
  guest_group guest_group not null default 'friend',
  invite_type invite_type not null default 'venue',
  -- "Beserta Keluarga", "& Partner", or empty for a single guest.
  party_label text not null default '',
  -- Caps the RSVP party selector for this guest.
  party_max smallint not null default 2
    constraint guests_party_max_range check (party_max between 1 and 10),
  -- Overrides the group template for this guest only; null = use the template.
  message_override text,
  notes text,
  invited_at timestamptz,
  opened_count integer not null default 0,
  opened_first_at timestamptz,
  opened_last_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists guests_guest_group_idx on guests (guest_group);
create index if not exists guests_invite_type_idx on guests (invite_type);
create index if not exists guests_created_at_idx on guests (created_at desc);

create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  -- Null when someone RSVPs from the public link instead of a personal one.
  guest_id uuid references guests (id) on delete set null,
  nama text not null,
  kehadiran text not null
    constraint rsvps_kehadiran_allowed
    check (kehadiran in ('Hadir', 'Tidak Hadir', 'Masih Diusahakan', 'Menyaksikan Daring')),
  jumlah smallint not null default 1
    constraint rsvps_jumlah_range check (jumlah between 1 and 10),
  catatan text not null default '',
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists rsvps_guest_id_idx on rsvps (guest_id);
create index if not exists rsvps_created_at_idx on rsvps (created_at desc);

create table if not exists wishes (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid references guests (id) on delete set null,
  nama text not null,
  pesan text not null,
  created_at timestamptz not null default now()
);

create index if not exists wishes_created_at_idx on wishes (created_at desc);

create or replace function set_updated_at() returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists guests_set_updated_at on guests;
create trigger guests_set_updated_at
  before update on guests
  for each row execute function set_updated_at();

-- Records an invitation open without a read-modify-write round trip.
create or replace function track_guest_open(guest_slug text) returns void
language sql
as $$
  update guests
     set opened_count = opened_count + 1,
         opened_first_at = coalesce(opened_first_at, now()),
         opened_last_at = now()
   where slug = guest_slug;
$$;

alter table guests enable row level security;
alter table rsvps enable row level security;
alter table wishes enable row level security;
