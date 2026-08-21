create extension if not exists "pgcrypto";

create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'admin' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null default 'Custom sofas',
  description text,
  price_label text,
  image_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  path text not null unique,
  public_url text not null,
  kind text not null check (kind in ('image', 'video')),
  alt_text text,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists products_status_idx on public.products(status);
create index if not exists products_featured_idx on public.products(featured) where featured = true;
create index if not exists enquiries_status_idx on public.enquiries(status);
create index if not exists enquiries_created_at_idx on public.enquiries(created_at desc);
create index if not exists media_assets_created_at_idx on public.media_assets(created_at desc);

create or replace function public.set_updated_at() returns trigger
language plpgsql security invoker set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products for each row execute function public.set_updated_at();

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where id = auth.uid() and role in ('admin', 'editor'));
$$;

alter table public.admin_users enable row level security;
alter table public.products enable row level security;
alter table public.enquiries enable row level security;
alter table public.media_assets enable row level security;

drop policy if exists "Admins can read their own admin record" on public.admin_users;
create policy "Admins can read their own admin record" on public.admin_users for select to authenticated using (id = auth.uid());

drop policy if exists "Anyone can read published products" on public.products;
create policy "Anyone can read published products" on public.products for select to anon, authenticated using (status = 'published');
drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Anyone can send an enquiry" on public.enquiries;
create policy "Anyone can send an enquiry" on public.enquiries for insert to anon, authenticated with check (true);
drop policy if exists "Admins manage enquiries" on public.enquiries;
create policy "Admins manage enquiries" on public.enquiries for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Anyone can read media metadata" on public.media_assets;
create policy "Anyone can read media metadata" on public.media_assets for select to anon, authenticated using (true);
drop policy if exists "Admins manage media metadata" on public.media_assets;
create policy "Admins manage media metadata" on public.media_assets for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict (id) do update set public = true;

drop policy if exists "Public can view media" on storage.objects;
create policy "Public can view media" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "Admins can upload media" on storage.objects;
create policy "Admins can upload media" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "Admins can update media" on storage.objects;
create policy "Admins can update media" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_admin()) with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "Admins can delete media" on storage.objects;
create policy "Admins can delete media" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_admin());

-- After creating an Auth user in Supabase, run:
-- insert into public.admin_users (id, email) values ('AUTH_USER_UUID', 'admin@example.com');
