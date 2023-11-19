import axios from "axios";
import type { RequestHandler } from "./$types";
import { PUBLIC_APP_ID, PUBLIC_AUTH_URL } from "$env/static/public";
import { redirect } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ cookies }) => {
	try {
		const refresh = cookies.get("refresh");

		await axios.post(
			`${PUBLIC_AUTH_URL}/auth/${PUBLIC_APP_ID}/logout`,
			{},
			{
				headers: {
					Cookie: `refresh=${refresh};`
				}
			}
		);

		cookies.delete("access", { path: "/" });
		cookies.delete("refresh", { path: "/" });
	} catch (err) {
		console.error(err);
	}

	throw redirect(302, "/");
};
