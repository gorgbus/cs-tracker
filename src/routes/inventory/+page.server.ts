import type { PageServerLoad, Actions } from "./$types";
import { message, superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./schema";
import { fail } from "@sveltejs/kit";
import axios from "axios";
import { PUBLIC_API_URL } from "$env/static/public";

export const load: PageServerLoad = ({ locals }) => {
	return {
		form: superValidate(formSchema),
		user: locals.user
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

			await axios.post(`${PUBLIC_API_URL}/api/investment/create`, form.data, {
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

		return message(form, {
			type: "success",
			text: "success"
		});
	}
};
