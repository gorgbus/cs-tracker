import axios from "axios";
import type { RequestHandler } from "./$types";
import { PUBLIC_APP_ID, PUBLIC_AUTH_URL, PUBLIC_DOMAIN } from "$env/static/public";
import { redirect } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ cookies }) => {
	try {
		const refresh = cookies.get("refresh");

		await axios.post(
			`${PUBLIC_AUTH_URL}/api/auth/${PUBLIC_APP_ID}/logout`,
			{},
			{
				headers: {
					Cookie: `refresh=${refresh};`
				}
			}
		);

		cookies.delete("access");
		cookies.delete("refresh");

		cookies.delete("access", {
			domain: PUBLIC_DOMAIN,
			secure: true,
			httpOnly: true,
			sameSite: "lax",
			path: "/"
		});
		cookies.delete("refresh", {
			domain: PUBLIC_DOMAIN,
			secure: true,
			httpOnly: true,
			sameSite: "lax",
			path: "/"
		});
	} catch (err) {
		console.error(err);
	}

	throw redirect(302, "/");
};
