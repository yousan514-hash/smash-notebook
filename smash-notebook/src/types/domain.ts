export type PercentBand = "0-30" | "40-70" | "80+" | "Kill%";

export type Situation =
	| "neutral"
	| "ledgetrap"
	| "edgeguard"
	| "recovery"
	| "combo"
	| "line";

export type Card = {
	id: string;
	myChar: string;
	oppChar: string;
	percentBand: PercentBand;
	situation: Situation;
	oppMove?: string | null;
	answerMD: string;
};

export type Deck = {
	id: string;
	name: string;
};

export type Post = {
	id: string;
	content: string;
	created_at?: string;
	cards?: Card[];
};

