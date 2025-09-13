import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'

// Sample data - replace with real data from database
const sampleDeck = {
  id: '1',
  title: 'マリオ vs フォックス対策',
  description: 'フォックスとの対戦で使える基本的な対策をまとめました。特に復帰阻止と崖狩りに重点を置いています。',
  myCharacter: '01',
  characterName: 'マリオ',
  user: { 
    id: '1',
    name: 'プレイヤー1', 
    image: '/default-avatar.png' 
  },
  likes: 24,
  uses: 156,
  tags: ['立ち回り', '復帰阻止', '崖狩り'],
  isPublic: true,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-20'),
}

const sampleCards = [
  {
    id: '1',
    myChar: '01',
    oppChar: '08',
    percentBand: '0-30',
    situation: 'neutral',
    section: '立ち回り',
    oppMove: 'ダッシュ攻撃',
    answerMD: '**対策:**\n- ガードから掴み\n- 後ろ回避から反撃\n- ジャンプで避けて空後',
    tags: ['基本', '対空'],
  },
  {
    id: '2', 
    myChar: '01',
    oppChar: '08',
    percentBand: '40-70',
    situation: 'ledgetrap',
    section: '崖狩り',
    oppMove: 'その場上がり',
    answerMD: '**対策:**\n- 下スマッシュ\n- 前投げ→空前\n- ダッシュ掴み',
    tags: ['崖狩り', 'コンボ'],
  },
  {
    id: '3',
    myChar: '01', 
    oppChar: '08',
    percentBand: 'Kill%',
    situation: 'edgeguard',
    section: '復帰阻止',
    oppMove: 'ファイアフォックス',
    answerMD: '**対策:**\n- ポンプで押し出し\n- 空前でメテオ\n- ステージ端で待機',
    tags: ['復帰阻止', 'キル'],
  },
]

interface DeckDetailPageProps {
  params: {
    id: string
  }
}

export default function DeckDetailPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-4">
                {sampleDeck.characterName.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{sampleDeck.title}</h1>
                <p className="text-gray-600">{sampleDeck.characterName}使い</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                ❤️ {sampleDeck.likes}
              </Button>
              <Button variant="outline" size="sm">
                📋 コピー
              </Button>
              <Button size="sm">
                使用する
              </Button>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">{sampleDeck.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {sampleDeck.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>👥 {sampleDeck.uses}回使用</span>
              <span>📝 {sampleCards.length}カード</span>
              <span>作成: {sampleDeck.createdAt.toLocaleDateString('ja-JP')}</span>
            </div>
            <div className="flex items-center">
              <img
                src={sampleDeck.user.image}
                alt={sampleDeck.user.name}
                className="w-6 h-6 rounded-full mr-2"
              />
              <span>{sampleDeck.user.name}</span>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">カード一覧</h2>
            <div className="flex space-x-2">
              <select className="p-2 border border-gray-300 rounded-md text-sm">
                <option value="">すべてのセクション</option>
                <option value="立ち回り">立ち回り</option>
                <option value="崖狩り">崖狩り</option>
                <option value="復帰阻止">復帰阻止</option>
              </select>
              <select className="p-2 border border-gray-300 rounded-md text-sm">
                <option value="">すべての%帯</option>
                <option value="0-30">0-30%</option>
                <option value="40-70">40-70%</option>
                <option value="Kill%">Kill%</option>
              </select>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleCards.map((card) => (
              <div key={card.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex space-x-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {card.section}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {card.percentBand}
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>相手の行動:</strong> {card.oppMove}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>状況:</strong> {card.situation}
                  </div>
                </div>
                
                <div className="prose prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ 
                    __html: card.answerMD.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')
                  }} />
                </div>
                
                <div className="flex flex-wrap gap-1 mt-4">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">このデッキを使用する</h3>
              <p className="text-gray-600">デッキをコピーして自分の対策ノートに追加できます</p>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline">
                お気に入りに追加
              </Button>
              <Button>
                デッキをコピー
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}