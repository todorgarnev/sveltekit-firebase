<script lang="ts">
	import AuthCheck from "$lib/components/AuthCheck.svelte";
	import { doc, getDoc, writeBatch } from "firebase/firestore";
	import { db, user } from "$lib/firebase";

	let username: string = "";
	let loading: boolean = false;
	let isAvailable: boolean = false;
	let debounceTimer: NodeJS.Timeout;

	const checkAvailability = async () => {
		loading = true;
		isAvailable = false;
		clearTimeout(debounceTimer);

		debounceTimer = setTimeout(async () => {
			const ref = doc(db, "usernames", username);
			const exists = await getDoc(ref).then((doc) => doc.exists());

			isAvailable = !exists;
			loading = false;
		}, 500);
	};

	const confirmUsername = async () => {
		const batch = writeBatch(db);

		batch.set(doc(db, "usernames", username), {uid: $user?.uid});
		batch.set(doc(db, "users", $user!.uid), {
			username,
			photoURL: $user?.photoURL ?? null,
			published: true,
			bio: "I am the Walrus",
			links: [
				{
					title: "Test Link",
					url: "https://abv.bg",
					icon: "custom"
				}
			]
		});

		await batch.commit();

		username = "";
		isAvailable = false;
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
