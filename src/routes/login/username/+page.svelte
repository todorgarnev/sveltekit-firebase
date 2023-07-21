<script lang="ts">
	import AuthCheck from "$lib/components/AuthCheck.svelte";
	import { db, user } from "$lib/firebase";
	import { doc, getDoc, writeBatch } from "firebase/firestore";

	let username: string = "";
	let loading: boolean = false;
	let isAvailable: boolean = false;
	let debounceTimer: NodeJS.Timeout;

	const checkAvailability = async () => {
		isAvailable = false;
		clearTimeout(debounceTimer);

		loading = true;

		debounceTimer = setTimeout(async () => {
			const ref = doc(db, "usernames", username);
			const exists = await getDoc(ref).then((doc) => doc.exists());

			isAvailable = !exists;
			loading = false;
		}, 500);
	};

	const confirmUsername = async () => {
		// TODO
	};
</script>

<AuthCheck>
	<h2>Username</h2>

	<form class="w-2/5" on:submit|preventDefault={confirmUsername}>
		<input type="text" placeholder="Username" class="w-full input" bind:value={username} on:input={checkAvailability} />

		<p>Is available? {isAvailable}</p>

		<button class="btn btn-success">Confirm username @{username} </button>
	</form>
</AuthCheck>
