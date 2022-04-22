import { goto } from '$app/navigation';
import type { Category, Score } from '@prisma/client';
import { writable, type Writable } from 'svelte/store';

async function handleChangeScore(score: Score) {
	if (!score.userId) {
		goto('/login');
	} else {
		if (score.value) {
			const data = { value: score.value };
			await fetch(`/api/plates/${score.modelId}/scores/${score.categoryId}`, {
				method: 'put',
				body: JSON.stringify(data)
			});
		} else {
			await fetch(`/api/plates/${score.modelId}/scores/${score.categoryId}`, {
				method: 'delete'
			});
		}
	}
}

export function transformScores(
	scores: Score[],
	modelId: number,
	userId: number,
	categories: Category[]
) {
	let userScores: { [categoryId: number]: Writable<Score> } = categories.reduce(
		(previous, category) => {
			previous[category.id] = writable({
				modelId: modelId,
				userId: userId,
				categoryId: category.id,
				value: null
			});
			return previous;
		},
		{}
	);

	let editorialScores: { [categoryId: number]: Writable<Score> } = categories.reduce(
		(previous, category) => {
			previous[category.id] = writable({
				modelId: modelId,
				userId: 1,
				categoryId: category.id,
				value: null
			});
			return previous;
		},
		{}
	);
	let graphScores: { [categoryId: number]: Writable<Score>[] } = categories.reduce(
		(previous, category) => {
			previous[category.id] = [];
			return previous;
		},
		{}
	);

	scores.forEach((score) => {
		const scoreStore = writable(score);

		if (score.userId == userId) {
			userScores[score.categoryId] = scoreStore;
		}

		if (score.userId == 1) {
			editorialScores[score.categoryId] = scoreStore;
		}

		graphScores[score.categoryId].push(scoreStore);
	});

	if (userId == 1) {
		editorialScores = userScores;
	}

	Object.entries(userScores).forEach(([_categoryId, scoreStore]) => {
		let fired = false;
		scoreStore.subscribe(async (score) => {
			if (!fired) {
				fired = true;
			} else {
				await handleChangeScore(score);
			}
		});
	});

	return { userScores, editorialScores, graphScores };
}
