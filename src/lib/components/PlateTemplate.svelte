<script lang="ts">
	import { goto } from '$app/navigation';

	import { Card } from '@pierogis/utensils';
	// import DropZone from '$lib/components/DropZone.svelte';
	import type { FullPlate } from '$lib/database/models';
	import type { Jurisdiction } from '@prisma/client';

	export let jurisdictions: Jurisdiction[];
	export let plate: FullPlate = null;
	// export let showImageInput = false;

	// let imageInputElement: HTMLInputElement;

	// function handleImageSubmit() {
	// 	createImage(plate.modelId, imageInputElement.files && imageInputElement.files[0]);
	// }

	async function handleDelete(_event: MouseEvent) {
		await fetch(`/api/plates/${plate.modelId}`, { method: 'delete' });
		goto('/plates');
	}
</script>

<Card>
	{#if plate}
		<a class="back" href={`/plates/${plate.modelId}`}>🔙</a>
		<form class="delete" action={`/plates/${plate.modelId}/delete`} method="post">
			<input class="no-select" type="submit" value="❌" on:click|preventDefault={handleDelete} />
		</form>
	{/if}

	<input
		type="text"
		class="jurisdiction border inset shadow"
		list="jurisdictions"
		name="jurisdiction"
		required
		maxlength="2"
		placeholder="oh"
		value={plate ? plate.jurisdiction.abbreviation : ''}
	/>

	<datalist id="jurisdictions">
		{#each jurisdictions as jurisdiction}
			<option value={jurisdiction.abbreviation} />
		{/each}
	</datalist>

	<!-- {#if showImageInput}
		<div class="image-input">
			<DropZone bind:inputElement={imageInputElement} />
			<button on:click={handleImageSubmit} />
		</div>
	{/if} -->

	<input
		type="url"
		class="border inset shadow"
		name="imageUrl"
		value={plate?.model.images ? plate.model.images[0]?.url || '' : ''}
		placeholder="https://www.flhsmv.gov/wp-content/uploads/plate1-1.jpg"
	/>

	<span>
		<input
			type="text"
			class="year border inset shadow"
			name="startYear"
			value={plate ? plate.startYear : ''}
			placeholder="2016"
			maxlength="4"
		/>-<input
			type="text"
			class="year border inset shadow"
			name="endYear"
			value={plate ? plate.endYear : ''}
			placeholder="2022"
			maxlength="4"
		/>
	</span>
	<input class="border inset shadow no-select" type="submit" method="post" value="submit" />
</Card>

<style>
	.delete {
		position: absolute;
		display: flex;

		background-color: transparent;

		right: 0.4rem;
	}

	.back {
		position: absolute;
		display: flex;

		background-color: transparent;

		left: 0.4rem;
	}

	input[type='text'].jurisdiction {
		width: 2em;
	}
	input[type='text'].year {
		width: 3em;
	}
	input[type='url'] {
		width: 20em;
	}
	/* .image-input {
		max-height: 196px;

		display: flex;
		justify-content: center;
	} */
</style>
