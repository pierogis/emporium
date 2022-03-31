import { deleteScore, upsertScore } from '$lib/database/scores';
import type { Category } from '@prisma/client';

/** @type {import('./plates/[id]/scores/[category]').RequestHandler} */
export async function put({ locals, request, params }) {
	if (locals.user) {
		const formData: FormData = await request.formData();

		const plateId = parseInt(params.id);
		const userId: number = locals.user.id;
		const category: Category = params.category;

		const valueEntry = formData.get('value');

		const score = {
			plateId,
			userId,
			category,
			value: valueEntry ? parseInt(valueEntry.toString()) : undefined
		};

		await upsertScore(score);

		// redirect to the updated plate
		return {
			status: 303,
			headers: {
				location: `/plates/${plateId}/scores`
			}
		};
	} else {
		return {
			status: 301,
			headers: {
				location: `/login`
			}
		};
	}
}

/** @type {import('./plates/[id]/scores/[category]').RequestHandler} */
export async function del({ locals, params }) {
	if (locals.user) {
		const plateId = parseInt(params.id);
		const userId: number = locals.user.id;
		const category: Category = params.category;

		const score = {
			plateId,
			userId,
			category
		};

		await deleteScore(score);

		// redirect to the updated plate
		return {
			status: 303,
			headers: {
				location: `/plates/${plateId}`
			}
		};
	} else {
		return {
			status: 301,
			headers: {
				location: `/login`
			}
		};
	}
}
