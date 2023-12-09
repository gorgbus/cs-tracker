import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.user && (url.pathname === "/investments" || url.pathname === "/inventory"))
		throw redirect(303, "/");

	if (locals.user && url.pathname === "/") throw redirect(303, "/investments");

	return {
		user: locals.user
	};
};
