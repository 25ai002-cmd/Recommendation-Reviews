-- ==============================================================================
-- REVIEWFLOW SAAS: COMPLETE DATABASE SCHEMA (PostgreSQL / Supabase)
-- Multi-tenant schema with Row Level Security (RLS) & Seed Templates
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. BUSINESSES TABLE (Tenants)
create table if not exists public.businesses (
    id uuid primary key default uuid_generate_v4(),
    owner_id uuid references auth.users(id) on delete cascade not null,
    name text not null,
    slug text unique not null,
    category text not null default 'general',
    google_review_url text not null,
    google_place_id text,
    logo_url text,
    brand_color text default '#4f46e5',
    custom_prompt text default 'How was your experience with us today?',
    min_rating_for_google int default 4, -- Ratings >= this go to Google; lower goes to private feedback
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for instant NFC / QR slug lookup
create index if not exists idx_businesses_slug on public.businesses(slug);
create index if not exists idx_businesses_owner on public.businesses(owner_id);

-- 2. REVIEW TAGS (Pills/Highlights selected by customers during NFC flow)
create table if not exists public.review_tags (
    id uuid primary key default uuid_generate_v4(),
    business_id uuid references public.businesses(id) on delete cascade,
    label text not null,
    category text default 'general',
    sort_order int default 0,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_review_tags_business on public.review_tags(business_id);

-- 3. REVIEW TEMPLATES (For Randomized Suggestion Engine)
create table if not exists public.review_templates (
    id uuid primary key default uuid_generate_v4(),
    business_id uuid references public.businesses(id) on delete cascade, -- null = global system template
    category text not null default 'general',
    vibe text not null default 'enthusiastic', -- 'enthusiastic', 'professional', 'concise', 'detailed'
    template_text text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_review_templates_cat on public.review_templates(category);

-- 4. SCAN EVENTS & ANALYTICS
create table if not exists public.scan_events (
    id uuid primary key default uuid_generate_v4(),
    business_id uuid references public.businesses(id) on delete cascade not null,
    rating_selected int,
    action_type text default 'scan', -- 'scan', 'copy_review', 'redirect_google', 'submit_private'
    device_type text,
    selected_tags text[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_scan_events_business_date on public.scan_events(business_id, created_at);

-- 5. PRIVATE FEEDBACK TABLE (Intercepted 1-3 star reviews)
create table if not exists public.private_feedback (
    id uuid primary key default uuid_generate_v4(),
    business_id uuid references public.businesses(id) on delete cascade not null,
    rating int not null check (rating between 1 and 5),
    customer_name text,
    customer_email text,
    customer_phone text,
    message text not null,
    status text default 'new', -- 'new', 'contacted', 'resolved'
    staff_notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_private_feedback_business on public.private_feedback(business_id, created_at desc);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
alter table public.businesses enable row level security;
alter table public.review_tags enable row level security;
alter table public.review_templates enable row level security;
alter table public.scan_events enable row level security;
alter table public.private_feedback enable row level security;

-- Businesses policies
create policy "Public can view active businesses by slug"
    on public.businesses for select
    using (is_active = true);

create policy "Owners can manage their own business"
    on public.businesses for all
    using (auth.uid() = owner_id);

-- Review Tags policies
create policy "Public can view tags for active businesses or system tags"
    on public.review_tags for select
    using (true);

create policy "Owners can manage their business tags"
    on public.review_tags for all
    using (
        business_id in (select id from public.businesses where owner_id = auth.uid())
    );

-- Review Templates policies
create policy "Anyone can read templates"
    on public.review_templates for select
    using (true);

create policy "Owners can manage their custom templates"
    on public.review_templates for all
    using (
        business_id in (select id from public.businesses where owner_id = auth.uid())
    );

-- Scan Events policies
create policy "Anyone can log a scan event (anon NFC tap)"
    on public.scan_events for insert
    with check (true);

create policy "Owners can view scan events for their business"
    on public.scan_events for select
    using (
        business_id in (select id from public.businesses where owner_id = auth.uid())
    );

-- Private Feedback policies
create policy "Customers can submit private feedback (anon)"
    on public.private_feedback for insert
    with check (true);

create policy "Owners can view and update private feedback"
    on public.private_feedback for all
    using (
        business_id in (select id from public.businesses where owner_id = auth.uid())
    );

-- ==============================================================================
-- SEED DATA: RANDOMIZED TEMPLATE ENGINE & TAGS
-- ==============================================================================

-- Global System Tags
insert into public.review_tags (business_id, label, category, sort_order) values
-- Restaurant / Food
(null, 'Delicious Food', 'restaurant', 1),
(null, 'Friendly Service', 'restaurant', 2),
(null, 'Cozy Ambiance', 'restaurant', 3),
(null, 'Fast Service', 'restaurant', 4),
(null, 'Great Cocktails / Drinks', 'restaurant', 5),
(null, 'Great Value', 'restaurant', 6),

-- Salon / Spa
(null, 'Incredible Styling', 'salon', 1),
(null, 'Relaxing Atmosphere', 'salon', 2),
(null, 'Clean & Professional', 'salon', 3),
(null, 'Punctual & Attentive', 'salon', 4),
(null, 'Skilled Specialists', 'salon', 5),

-- Dental / Healthcare
(null, 'Gentle Care', 'dental', 1),
(null, 'No Wait Time', 'dental', 2),
(null, 'Super Friendly Staff', 'dental', 3),
(null, 'Modern Equipment', 'dental', 4),
(null, 'Clear Explanations', 'dental', 5),

-- Automotive / Repair
(null, 'Honest Pricing', 'automotive', 1),
(null, 'Quick Turnaround', 'automotive', 2),
(null, 'Knowledgeable Mechanics', 'automotive', 3),
(null, 'Transparent Inspection', 'automotive', 4),

-- Retail / General
(null, 'Super Helpful Staff', 'retail', 1),
(null, 'Great Selection', 'retail', 2),
(null, 'Seamless Checkout', 'retail', 3),
(null, 'Fair Prices', 'retail', 4);

-- System Review Templates for Randomized Generation
insert into public.review_templates (business_id, category, vibe, template_text) values
-- Restaurant
(null, 'restaurant', 'enthusiastic', 'Had an amazing experience at {business_name}! The {highlights} truly made my day. Everything was on point and the hospitality was exceptional. Will definitely be returning soon!'),
(null, 'restaurant', 'concise', 'Fantastic food and {highlights}. One of my favorite spots in town! 10/10 recommend.'),
(null, 'restaurant', 'detailed', 'Visited {business_name} today and was thoroughly impressed. What really stood out was the {highlights}. The team pays attention to every little detail. Definitely coming back with friends!'),

-- Salon & Spa
(null, 'salon', 'enthusiastic', 'I could not be happier with my visit to {business_name}! The team is so talented, and the {highlights} made the whole appointment relaxing and effortless. 5 stars all the way!'),
(null, 'salon', 'concise', 'Top-notch service and {highlights}. Left feeling amazing. Highly recommend {business_name}!'),
(null, 'salon', 'detailed', 'Such a wonderful experience at {business_name}. From the moment you walk in, you notice the {highlights}. They really listen to what you want and deliver perfection.'),

-- Dental / Medical
(null, 'dental', 'enthusiastic', 'Hands down the best dental experience I have ever had! {business_name} made everything so comfortable. The {highlights} put all my anxiety to rest. Highly recommended!'),
(null, 'dental', 'concise', 'Very professional team and {highlights}. Always a smooth, stress-free visit at {business_name}.'),
(null, 'dental', 'detailed', 'Cannot say enough good things about {business_name}. The staff is courteous, punctual, and the {highlights} really set them apart from other practices in the area.'),

-- Automotive
(null, 'automotive', 'enthusiastic', 'Trustworthy and fast! Brought my vehicle to {business_name} and was blown away by the {highlights}. Honest people doing quality work. I won’t take my car anywhere else!'),
(null, 'automotive', 'concise', 'Quick, reliable, and fair. The {highlights} was greatly appreciated. Great shop!'),

-- General
(null, 'general', 'enthusiastic', 'Outstanding service from {business_name}! They exceeded all my expectations, especially with the {highlights}. Highly recommend them to anyone looking for top quality!'),
(null, 'general', 'concise', 'Great experience with {business_name}! Appreciated the {highlights}. Will definitely be back.'),
(null, 'general', 'detailed', 'Really pleased with my experience at {business_name}. The attention to detail and {highlights} made a huge impression. Professional, courteous, and dependable.');
