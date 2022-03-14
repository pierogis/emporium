import { getImages } from '$lib/database/images';

/** @type {import('./plates/[id]/images').RequestHandler} */
export async function get({ params }: { params: { id: string } }) {
	const parsedParams = { plateId: parseInt(params.id) };
	const images = await getImages(parsedParams);

	return {
		body: { images }
	};
}
