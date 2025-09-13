-- Enable RLS on all main tables
alter table if exists public."Profile" enable row level security;
alter table if exists public."Deck" enable row level security;
alter table if exists public."Card" enable row level security;
alter table if exists public."Post" enable row level security;
alter table if exists public."Template" enable row level security;
alter table if exists public."Tag" enable row level security;
alter table if exists public."CardTag" enable row level security;

-- Profiles: user can read/update own profile
create policy "profiles_select_own" on public."Profile"
  for select using ( id = auth.uid() );
create policy "profiles_update_own" on public."Profile"
  for update using ( id = auth.uid() );
create policy "profiles_insert_own" on public."Profile"
  for insert with check ( id = auth.uid() );

-- Decks: owner full access, public readable
create policy "decks_owner_rw" on public."Deck"
  for all using ( ownerId = auth.uid() ) with check ( ownerId = auth.uid() );
create policy "decks_public_r" on public."Deck"
  for select using ( isPublic = true );

-- Cards: owner full access, public readable
create policy "cards_owner_rw" on public."Card"
  for all using ( ownerId = auth.uid() ) with check ( ownerId = auth.uid() );
create policy "cards_public_r" on public."Card"
  for select using ( isPublic = true );

-- Posts: owner full access, public readable
create policy "posts_owner_rw" on public."Post"
  for all using ( ownerId = auth.uid() ) with check ( ownerId = auth.uid() );
create policy "posts_public_r" on public."Post"
  for select using ( isPublic = true );

-- Templates: owner full access (templates generally private)
create policy "templates_owner_rw" on public."Template"
  for all using ( ownerId = auth.uid() ) with check ( ownerId = auth.uid() );

-- Tags: readable by all, inserts allowed for authenticated users
create policy "tags_read_all" on public."Tag" for select using ( true );
create policy "tags_insert_auth" on public."Tag" for insert with check ( auth.role() = 'authenticated' );

-- CardTag: link rows allowed if actor owns the card
create policy "cardtag_rw_if_owns_card" on public."CardTag"
  for all using ( exists(select 1 from public."Card" c where c.id = cardId and c.ownerId = auth.uid()) )
  with check ( exists(select 1 from public."Card" c where c.id = cardId and c.ownerId = auth.uid()) );

