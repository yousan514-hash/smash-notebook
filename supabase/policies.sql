-- Supabase Row Level Security (RLS) Policies
-- スマブラ戦術ノートアプリ用

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read/write their own profile
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Decks: Owner can read/write, others can read if isPublic=true
CREATE POLICY "Owner can manage their decks" ON decks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = decks.owner_id 
      AND profiles.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Anyone can view public decks" ON decks
  FOR SELECT USING (is_public = true);

-- Cards: Owner can read/write, others can read if deck is public
CREATE POLICY "Owner can manage their cards" ON cards
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = cards.owner_id 
      AND profiles.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Anyone can view cards from public decks" ON cards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM decks 
      WHERE decks.id = cards.deck_id 
      AND decks.is_public = true
    )
  );

-- Posts: Owner can read/write, others can read if isPublic=true
CREATE POLICY "Owner can manage their posts" ON posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = posts.owner_id 
      AND profiles.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Anyone can view public posts" ON posts
  FOR SELECT USING (is_public = true);

-- Templates: Owner can read/write
CREATE POLICY "Owner can manage their templates" ON templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = templates.owner_id 
      AND profiles.user_id = auth.uid()::text
    )
  );

-- Tags: Owner can read/write
CREATE POLICY "Owner can manage their tags" ON tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = tags.owner_id 
      AND profiles.user_id = auth.uid()::text
    )
  );

-- Additional indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_decks_owner_public ON decks(owner_id, is_public);
CREATE INDEX IF NOT EXISTS idx_posts_owner_public ON posts(owner_id, is_public);
CREATE INDEX IF NOT EXISTS idx_posts_created_at_desc ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cards_deck_filters ON cards(deck_id, percent_band, situation);
CREATE INDEX IF NOT EXISTS idx_cards_opponent ON cards(opp_char, opp_move);
CREATE INDEX IF NOT EXISTS idx_templates_owner_char ON templates(owner_id, target_char);