<script lang="ts">
	import AuthCheck from "$lib/components/AuthCheck.svelte";
	import { doc, getDoc, writeBatch } from "firebase/firestore";
	import { db, user, userData } from "$lib/firebase";

	let username: string = "";
	let loading: boolean = false;
	let isAvailable: boolean = false;
	let debounceTimer: NodeJS.Timeout;

	const re = /^(?=[a-zA-Z0-9._]{3,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

	$: isValid = username?.length > 2 && username.length < 17 && re.test(username);
	$: isTouched = username.length > 0;
	$: isTaken = isValid && !isAvailable && !loading;

	const checkAvailability = async () => {
		loading = true;
		isAvailable = false;
		clearTimeout(debounceTimer);

		debounceTimer = setTimeout(async () => {
			if (username) {
				const ref = doc(db, "usernames", username);
				const exists = await getDoc(ref).then((doc) => doc.exists());

				isAvailable = !exists;
			}

			loading = false;
		}, 500);
	};

	const confirmUsername = async () => {
		const batch = writeBatch(db);

		batch.set(doc(db, "usernames", username), { uid: $user?.uid });
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
	{#if $userData?.username}
		<p class="text-lg">
			Your username is <span class="font-bold text-success">@{$userData.username}</span>
		</p>
		<p class="text-sm">(Usernames cannot be changed)</p>
		<a class="btn btn-primary" href="/login/photo">Upload Profile Image</a>
	{:else}
		<form class="w-2/5" on:submit|preventDefault={confirmUsername}>
			<input
				type="text"
				placeholder="Username"
				class="w-full input"
				bind:value={username}
				on:input={checkAvailability}
				class:input-error={!isValid && isTouched}
				class:input-warning={isTaken}
				class:input-success={isAvailable && isValid && !loading}
			/>

			<div class="w-full px-8 my-4 min-h-16">
				{#if loading}
					<p class="text-secondary">Checking availability of @{username}...</p>
				{/if}

				{#if !isValid && isTouched && !loading}
					<p class="text-sm text-error">must be 3-16 characters long, alphanumeric only</p>
				{/if}

				{#if isValid && !isAvailable && !loading}
					<p class="text-sm text-warning">
						@{username} is not available
					</p>
				{/if}

				{#if isAvailable && isValid && isTouched}
					<button class="btn btn-success">Confirm username @{username} </button>
				{/if}
			</div>
		</form>
	{/if}
</AuthCheck>
