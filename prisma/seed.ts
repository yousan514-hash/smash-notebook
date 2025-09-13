import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const characters = [
  { id: 0, name: "テンプレ" },
  { id: 1, name: "マリオ" },
  { id: 2, name: "ドンキーコング" },
  { id: 3, name: "リンク" },
  { id: 4, name: "サムス" },
  { id: 5, name: "ダークサムス" },
  { id: 6, name: "ヨッシー" },
  { id: 7, name: "カービィ" },
  { id: 8, name: "フォックス" },
  { id: 9, name: "ピカチュウ" },
  { id: 10, name: "ルイージ" },
  { id: 11, name: "ネス" },
  { id: 12, name: "キャプテン・ファルコン" },
  { id: 13, name: "プリン" },
  { id: 14, name: "ピーチ" },
  { id: 15, name: "デイジー" },
  { id: 16, name: "クッパ" },
  { id: 17, name: "アイスクライマー" },
  { id: 18, name: "シーク" },
  { id: 19, name: "ゼルダ" },
  { id: 20, name: "ドクターマリオ" },
  { id: 21, name: "ピチュー" },
  { id: 22, name: "ファルコ" },
  { id: 23, name: "マルス" },
  { id: 24, name: "ルキナ" },
  { id: 25, name: "こどもリンク" },
  { id: 26, name: "ガノンドロフ" },
  { id: 27, name: "ミュウツー" },
  { id: 28, name: "ロイ" },
  { id: 29, name: "クロム" },
  { id: 30, name: "Mr.ゲーム&ウォッチ" },
  { id: 31, name: "メタナイト" },
  { id: 32, name: "ピット" },
  { id: 33, name: "ブラックピット" },
  { id: 34, name: "ゼロスーツサムス" },
  { id: 35, name: "ワリオ" },
  { id: 36, name: "スネーク" },
  { id: 37, name: "アイク" },
  { id: 38, name: "ポケモントレーナー" },
  { id: 39, name: "ディディーコング" },
  { id: 40, name: "リュカ" },
  { id: 41, name: "ソニック" },
  { id: 42, name: "デデデ" },
  { id: 43, name: "ピクミン&オリマー" },
  { id: 44, name: "ルカリオ" },
  { id: 45, name: "ロボット" },
  { id: 46, name: "トゥーンリンク" },
  { id: 47, name: "ウルフ" },
  { id: 48, name: "むらびと" },
  { id: 49, name: "ロックマン" },
  { id: 50, name: "Wii Fit トレーナー" },
  { id: 51, name: "ロゼッタ&チコ" },
  { id: 52, name: "リトル・マック" },
  { id: 53, name: "ゲッコウガ" },
  { id: 54, name: "パルテナ" },
  { id: 55, name: "パックマン" },
  { id: 56, name: "ルフレ" },
  { id: 57, name: "シュルク" },
  { id: 58, name: "クッパJr." },
  { id: 59, name: "ダックハント" },
  { id: 60, name: "リュウ" },
  { id: 61, name: "ケン" },
  { id: 62, name: "クラウド" },
  { id: 63, name: "カムイ" },
  { id: 64, name: "ベヨネッタ" },
  { id: 65, name: "インクリング" },
  { id: 66, name: "リドリー" },
  { id: 67, name: "シモン" },
  { id: 68, name: "リヒター" },
  { id: 69, name: "キングクルール" },
  { id: 70, name: "しずえ" },
  { id: 71, name: "ガオガエン" },
  { id: 72, name: "パックンフラワー" },
  { id: 73, name: "ジョーカー" },
  { id: 74, name: "勇者" },
  { id: 75, name: "バンジョー&カズーイ" },
  { id: 76, name: "テリー" },
  { id: 77, name: "ベレト" },
  { id: 78, name: "ミェンミェン" },
  { id: 79, name: "スティーブ" },
  { id: 80, name: "セフィロス" },
  { id: 81, name: "ホムラ/ヒカリ" },
  { id: 82, name: "ソラ" },
];

const baseTags = [
  "立ち回り",
  "崖展開", 
  "崖狩り",
  "復帰阻止",
  "ライン回復",
  "崖上がり",
  "復帰"
];

async function main() {
  console.log("Starting seed...");
  
  // タグを作成
  for (const tagName of baseTags) {
    await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName },
    });
  }
  console.log("Tags created");

  // 最低限のプロフィールを作成
  const me = await prisma.profile.upsert({
    where: { id: "seed-user" },
    update: {},
    create: {
      id: "seed-user",
      displayName: "You",
      handle: "you",
    },
  });
  console.log("Profile created");

  // デッキを1つ作成
  const deck = await prisma.deck.create({
    data: {
      ownerId: me.id,
      title: "Cloud vs Joker 対策",
      isPublic: false,
    },
  });
  console.log("Deck created");

  // カードを1つ作成（テンプレの例）
  await prisma.card.create({
    data: {
      deckId: deck.id,
      ownerId: me.id,
      myChar: "クラウド",
      oppChar: "ジョーカー",
      percentBand: "PERCENT_40_70",
      situation: "neutral",
      oppMove: "空N",
      answerMD: "**方針**: ガード後は最速上B or 後退ガード→下強",
    },
  });
  console.log("Card created");

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });