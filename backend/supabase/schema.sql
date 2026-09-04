-- Afshan Art Gallery — schema + RLS + storage policies
-- Run this once in the Supabase SQL Editor (Project → SQL Editor → New query → paste → Run)

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title text not null,
  price numeric not null,
  description text,
  sold_out boolean not null default false,
  image_url text not null,
  created_at timestamptz not null default now()
);

-- Extra photos for a painting, beyond the primary products.image_url.
-- Shown as a slideshow on the Shop card and the Inquire page.
create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  image_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  post_date date,
  description text,
  image_url text,
  image_url_2 text,
  link_url text,
  link_label text,
  link2_url text,
  link2_label text,
  created_at timestamptz not null default now()
);

create table if not exists story_content (
  id int primary key default 1,
  quote text,
  body text,
  photo_url text,
  theme text default 'classic',
  updated_at timestamptz not null default now(),
  constraint singleton check (id = 1)
);

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete set null,
  product_title text,
  name text not null,
  email text not null,
  phone text,
  message text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table products enable row level security;
alter table product_images enable row level security;
alter table blog_posts enable row level security;
alter table story_content enable row level security;
alter table inquiries enable row level security;

-- Public (anon + authenticated) can read products, blog posts, story content.
create policy "public read products" on products
  for select using (true);
create policy "public read product_images" on product_images
  for select using (true);
create policy "public read blog_posts" on blog_posts
  for select using (true);
create policy "public read story_content" on story_content
  for select using (true);

-- Only logged-in admin can write to those three tables.
create policy "admin write products" on products
  for insert to authenticated with check (true);
create policy "admin update products" on products
  for update to authenticated using (true) with check (true);
create policy "admin delete products" on products
  for delete to authenticated using (true);

create policy "admin write product_images" on product_images
  for insert to authenticated with check (true);
create policy "admin update product_images" on product_images
  for update to authenticated using (true) with check (true);
create policy "admin delete product_images" on product_images
  for delete to authenticated using (true);

create policy "admin write blog_posts" on blog_posts
  for insert to authenticated with check (true);
create policy "admin update blog_posts" on blog_posts
  for update to authenticated using (true) with check (true);
create policy "admin delete blog_posts" on blog_posts
  for delete to authenticated using (true);

create policy "admin write story_content" on story_content
  for insert to authenticated with check (true);
create policy "admin update story_content" on story_content
  for update to authenticated using (true) with check (true);

-- inquiries: no public access at all. The Edge Function writes rows using
-- the service-role key (which bypasses RLS entirely), so no insert policy
-- is needed here. Only the logged-in admin can read/delete leads.
create policy "admin read inquiries" on inquiries
  for select to authenticated using (true);
create policy "admin delete inquiries" on inquiries
  for delete to authenticated using (true);

-- ============================================================
-- STORAGE (product / blog images)
-- ============================================================

insert into storage.buckets (id, name, public)
values ('gallery-images', 'gallery-images', true)
on conflict (id) do nothing;

create policy "public read gallery-images" on storage.objects
  for select using (bucket_id = 'gallery-images');

create policy "admin upload gallery-images" on storage.objects
  for insert to authenticated with check (bucket_id = 'gallery-images');

create policy "admin update gallery-images" on storage.objects
  for update to authenticated using (bucket_id = 'gallery-images')
  with check (bucket_id = 'gallery-images');

create policy "admin delete gallery-images" on storage.objects
  for delete to authenticated using (bucket_id = 'gallery-images');
