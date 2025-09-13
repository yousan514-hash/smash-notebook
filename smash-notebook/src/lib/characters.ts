export interface Character {
  id: string;
  name: string;
  nameJa: string;
  series: string;
  imageUrl?: string;
}

export const CHARACTERS: Character[] = [
  { id: '00', name: 'Template', nameJa: 'テンプレート', series: 'System' },
  { id: '01', name: 'Mario', nameJa: 'マリオ', series: 'Super Mario' },
  { id: '02', name: 'Donkey Kong', nameJa: 'ドンキーコング', series: 'Donkey Kong' },
  { id: '03', name: 'Link', nameJa: 'リンク', series: 'The Legend of Zelda' },
  { id: '04', name: 'Samus', nameJa: 'サムス', series: 'Metroid' },
  { id: '05', name: 'Dark Samus', nameJa: 'ダークサムス', series: 'Metroid' },
  { id: '06', name: 'Yoshi', nameJa: 'ヨッシー', series: 'Yoshi' },
  { id: '07', name: 'Kirby', nameJa: 'カービィ', series: 'Kirby' },
  { id: '08', name: 'Fox', nameJa: 'フォックス', series: 'Star Fox' },
  { id: '09', name: 'Pikachu', nameJa: 'ピカチュウ', series: 'Pokémon' },
  { id: '10', name: 'Luigi', nameJa: 'ルイージ', series: 'Super Mario' },
  { id: '11', name: 'Ness', nameJa: 'ネス', series: 'EarthBound' },
  { id: '12', name: 'Captain Falcon', nameJa: 'キャプテン・ファルコン', series: 'F-Zero' },
  { id: '13', name: 'Jigglypuff', nameJa: 'プリン', series: 'Pokémon' },
  { id: '14', name: 'Peach', nameJa: 'ピーチ', series: 'Super Mario' },
  { id: '15', name: 'Daisy', nameJa: 'デイジー', series: 'Super Mario' },
  { id: '16', name: 'Bowser', nameJa: 'クッパ', series: 'Super Mario' },
  { id: '17', name: 'Ice Climbers', nameJa: 'アイスクライマー', series: 'Ice Climber' },
  { id: '18', name: 'Sheik', nameJa: 'シーク', series: 'The Legend of Zelda' },
  { id: '19', name: 'Zelda', nameJa: 'ゼルダ', series: 'The Legend of Zelda' },
  { id: '20', name: 'Dr. Mario', nameJa: 'ドクターマリオ', series: 'Super Mario' },
  { id: '21', name: 'Pichu', nameJa: 'ピチュー', series: 'Pokémon' },
  { id: '22', name: 'Falco', nameJa: 'ファルコ', series: 'Star Fox' },
  { id: '23', name: 'Marth', nameJa: 'マルス', series: 'Fire Emblem' },
  { id: '24', name: 'Lucina', nameJa: 'ルキナ', series: 'Fire Emblem' },
  { id: '25', name: 'Young Link', nameJa: 'こどもリンク', series: 'The Legend of Zelda' },
  { id: '26', name: 'Ganondorf', nameJa: 'ガノンドロフ', series: 'The Legend of Zelda' },
  { id: '27', name: 'Mewtwo', nameJa: 'ミュウツー', series: 'Pokémon' },
  { id: '28', name: 'Roy', nameJa: 'ロイ', series: 'Fire Emblem' },
  { id: '29', name: 'Chrom', nameJa: 'クロム', series: 'Fire Emblem' },
  { id: '30', name: 'Mr. Game & Watch', nameJa: 'Mr.ゲーム&ウォッチ', series: 'Game & Watch' },
  { id: '31', name: 'Meta Knight', nameJa: 'メタナイト', series: 'Kirby' },
  { id: '32', name: 'Pit', nameJa: 'ピット', series: 'Kid Icarus' },
  { id: '33', name: 'Dark Pit', nameJa: 'ブラックピット', series: 'Kid Icarus' },
  { id: '34', name: 'Zero Suit Samus', nameJa: 'ゼロスーツサムス', series: 'Metroid' },
  { id: '35', name: 'Wario', nameJa: 'ワリオ', series: 'Wario' },
  { id: '36', name: 'Snake', nameJa: 'スネーク', series: 'Metal Gear' },
  { id: '37', name: 'Ike', nameJa: 'アイク', series: 'Fire Emblem' },
  { id: '38', name: 'Pokémon Trainer', nameJa: 'ポケモントレーナー', series: 'Pokémon' },
  { id: '39', name: 'Diddy Kong', nameJa: 'ディディーコング', series: 'Donkey Kong' },
  { id: '40', name: 'Lucas', nameJa: 'リュカ', series: 'EarthBound' },
  { id: '41', name: 'Sonic', nameJa: 'ソニック', series: 'Sonic the Hedgehog' },
  { id: '42', name: 'King Dedede', nameJa: 'デデデ', series: 'Kirby' },
  { id: '43', name: 'Olimar', nameJa: 'ピクミン&オリマー', series: 'Pikmin' },
  { id: '44', name: 'Lucario', nameJa: 'ルカリオ', series: 'Pokémon' },
  { id: '45', name: 'R.O.B.', nameJa: 'ロボット', series: 'R.O.B.' },
  { id: '46', name: 'Toon Link', nameJa: 'トゥーンリンク', series: 'The Legend of Zelda' },
  { id: '47', name: 'Wolf', nameJa: 'ウルフ', series: 'Star Fox' },
  { id: '48', name: 'Villager', nameJa: 'むらびと', series: 'Animal Crossing' },
  { id: '49', name: 'Mega Man', nameJa: 'ロックマン', series: 'Mega Man' },
  { id: '50', name: 'Wii Fit Trainer', nameJa: 'Wii Fit トレーナー', series: 'Wii Fit' },
  { id: '51', name: 'Rosalina & Luma', nameJa: 'ロゼッタ&チコ', series: 'Super Mario' },
  { id: '52', name: 'Little Mac', nameJa: 'リトル・マック', series: 'Punch-Out!!' },
  { id: '53', name: 'Greninja', nameJa: 'ゲッコウガ', series: 'Pokémon' },
  { id: '54', name: 'Mii Brawler', nameJa: 'Mii格闘タイプ', series: 'Mii' },
  { id: '55', name: 'Mii Swordfighter', nameJa: 'Mii剣術タイプ', series: 'Mii' },
  { id: '56', name: 'Mii Gunner', nameJa: 'Mii射撃タイプ', series: 'Mii' },
  { id: '57', name: 'Palutena', nameJa: 'パルテナ', series: 'Kid Icarus' },
  { id: '58', name: 'Pac-Man', nameJa: 'パックマン', series: 'Pac-Man' },
  { id: '59', name: 'Robin', nameJa: 'ルフレ', series: 'Fire Emblem' },
  { id: '60', name: 'Shulk', nameJa: 'シュルク', series: 'Xenoblade Chronicles' },
  { id: '61', name: 'Bowser Jr.', nameJa: 'クッパJr.', series: 'Super Mario' },
  { id: '62', name: 'Duck Hunt', nameJa: 'ダックハント', series: 'Duck Hunt' },
  { id: '63', name: 'Ryu', nameJa: 'リュウ', series: 'Street Fighter' },
  { id: '64', name: 'Ken', nameJa: 'ケン', series: 'Street Fighter' },
  { id: '65', name: 'Cloud', nameJa: 'クラウド', series: 'Final Fantasy' },
  { id: '66', name: 'Corrin', nameJa: 'カムイ', series: 'Fire Emblem' },
  { id: '67', name: 'Bayonetta', nameJa: 'ベヨネッタ', series: 'Bayonetta' },
  { id: '68', name: 'Inkling', nameJa: 'インクリング', series: 'Splatoon' },
  { id: '69', name: 'Ridley', nameJa: 'リドリー', series: 'Metroid' },
  { id: '70', name: 'Simon', nameJa: 'シモン', series: 'Castlevania' },
  { id: '71', name: 'Richter', nameJa: 'リヒター', series: 'Castlevania' },
  { id: '72', name: 'King K. Rool', nameJa: 'キングクルール', series: 'Donkey Kong' },
  { id: '73', name: 'Isabelle', nameJa: 'しずえ', series: 'Animal Crossing' },
  { id: '74', name: 'Incineroar', nameJa: 'ガオガエン', series: 'Pokémon' },
  { id: '75', name: 'Piranha Plant', nameJa: 'パックンフラワー', series: 'Super Mario' },
  { id: '76', name: 'Joker', nameJa: 'ジョーカー', series: 'Persona' },
  { id: '77', name: 'Hero', nameJa: '勇者', series: 'Dragon Quest' },
  { id: '78', name: 'Banjo & Kazooie', nameJa: 'バンジョー&カズーイ', series: 'Banjo-Kazooie' },
  { id: '79', name: 'Terry', nameJa: 'テリー', series: 'Fatal Fury' },
  { id: '80', name: 'Byleth', nameJa: 'ベレト/ベレス', series: 'Fire Emblem' },
  { id: '81', name: 'Min Min', nameJa: 'ミェンミェン', series: 'ARMS' },
  { id: '82', name: 'Steve', nameJa: 'スティーブ/アレックス', series: 'Minecraft' },
  { id: '83', name: 'Sephiroth', nameJa: 'セフィロス', series: 'Final Fantasy' },
  { id: '84', name: 'Pyra/Mythra', nameJa: 'ホムラ/ヒカリ', series: 'Xenoblade Chronicles' },
  { id: '85', name: 'Kazuya', nameJa: 'カズヤ', series: 'Tekken' },
  { id: '86', name: 'Sora', nameJa: 'ソラ', series: 'Kingdom Hearts' },
];

export const PERCENT_BANDS = ['0-30', '40-70', '80+', 'Kill%'] as const;
export type PercentBand = typeof PERCENT_BANDS[number];

export const SITUATIONS = ['neutral', 'ledgetrap', 'edgeguard', 'recovery', 'combo', 'line'] as const;
export type Situation = typeof SITUATIONS[number];

export const SECTIONS = ['立ち回り', '崖展開', '崖狩り', '復帰阻止', 'ライン回復', '崖上がり', '復帰'] as const;
export type Section = typeof SECTIONS[number];

export function getCharacterById(id: string): Character | undefined {
  return CHARACTERS.find(char => char.id === id);
}

export function getCharactersByName(query: string): Character[] {
  const lowerQuery = query.toLowerCase();
  return CHARACTERS.filter(char => 
    char.name.toLowerCase().includes(lowerQuery) || 
    char.nameJa.includes(query)
  );
}