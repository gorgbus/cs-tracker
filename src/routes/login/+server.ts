import type { RequestHandler } from "./$types";
import axios from "axios";
import { PUBLIC_API_URL, PUBLIC_APP_ID, PUBLIC_AUTH_URL } from "$env/static/public";
import { redirect } from "@sveltejs/kit";
import set_cookie_parser from "set-cookie-parser";

export const GET: RequestHandler = async ({ url, cookies }) => {
	try {
		const { headers } = await axios.post(
			`${PUBLIC_AUTH_URL}/auth/${PUBLIC_APP_ID}/token`,
			{
				code: url.searchParams.get("code")
			},
			{
				withCredentials: true
			}
		);

		for (const str of set_cookie_parser.splitCookiesString(headers["set-cookie"])) {
			const { name, value, ...options } = set_cookie_parser.parseString(str);

			cookies.set(name, value, {
				...options,
				sameSite: options.sameSite as "lax" | "none" | "strict"
			});
		}

		const access = cookies.get("access");

		await axios.get(`${PUBLIC_API_URL}/api/user`, {
			headers: {
				Cookie: `access=${access};`
			}
		});

		throw redirect(302, "/investments");
	} catch (e) {
		console.error("failed to get jwt", e);
	}

	throw redirect(302, "/");
};
