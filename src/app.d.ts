// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: {
				user_id: number;
				steam: {
					id: string;
					avatar: string;
					username: string;
				};
			};
		}
		// interface PageData {}
		// interface Platform {}
		namespace Superforms {
			type Message = {
				type: "error" | "success";
				text: string;
			};
		}
	}
}

export {};
