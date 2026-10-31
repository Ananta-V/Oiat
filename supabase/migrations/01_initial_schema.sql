-- ============================================================
-- Migration 01: Initial Schema & Seed Data
-- ============================================================

-- 1. PRODUCTS TABLE
create table if not exists public.products (
  id text primary key,
  name text not null,
  slug text not null,
  price integer not null default 349,
  category text not null,
  kind text default 'DARK CHOCOLATE',
  tagline text,
  personality text,
  description text,
  ingredients text,
  notes text,
  badge text default 'SMALL BATCH',
  image text not null,
  weight text default 'Box of 6 pieces (120g)',
  rating numeric(2,1) default 4.9,
  review_count integer default 24,
  is_active boolean default true,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_active on public.products(is_active);

-- 2. FEEDBACK TABLE
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  context text default 'Your OiAI story',
  rating integer not null check (rating >= 1 and rating <= 5),
  feelings text[] default '{}',
  message text not null,
  product_id text,
  product_name text,
  page_url text,
  source text default 'oiai-catalogue',
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_feedback_created_at on public.feedback(created_at desc);
create index if not exists idx_feedback_rating on public.feedback(rating);

-- 3. ORDERS TABLE (UPI & WhatsApp)
create table if not exists public.orders (
  id text primary key,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  delivery_address text not null,
  city text default 'Hyderabad',
  pincode text,
  order_notes text,
  items jsonb not null default '[]',
  total_amount integer not null,
  payment_method text default 'UPI',
  transaction_id text,
  screenshot_url text,
  status text not null default 'pending_verification',
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_orders_status on public.orders(status);

-- 4. SUBSCRIBERS TABLE
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text default 'oiai-newsletter',
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_subscribers_created_at on public.subscribers(created_at desc);

-- 5. ROW LEVEL SECURITY (RLS)
alter table public.products enable row level security;
alter table public.feedback enable row level security;
alter table public.orders enable row level security;
alter table public.subscribers enable row level security;

-- Drop existing policies if re-running
drop policy if exists "Allow public read on products" on public.products;
drop policy if exists "Allow service role all on products" on public.products;
drop policy if exists "Allow public insert on feedback" on public.feedback;
drop policy if exists "Allow service role all on feedback" on public.feedback;
drop policy if exists "Allow public insert on orders" on public.orders;
drop policy if exists "Allow service role all on orders" on public.orders;
drop policy if exists "Allow public insert on subscribers" on public.subscribers;
drop policy if exists "Allow service role all on subscribers" on public.subscribers;

-- Public read for active products
create policy "Allow public read on products"
  on public.products for select
  to anon, authenticated
  using (is_active = true);

create policy "Allow service role all on products"
  on public.products for all
  to service_role
  using (true)
  with check (true);

create policy "Allow public insert on feedback"
  on public.feedback for insert
  to anon, authenticated
  with check (true);

create policy "Allow service role all on feedback"
  on public.feedback for all
  to service_role
  using (true)
  with check (true);

create policy "Allow public insert on orders"
  on public.orders for insert
  to anon, authenticated
  with check (true);

create policy "Allow service role all on orders"
  on public.orders for all
  to service_role
  using (true)
  with check (true);

create policy "Allow public insert on subscribers"
  on public.subscribers for insert
  to anon, authenticated
  with check (true);

create policy "Allow service role all on subscribers"
  on public.subscribers for all
  to service_role
  using (true)
  with check (true);

-- 6. SEED DATA FOR PRODUCTS
insert into public.products (id, name, slug, price, category, kind, tagline, personality, description, ingredients, notes, badge, image, weight, rating, review_count)
values
(
  '1',
  'Secret Crush',
  'secret-crush',
  349,
  'Filled Centres',
  'DARK CHOCOLATE',
  'A little nut. A lot of feelings.',
  'Shy, romantic, full of surprises',
  'A dark chocolate shell with a roasted almond waiting in the middle.',
  'Dark chocolate shell with a roasted almond in the centre',
  'Dark chocolate · almond centre',
  'A NUTTY LITTLE SECRET',
  '/images/oiai/photo-milkPralines-02cd3864aed0.jpg',
  'Box of 6 pieces (120g)',
  4.9,
  28
),
(
  '2',
  'Bad Habit',
  'bad-habit',
  349,
  'Filled Centres',
  'DARK CHOCOLATE',
  'You said just one. We both know.',
  'Bold, addictive, impossible to resist',
  'Deep chocolate wrapped around a cocoa cashew centre.',
  'Dark chocolate with a cocoa-coated cashew in the centre',
  'Dark chocolate · cocoa cashew centre',
  'COCOA MEETS CRUNCH',
  '/images/oiai/photo-cocoaShards-44c7ec5f0d56.jpg',
  'Box of 6 pieces (120g)',
  4.8,
  19
),
(
  '3',
  'Sweet Surrender',
  'sweet-surrender',
  379,
  'Filled Centres',
  'DARK CHOCOLATE',
  'Resistance was never an option.',
  'Soft-hearted, indulgent, dangerously smooth',
  'A dark chocolate outside with a Nutella-soft middle.',
  'Dark chocolate shell with a Nutella centre',
  'Dark chocolate · Nutella centre',
  'THE SOFT MIDDLE',
  '/images/oiai/photo-ganacheTruffles-7aba3afc44ec.jpg',
  'Box of 6 pieces (125g)',
  4.9,
  34
),
(
  '4',
  'Sugar Rush',
  'sugar-rush',
  399,
  'Crunch & Crisps',
  'CRUNCH & CRISPS',
  'Soft on the inside. Chaos on the outside.',
  'Chaotic, bubbly, the life of the party',
  'Marshmallows and silk-chip crisps tucked under a chocolate coat.',
  'Marshmallows and Silk chocolate-chip crisps covered in chocolate',
  'Marshmallows · silk-chip crisps · chocolate',
  'THE HAPPY CRUNCH',
  '/images/oiai/photo-truffles-d69deff05b90.jpg',
  'Box of 8 pieces (140g)',
  4.8,
  22
),
(
  '5',
  'Mixed Signals',
  'mixed-signals',
  369,
  'Milk & Marble',
  'MILK & MARBLE',
  'Can''t choose? Neither could we.',
  'Unpredictable, playful, two-sided',
  'White and dark chocolate meet in a marbled little swirl.',
  'Marbled white and dark chocolate',
  'White chocolate · dark chocolate',
  'TWO TONES, ONE BITE',
  '/images/oiai/photo-pralines-09e90126f78c.jpg',
  'Box of 6 pieces (120g)',
  4.7,
  16
),
(
  '6',
  'First Love',
  'first-love',
  329,
  'Milk & Marble',
  'MILK CHOCOLATE',
  'Some things never lose their magic.',
  'Nostalgic, innocent, comforting',
  'Creamy, familiar milk chocolate. Nothing to prove.',
  'Plain milk chocolate',
  'Plain milk chocolate',
  'THE OLD FAVOURITE',
  '/images/oiai/photo-milkPralines-02cd3864aed0.jpg',
  'Box of 6 pieces (120g)',
  4.9,
  31
),
(
  '7',
  'Dark Affair',
  'dark-affair',
  349,
  'Plain Dark',
  'DARK CHOCOLATE',
  'A little bitter. Entirely irresistible.',
  'Mysterious, confident, a little dangerous',
  'A classic cocoa-rich bite for the purists.',
  'Plain dark chocolate (70% cocoa)',
  'Plain dark chocolate',
  'DARK AND SIMPLE',
  '/images/oiai/photo-dark-b5358c29b80a.jpg',
  'Box of 6 pieces (120g)',
  4.9,
  29
),
(
  '8',
  'Pocket Mischief',
  'pocket-mischief',
  299,
  'Nutty Packs',
  'NUTTY PACKS',
  'Tiny treats. Big trouble.',
  'Cute, adventurous, always up to something',
  'Roasted almonds coated in chocolate, packed for a small treat.',
  'Roasted almonds coated in chocolate, sold in small packs',
  'Roasted almonds · chocolate coating · small pack',
  'POCKET-SIZED JOY',
  '/images/oiai/photo-giftDetail-413c588aa5b2.jpg',
  'Pouch of 100g',
  4.8,
  18
),
(
  '9',
  'Caught Snacking',
  'caught-snacking',
  299,
  'Nutty Packs',
  'NUTTY PACKS',
  'We won''t tell if you don''t.',
  'Funny, cheeky, guilty but unapologetic',
  'Cashews covered in chocolate for a pocket-sized indulgence.',
  'Cashews coated in chocolate, sold in small packs',
  'Cashews · chocolate coating · small pack',
  'A LITTLE HANDFUL',
  '/images/oiai/photo-gift-b6c8ee965229.jpg',
  'Pouch of 100g',
  4.7,
  15
)
on conflict (id) do update set
  price = excluded.price,
  name = excluded.name,
  description = excluded.description,
  updated_at = now();
