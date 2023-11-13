import type { PageServerLoad, Actions } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./schema";
import { fail, redirect } from "@sveltejs/kit";
import axios from "axios";

export const load: PageServerLoad = ({ url }) => {
	const item = url.searchParams.get("item");
	const added = url.searchParams.get("success");

	return {
		form: superValidate(
			{
				market_hash_name: item || "",
				cost: 0.01,
				amount: 1
			},
			formSchema
		),
		open: item !== null && item !== undefined,
		added: added !== null && added !== undefined
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, formSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const access = event.cookies.get("access");

			await axios.post(`http://127.0.0.1:4269/api/investment/create`, form.data, {
				headers: {
					Cookie: `access=${access};`
				}
			});
		} catch (e) {
			console.error(e);

			return fail(500, {
				form
			});
		}

		throw redirect(303, "/inventory?success");
	}
};
