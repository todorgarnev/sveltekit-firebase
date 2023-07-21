<script lang="ts">
	export let icon: string = "default";
	export let url: string = "foo";
	export let title: string = "some cool title";
</script>

<a
	href={url}
	class="flex items-center justify-center w-full max-w-md p-4 text-center no-underline rounded-lg stack bg-base-300 not-prose"
	target="_blank"
>
	<img src={`/${icon}.png`} alt={icon} width="32" height="32" class="w-8" />
	<span class="text-lg font-bold text-white">{title}</span>
</a>
