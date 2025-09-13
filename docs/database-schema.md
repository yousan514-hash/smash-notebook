# Database Schema

## Tables

### users
- id: uuid (primary key)
- email: text (unique)
- name: text
- avatar_url: text
- created_at: timestamp

### tactical_notes
- id: uuid (primary key)
- title: text
- content: text
- character: text
- situation: text
- tags: text[]
- user_id: uuid (foreign key to users.id)
- created_at: timestamp
- updated_at: timestamp
- is_public: boolean

### likes
- id: uuid (primary key)
- user_id: uuid (foreign key to users.id)
- note_id: uuid (foreign key to tactical_notes.id)
- created_at: timestamp

### user_profiles (view)
- id: uuid
- email: text
- name: text
- avatar_url: text

## SQL Setup Commands

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tactical_notes table
CREATE TABLE tactical_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  character TEXT NOT NULL,
  situation TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_public BOOLEAN DEFAULT true
);

-- Create likes table
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  note_id UUID REFERENCES tactical_notes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, note_id)
);

-- Create view for user profiles with note counts
CREATE VIEW user_profiles AS
SELECT 
  u.*,
  COUNT(tn.id) as notes_count
FROM users u
LEFT JOIN tactical_notes tn ON u.id = tn.user_id AND tn.is_public = true
GROUP BY u.id, u.email, u.name, u.avatar_url, u.created_at;

-- Create view for notes with like counts
CREATE VIEW notes_with_stats AS
SELECT 
  tn.*,
  u.name as user_name,
  u.avatar_url as user_avatar,
  COUNT(l.id) as likes_count
FROM tactical_notes tn
LEFT JOIN users u ON tn.user_id = u.id
LEFT JOIN likes l ON tn.id = l.note_id
GROUP BY tn.id, u.name, u.avatar_url;
```