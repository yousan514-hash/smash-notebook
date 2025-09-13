-- Supabase RLS (Row Level Security) ポリシー例
-- 注意: これらのポリシーはSupabaseのダッシュボードまたはmigrationファイルで適用してください

-- 1. Profileテーブルのポリシー
-- 自分のプロフィールのみ読み書き可能
CREATE POLICY "Users can view own profile" ON "Profile"
  FOR SELECT USING (auth.uid() = "userId");

CREATE POLICY "Users can update own profile" ON "Profile"
  FOR UPDATE USING (auth.uid() = "userId");

CREATE POLICY "Users can insert own profile" ON "Profile"
  FOR INSERT WITH CHECK (auth.uid() = "userId");

-- 2. Deckテーブルのポリシー
-- 所有者は全権限、isPublic=trueは誰でも閲覧可能
CREATE POLICY "Deck owners have full access" ON "Deck"
  FOR ALL USING (
    auth.uid() = (SELECT "userId" FROM "Profile" WHERE "id" = "Deck"."ownerId")
  );

CREATE POLICY "Public decks are viewable by all" ON "Deck"
  FOR SELECT USING ("isPublic" = true);

-- 3. Cardテーブルのポリシー
-- 所有者は全権限、デッキがpublicなら閲覧可能
CREATE POLICY "Card owners have full access" ON "Card"
  FOR ALL USING (
    auth.uid() = (SELECT "userId" FROM "Profile" WHERE "id" = "Card"."ownerId")
  );

CREATE POLICY "Cards in public decks are viewable" ON "Card"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "Deck" 
      WHERE "Deck"."id" = "Card"."deckId" 
      AND "Deck"."isPublic" = true
    )
  );

-- 4. Postテーブルのポリシー
-- 所有者は全権限、isPublic=trueは誰でも閲覧可能
CREATE POLICY "Post owners have full access" ON "Post"
  FOR ALL USING (
    auth.uid() = (SELECT "userId" FROM "Profile" WHERE "id" = "Post"."ownerId")
  );

CREATE POLICY "Public posts are viewable by all" ON "Post"
  FOR SELECT USING ("isPublic" = true);

-- 5. Tagテーブルのポリシー
-- 誰でも閲覧可能、所有者のみ編集可能
CREATE POLICY "Tags are viewable by all" ON "Tag"
  FOR SELECT USING (true);

CREATE POLICY "Tag owners can update" ON "Tag"
  FOR UPDATE USING (
    "ownerId" IS NULL OR 
    auth.uid() = (SELECT "userId" FROM "Profile" WHERE "id" = "Tag"."ownerId")
  );

CREATE POLICY "Users can create tags" ON "Tag"
  FOR INSERT WITH CHECK (
    "ownerId" IS NULL OR 
    auth.uid() = (SELECT "userId" FROM "Profile" WHERE "id" = "Tag"."ownerId")
  );

-- 6. Templateテーブルのポリシー
-- 所有者のみ全権限
CREATE POLICY "Template owners have full access" ON "Template"
  FOR ALL USING (
    auth.uid() = (SELECT "userId" FROM "Profile" WHERE "id" = "Template"."ownerId")
  );

-- 各テーブルでRLSを有効化
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Deck" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Card" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Post" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Tag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Template" ENABLE ROW LEVEL SECURITY;