-- 0004_event_checkin.sql — day-of checklists on each guest.
--
-- Run once in the Supabase SQL Editor (Dashboard → SQL Editor → New query → Run).
--
-- Mirrors `invited_at`: stamp when checked, clear when unchecked.
-- `attended_at`  = guest showed up at the venue (kedatangan)
-- `souvenir_at`  = guest already collected their souvenir

alter table public.guests
  add column if not exists attended_at timestamptz,
  add column if not exists souvenir_at timestamptz;
