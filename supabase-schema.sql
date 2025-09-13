-- Supabase database schema for Smash Notebook

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Decks table
CREATE TABLE decks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  user_id TEXT NOT NULL, -- In a real app, this would be a foreign key to auth.users
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cards table
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  my_char TEXT NOT NULL,
  opp_char TEXT NOT NULL,
  percent_band TEXT NOT NULL CHECK (percent_band IN ('0-30', '40-70', '80+', 'Kill%')),
  situation TEXT NOT NULL CHECK (situation IN ('neutral', 'ledgetrap', 'edgeguard', 'recovery', 'combo', 'line')),
  opp_move TEXT,
  answer_md TEXT NOT NULL,
  deck_id UUID REFERENCES decks(id) ON DELETE SET NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table for posts and cards (many-to-many)
CREATE TABLE post_cards (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, card_id)
);

-- Indexes for better performance
CREATE INDEX idx_cards_my_char ON cards(my_char);
CREATE INDEX idx_cards_opp_char ON cards(opp_char);
CREATE INDEX idx_cards_situation ON cards(situation);
CREATE INDEX idx_cards_percent_band ON cards(percent_band);
CREATE INDEX idx_cards_user_id ON cards(user_id);
CREATE INDEX idx_cards_deck_id ON cards(deck_id);
CREATE INDEX idx_decks_user_id ON decks(user_id);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_cards_created_at ON cards(created_at DESC);

-- Row Level Security (RLS) policies
-- Note: In a real app, you would enable RLS and create policies based on user authentication
-- For now, these are commented out since we're using a mock user system

-- ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE post_cards ENABLE ROW LEVEL SECURITY;

-- Example policies (uncomment when implementing real auth):
-- CREATE POLICY "Users can view their own decks" ON decks FOR SELECT USING (auth.uid()::text = user_id);
-- CREATE POLICY "Users can insert their own decks" ON decks FOR INSERT WITH CHECK (auth.uid()::text = user_id);
-- CREATE POLICY "Users can update their own decks" ON decks FOR UPDATE USING (auth.uid()::text = user_id);
-- CREATE POLICY "Users can delete their own decks" ON decks FOR DELETE USING (auth.uid()::text = user_id);

-- Sample data for testing
INSERT INTO decks (name, description, user_id) VALUES 
  ('Fox Neutral Game', 'Tactics for Fox neutral game situations', 'user-1'),
  ('Marth Edgeguards', 'Edgeguarding techniques with Marth', 'user-1');

INSERT INTO cards (my_char, opp_char, percent_band, situation, opp_move, answer_md, deck_id, user_id) VALUES 
  ('Fox', 'Falco', '0-30', 'neutral', 'Laser', 
   '# Dealing with Falco Laser\n\nUse **dash dance** to bait approaches after laser hitstun.\n\n## Options:\n- Short hop nair\n- Running shine\n- Dash back -> dash attack\n\n[YouTube:dQw4w9WgXcQ]', 
   (SELECT id FROM decks WHERE name = 'Fox Neutral Game' LIMIT 1), 'user-1'),
  ('Marth', 'Fox', 'Kill%', 'edgeguard', 'Firefox', 
   '# Edgeguarding Fox Firefox\n\n**Counter** is very effective against predictable Firefox angles.\n\n## Setup:\n1. Get Fox offstage\n2. Position at ledge\n3. *React* to Firefox startup\n4. Counter or dair spike', 
   (SELECT id FROM decks WHERE name = 'Marth Edgeguards' LIMIT 1), 'user-1');

INSERT INTO posts (content, user_id) VALUES 
  ('Just learned a new Fox combo! Anyone have tips for consistent waveshine execution?', 'user-1'),
  ('Struggling with the Marth vs Sheik matchup. How do you deal with her needles in neutral?', 'user-1');

-- Link cards to posts
INSERT INTO post_cards (post_id, card_id) VALUES 
  ((SELECT id FROM posts WHERE content LIKE '%Fox combo%' LIMIT 1), 
   (SELECT id FROM cards WHERE my_char = 'Fox' LIMIT 1)),
  ((SELECT id FROM posts WHERE content LIKE '%Marth vs Sheik%' LIMIT 1), 
   (SELECT id FROM cards WHERE my_char = 'Marth' LIMIT 1));