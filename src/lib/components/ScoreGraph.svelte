<script lang="ts">
	import type { Score } from '@prisma/client';
	import { derived, type Readable } from 'svelte/store';

	export let scoreStores: Readable<Score>[];

	// maximum is 10
	// minimum is 0

	// 0, 1, 2
	// 3, 4
	// 5, 6
	// 7, 8
	// 9, 10

	const scores = derived(scoreStores, (scores) => {
		return scores;
	});

	$: quotients = $scores.reduce(
		(prev, next) => {
			prev[Math.floor((next.value - 1) / 2)]++;

			return prev;
		},
		{
			0: 0,
			1: 0,
			2: 0,
			3: 0,
			4: 0
		}
	);

	const barWidth = 3;
	const dividerWidth = 1;
</script>

<svg height="20px" width="20px">
	{#each Object.values(quotients) as count, i}
		<g class="bar" transform={`translate(${i * (barWidth + dividerWidth)},0)`}>
			<rect
				height={1 + (count / $scores.length || 0) * 12}
				y={19 - (count / $scores.length || 0) * 12}
				width={barWidth}
			/>
		</g>
		{#if i < 4}
			<g class="divider" transform={`translate(${i * (barWidth + dividerWidth) + barWidth},0)`}>
				<rect height="10" y="10" width={dividerWidth} />
			</g>
		{/if}
	{/each}
</svg>

<style>
	.bar {
		fill: var(--text-color);
	}
	.divider {
		fill: transparent;
	}
	svg {
		padding-top: 2px;
	}
</style>
