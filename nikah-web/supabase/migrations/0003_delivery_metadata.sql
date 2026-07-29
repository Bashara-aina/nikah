alter table public.guests
  add column if not exists alternative_channel text,
  add column if not exists reminder_note text;
