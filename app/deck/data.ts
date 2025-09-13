export type Card = {
	id: string;
	myChar: string;
	oppChar: string;
	percentBand: string;
	situation: string;
	oppMove?: string;
	answerMD: string;
};

export type Deck = {
	id: string;
	title: string;
	description?: string;
	cards: Card[];
};

export const mockDecks: Deck[] = [
	{
		id: "1",
		title: "ピカチュウ対策",
		description: "コンボと崖展開メモ",
		cards: [
			{
				id: "c1",
				myChar: "マリオ",
				oppChar: "ピカチュウ",
				percentBand: "0-40%",
				situation: "着地狩り",
				answerMD: "上強からの展開を重視。回避読みで上スマ。",
			},
			{
				id: "c2",
				myChar: "マリオ",
				oppChar: "ピカチュウ",
				percentBand: "80-120%",
				situation: "撃墜択",
				oppMove: "ガード多め",
				answerMD: "つかみ通して下投げから展開。",
			},
		],
	},
	{
		id: "2",
		title: "スネーク対策",
		description: "手榴弾対処",
		cards: [
			{
				id: "c3",
				myChar: "フォックス",
				oppChar: "スネーク",
				percentBand: "0-30%",
				situation: "ニュートラル",
				answerMD: "手榴弾保持時は投げと掴みの二択。",
			},
		],
	},
];