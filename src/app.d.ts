/// <reference types="@sveltejs/kit" />

interface User {
	id: number;
	email: string;
	name: string;
	isAdmin: boolean;
}

// See https://kit.svelte.dev/docs/typescript
// for information about these interfaces
declare namespace App {
	interface Locals {
		user: User;
	}

	interface Platform {}

	interface Session {
		user?: User;
	}

	interface Stuff {}
}
