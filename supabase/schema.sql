-- Run in Supabase SQL editor.
create table stalls (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  owner text
);

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  role text not null check (role in ('admin', 'stall')),
  stall_id uuid references stalls,
  name text
);

create table sales (
  id uuid primary key default gen_random_uuid(),
  stall_id uuid not null references stalls,
  item text not null,
  qty int not null default 1 check (qty > 0),
  amount numeric not null check (amount >= 0), -- total for the line, in rupees
  mode text not null default 'cash' check (mode in ('cash', 'upi')),
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);

create or replace function is_admin() returns boolean
language sql security definer stable as
$$ select exists (select 1 from profiles where id = auth.uid() and role = 'admin') $$;

create or replace function my_stall() returns uuid
language sql security definer stable as
$$ select stall_id from profiles where id = auth.uid() $$;

alter table stalls enable row level security;
alter table profiles enable row level security;
alter table sales enable row level security;

create policy "stalls readable" on stalls for select to authenticated using (true);
create policy "own profile" on profiles for select to authenticated using (id = auth.uid() or is_admin());
create policy "sales read" on sales for select to authenticated using (is_admin() or stall_id = my_stall());
create policy "sales insert" on sales for insert to authenticated with check (stall_id = my_stall());
create policy "sales delete" on sales for delete to authenticated using (is_admin() or stall_id = my_stall());

insert into stalls (name, owner) values
  ('Drayen X Cakebowls', 'Jaswanth, Anurag'),
  ('Gaming', 'Vardhan, Thomas'),
  ('Beverages', 'Ganesh, Karthik'),
  ('Popsicles', 'Ktrishank, Ramcharan, Sai Madhu, Manishankar, Lokesh Sai'),
  ('Get Your Bag & Mojitos', 'Mirdati Tanuj, Aditya kirshna, Vinaayak, Ramanand, Sri charan'),
  ('Crochet', 'Harsha'),
  ('Wall Posters & Stickers', 'CIE Stall'),
  ('360 Cam', 'CIE Stall');

-- After creating users in Authentication > Users, link them:
-- insert into profiles (id, role, name) values ('<admin-uid>', 'admin', 'Admin');
-- insert into profiles (id, role, stall_id, name)
--   values ('<uid>', 'stall', (select id from stalls where name = 'Popsicles'), 'Popsicles');
