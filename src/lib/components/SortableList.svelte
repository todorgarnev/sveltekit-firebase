<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { flip } from "svelte/animate";

	interface Item {
		id: string;
		index: number;
		[key: string]: any;
	}

	export let list: any[];
	let isOver: string | boolean = false;

	const dispatch = createEventDispatcher();

	const getDraggedParent = (node: any): Item => {
		if (!node.dataset.index) {
			return getDraggedParent(node.parentNode);
		} else {
			return { ...node.dataset } as Item;
		}
	}

	const onDragStart = (e: DragEvent) => {
		const dragged = getDraggedParent(e.target);
		e.dataTransfer?.setData("source", dragged?.index.toString());
	}

	const onDragOver = (e: DragEvent) => {
		// @ts-ignore
		const id = e.target.dataset?.id;
		const dragged = getDraggedParent(e.target);
		isOver = dragged?.id ?? false;
	}

	const onDragLeave = (e: DragEvent) => {
		const dragged = getDraggedParent(e.target);
		isOver === dragged.id && (isOver = false);
	}

	const onDrop = (e: DragEvent) => {
		isOver = false;
		const dragged = getDraggedParent(e.target);
		reorder({
			from: e.dataTransfer?.getData("source"),
			to: dragged.index
		});
	}

	const reorder = ({ from, to }: any) => {
		const newList = [...list];
		newList[from] = [newList[to], (newList[to] = newList[from])][0];

		dispatch("sort", newList);
	};
</script>

{#if list?.length}
	<ul class="flex flex-col items-center p-0 list-none">
		{#each list as item, index (item.id)}
			<li
				class="w-full max-w-md p-2 transition-all border-2 border-transparent border-dashed"
				class:over={item.id === isOver}
				data-index={index}
				data-id={item.id}
				draggable="true"
				on:dragstart={onDragStart}
				on:dragover|preventDefault={onDragOver}
				on:dragleave={onDragLeave}
				on:drop|preventDefault={onDrop}
				animate:flip={{ duration: 300 }}
			>
				<slot {item} />
			</li>
		{/each}
	</ul>
{:else}
	<p class="my-12 text-lg font-bold text-center">No items</p>
{/if}

<style>
	.over {
		@apply border-gray-400 scale-105;
	}
</style>
