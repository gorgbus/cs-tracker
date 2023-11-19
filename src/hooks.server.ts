import type { Handle } from "@sveltejs/kit";
import jwt from "jsonwebtoken";
import axios from "axios";
import set_cookie_parser from "set-cookie-parser";
import { JWT_DECODE_KEY } from "$env/static/private";
import { PUBLIC_APP_ID, PUBLIC_AUTH_URL } from "$env/static/public";

type Jwt = {
	user: {
		user_id: number;
		steam: {
			id: string;
			avatar: string;
			username: string;
		};
	};
	app_id: string;
};

export const handle: Handle = async ({ event, resolve }) => {
	const access_token = event.cookies.get("access");
	const refresh_token = event.cookies.get("refresh");

	if (access_token) {
		const access = jwt.verify(access_token, JWT_DECODE_KEY) as Jwt;

		event.locals.user = access.user;
	} else if (refresh_token) {
		try {
			const { headers } = await axios.post(
				`${PUBLIC_AUTH_URL}/auth/${PUBLIC_APP_ID}/token/refresh`,
				{},
				{
					headers: {
						Cookie: `refresh=${refresh_token};`
					}
				}
			);

			for (const str of set_cookie_parser.splitCookiesString(headers["set-cookie"])) {
				const { name, value, ...options } = set_cookie_parser.parseString(str);

				event.cookies.set(name, value, {
					...options,
					sameSite: options.sameSite as "lax" | "none" | "strict"
				});

				if (name === "access") {
					const access = jwt.verify(value, JWT_DECODE_KEY) as Jwt;

					event.locals.user = access.user;
				}
			}
		} catch (e) {
			console.error("failed to get jwt", e);
		}
	} else {
		event.locals.user = undefined;

		if (event.url.pathname === "/investments" || event.url.pathname === "/inventory")
			return new Response(null, {
				status: 303,
				headers: {
					location: "/"
				}
			});
	}

	return await resolve(event);
};
