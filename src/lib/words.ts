import { readFileSync } from 'fs';

let adverbs: string[];
let adjectives: string[];
let nouns: string[];

let names: string[];
let alphabet: string[];

export let setup = false;

export function setupWords() {
	adverbs = adverbs || readJson('static/words/adverbs.json');
	adjectives = adjectives || readJson('static/words/adjectives.json');
	nouns = nouns || readJson('static/words/nouns.json');
	names = names || readJson('static/words/names.json');
	alphabet = alphabet || readJson('static/words/alphabet.json');

	setup = true;
}

function readJson(path: string): string[] {
	const json = readFileSync(path, 'utf8');

	return JSON.parse(json);
}

function selectRandom<T>(options: T[]): T {
	return options[Math.floor(options.length * Math.random())];
}

export function generateEmailAddress(): string {
	if (!setup) {
		setupWords();
	}
	return `${selectRandom(names)}@pierogis.live`;
}

export function generatePhrase(): string {
	if (!setup) {
		setupWords();
	}
	return `${selectRandom(adverbs)}-${selectRandom(adjectives)}-${selectRandom(nouns)}`;
}

export function generateSerial(): string {
	if (!setup) {
		setupWords();
	}
	// except I, O, Q

	const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

	const serial = [
		selectRandom(alphabet),
		selectRandom(alphabet),
		selectRandom(alphabet),
		selectRandom(digits),
		selectRandom(digits),
		selectRandom(digits),
		selectRandom(digits)
	];

	return serial.join('');
}
