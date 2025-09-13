-- Supabase RLS (Row Level Security) Policies for smash-notebook

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid()::text = "userId");

-- Decks policies
CREATE POLICY "Users can view public decks or their own decks" ON decks
  FOR SELECT USING ("isPublic" = true OR auth.uid()::text = (
    SELECT "userId" FROM profiles WHERE profiles.id = decks."ownerId"
  ));

CREATE POLICY "Users can insert their own decks" ON decks
  FOR INSERT WITH CHECK (auth.uid()::text = (
    SELECT "userId" FROM profiles WHERE profiles.id = decks."ownerId"
  ));

CREATE POLICY "Users can update their own decks" ON decks
  FOR UPDATE USING (auth.uid()::text = (
    SELECT "userId" FROM profiles WHERE profiles.id = decks."ownerId"
  ));

CREATE POLICY "Users can delete their own decks" ON decks
  FOR DELETE USING (auth.uid()::text = (
    SELECT "userId" FROM profiles WHERE profiles.id = decks."ownerId"
  ));

-- Cards policies
CREATE POLICY "Users can view cards from public decks or their own decks" ON cards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM decks 
      WHERE decks.id = cards."deckId" 
      AND (decks."isPublic" = true OR auth.uid()::text = (
        SELECT "userId" FROM profiles WHERE profiles.id = decks."ownerId"
      ))
    )
  );

CREATE POLICY "Users can insert cards to their own decks" ON cards
  FOR INSERT WITH CHECK (
    auth.uid()::text = (
      SELECT "userId" FROM profiles 
      WHERE profiles.id = cards."ownerId"
    ) AND
    EXISTS (
      SELECT 1 FROM decks 
      WHERE decks.id = cards."deckId" 
      AND auth.uid()::text = (
        SELECT "userId" FROM profiles WHERE profiles.id = decks."ownerId"
      )
    )
  );

CREATE POLICY "Users can update cards in their own decks" ON cards
  FOR UPDATE USING (auth.uid()::text = (
    SELECT "userId" FROM profiles WHERE profiles.id = cards."ownerId"
  ));

CREATE POLICY "Users can delete cards from their own decks" ON cards
  FOR DELETE USING (auth.uid()::text = (
    SELECT "userId" FROM profiles WHERE profiles.id = cards."ownerId"
  ));

-- Posts policies
CREATE POLICY "Users can view public posts or their own posts" ON posts
  FOR SELECT USING ("isPublic" = true OR auth.uid()::text = (
    SELECT "userId" FROM profiles WHERE profiles.id = posts."ownerId"
  ));

CREATE POLICY "Users can insert their own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid()::text = (
    SELECT "userId" FROM profiles WHERE profiles.id = posts."ownerId"
  ));

CREATE POLICY "Users can update their own posts" ON posts
  FOR UPDATE USING (auth.uid()::text = (
    SELECT "userId" FROM profiles WHERE profiles.id = posts."ownerId"
  ));

CREATE POLICY "Users can delete their own posts" ON posts
  FOR DELETE USING (auth.uid()::text = (
    SELECT "userId" FROM profiles WHERE profiles.id = posts."ownerId"
  ));

-- Templates policies
CREATE POLICY "Users can view their own templates" ON templates
  FOR SELECT USING (auth.uid()::text = (
    SELECT "userId" FROM profiles WHERE profiles.id = templates."ownerId"
  ));

CREATE POLICY "Users can insert their own templates" ON templates
  FOR INSERT WITH CHECK (auth.uid()::text = (
    SELECT "userId" FROM profiles WHERE profiles.id = templates."ownerId"
  ));

CREATE POLICY "Users can update their own templates" ON templates
  FOR UPDATE USING (auth.uid()::text = (
    SELECT "userId" FROM profiles WHERE profiles.id = templates."ownerId"
  ));

CREATE POLICY "Users can delete their own templates" ON templates
  FOR DELETE USING (auth.uid()::text = (
    SELECT "userId" FROM profiles WHERE profiles.id = templates."ownerId"
  ));

-- Tags policies (read-only for all users)
CREATE POLICY "Anyone can view tags" ON tags
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert tags" ON tags
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');