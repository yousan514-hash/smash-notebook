import { PrismaClient } from '@prisma/client'
import { CHARACTERS } from '../src/lib/characters'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  await prisma.message.deleteMany()
  await prisma.communityMember.deleteMany()
  await prisma.community.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.like.deleteMany()
  await prisma.post.deleteMany()
  await prisma.card.deleteMany()
  await prisma.deckLike.deleteMany()
  await prisma.deck.deleteMany()
  await prisma.character.deleteMany()
  await prisma.follow.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  // Seed Characters
  console.log('📝 Seeding characters...')
  for (const char of CHARACTERS) {
    await prisma.character.create({
      data: {
        id: char.id,
        name: char.name,
        nameJa: char.nameJa,
        series: char.series,
      },
    })
  }

  // Seed Users
  console.log('👤 Seeding users...')
  const user1 = await prisma.user.create({
    data: {
      id: 'user1',
      name: 'マリオマスター',
      email: 'mario@example.com',
      image: '/default-avatar.png',
      bio: 'マリオ一筋10年！コンボと対策が得意です。',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      id: 'user2',
      name: 'ピカチュウ使い',
      email: 'pikachu@example.com',
      image: '/default-avatar.png',
      bio: 'ピカチュウの雷を極めたい！',
    },
  })

  const user3 = await prisma.user.create({
    data: {
      id: 'user3',
      name: 'クラウド研究者',
      email: 'cloud@example.com',
      image: '/default-avatar.png',
      bio: '崖狩りスペシャリスト',
    },
  })

  // Seed Decks
  console.log('🃏 Seeding decks...')
  const deck1 = await prisma.deck.create({
    data: {
      id: 'deck1',
      title: 'マリオ vs フォックス対策',
      description: 'フォックスとの対戦で使える基本的な対策をまとめました',
      myCharacter: '01',
      userId: user1.id,
      tags: ['立ち回り', '復帰阻止'],
      likes: 24,
      uses: 156,
    },
  })

  const deck2 = await prisma.deck.create({
    data: {
      id: 'deck2',
      title: 'ピカチュウ基本セットアップ',
      description: 'ピカチュウの基本的な立ち回りとコンボをまとめたデッキ',
      myCharacter: '09',
      userId: user2.id,
      tags: ['コンボ', '立ち回り'],
      likes: 18,
      uses: 89,
    },
  })

  const deck3 = await prisma.deck.create({
    data: {
      id: 'deck3',
      title: 'クラウド崖狩り特化',
      description: '崖狩りに特化したクラウドの戦術集',
      myCharacter: '65',
      userId: user3.id,
      tags: ['崖狩り', '崖展開'],
      likes: 31,
      uses: 203,
    },
  })

  // Seed Cards
  console.log('🎴 Seeding cards...')
  await prisma.card.createMany({
    data: [
      {
        id: 'card1',
        myChar: '01',
        oppChar: '08',
        percentBand: '0-30',
        situation: 'neutral',
        section: '立ち回り',
        oppMove: 'ダッシュ攻撃',
        answerMD: '**対策:**\\n- ガードから掴み\\n- 後ろ回避から反撃\\n- ジャンプで避けて空後',
        tags: ['基本', '対空'],
        deckId: deck1.id,
        order: 1,
      },
      {
        id: 'card2',
        myChar: '01',
        oppChar: '08',
        percentBand: '40-70',
        situation: 'ledgetrap',
        section: '崖狩り',
        oppMove: 'その場上がり',
        answerMD: '**対策:**\\n- 下スマッシュ\\n- 前投げ→空前\\n- ダッシュ掴み',
        tags: ['崖狩り', 'コンボ'],
        deckId: deck1.id,
        order: 2,
      },
      {
        id: 'card3',
        myChar: '09',
        oppChar: '01',
        percentBand: 'Kill%',
        situation: 'neutral',
        section: '立ち回り',
        oppMove: '空前',
        answerMD: '**対策:**\\n- 雷でカウンター\\n- 下から復帰阻止\\n- ガードして反撃',
        tags: ['雷', '復帰阻止'],
        deckId: deck2.id,
        order: 1,
      },
    ],
  })

  // Seed Posts
  console.log('📱 Seeding posts...')
  await prisma.post.createMany({
    data: [
      {
        id: 'post1',
        content: 'マリオ vs フォックス対策デッキを更新しました！新しく復帰阻止のカードを追加。',
        userId: user1.id,
        deckId: deck1.id,
        tags: ['マリオ', '対策', 'フォックス'],
      },
      {
        id: 'post2',
        content: '今日のVIP戦でピカチュウと当たったんですが、雷パターンが全然読めませんでした😅',
        userId: user2.id,
        tags: ['質問', 'ピカチュウ', 'VIP'],
      },
      {
        id: 'post3',
        content: '崖狩り特化デッキを作ってみました。主にクラウドで使っています。',
        userId: user3.id,
        deckId: deck3.id,
        tags: ['クラウド', '崖狩り', 'デッキ'],
      },
    ],
  })

  // Seed Communities
  console.log('🏘️ Seeding communities...')
  const community1 = await prisma.community.create({
    data: {
      id: 'community1',
      name: 'マリオ研究会',
      description: 'マリオ使いのための情報交換コミュニティ。新技の開発やマッチアップ対策を共有しています。',
      character: '01',
      tags: ['マリオ', 'コンボ', '対策'],
    },
  })

  const community2 = await prisma.community.create({
    data: {
      id: 'community2',
      name: 'VIP到達サポート',
      description: 'VIP到達を目指すプレイヤー同士で情報交換。メンタル面のサポートも行っています。',
      tags: ['VIP', 'サポート', '初心者'],
    },
  })

  // Seed Community Members
  await prisma.communityMember.createMany({
    data: [
      { userId: user1.id, communityId: community1.id, role: 'admin' },
      { userId: user2.id, communityId: community1.id, role: 'member' },
      { userId: user3.id, communityId: community2.id, role: 'member' },
    ],
  })

  // Seed Messages
  console.log('💬 Seeding messages...')
  await prisma.message.createMany({
    data: [
      {
        content: 'マリオの上強→空上のコンボ、%帯によって繋がり方が変わりますよね。',
        userId: user1.id,
        communityId: community1.id,
      },
      {
        content: '大体0-40%くらいまでは確定で繋がって、40-70%は相手のベクトル変更次第ですね。',
        userId: user2.id,
        communityId: community1.id,
      },
    ],
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })