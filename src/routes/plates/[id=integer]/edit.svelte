<!-- plates/[id=integer]/edit.svelte -->
<script lang="ts" context="module">
	import { protect } from '$lib/helpers';

	import type { Load } from './__types/edit';
	export const load: Load = async ({ session, params, fetch }) => {
		async function handler() {
			const plateResponse = await fetch(`/api/plates/${params.id}`);

			if (plateResponse.status == 404) {
				return { status: 404, error: "plate doesn't exist" };
			}

			const plate: FullPlate = await plateResponse.json();

			const jurisdictionsResponse = await fetch(`/api/jurisdictions`);
			const jurisdictions: FullPlate = await jurisdictionsResponse.json();

			return {
				props: { plate, jurisdictions }
			};
		}

		return await protect(session, handler);
	};
</script>

<script lang="ts">
	import type { Jurisdiction } from '@prisma/client';
	import type { FullPlate } from '$lib/database/models';

	import PlateTemplate from '$lib/components/PlateTemplate.svelte';

	export let plate: FullPlate;
	export let jurisdictions: Jurisdiction[];
</script>

<svelte:head>
	<title>plate: {plate.modelId} edit</title>
</svelte:head>

<form action="/plates/{plate.modelId}/edit" method="post">
	<PlateTemplate {jurisdictions} {plate} />
</form>
