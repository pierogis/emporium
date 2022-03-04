import { getImages } from '$lib/database/image';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ params }: { params: { id: string } }) {
	const parsedParams = { plateId: parseInt(params.id) };
	const scores = await getImages(parsedParams);

	return {
		body: { scores }
	};
}
