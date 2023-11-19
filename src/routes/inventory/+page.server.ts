import type { PageServerLoad, Actions } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./schema";
import { fail, redirect } from "@sveltejs/kit";
import axios from "axios";
import { PUBLIC_API_URL } from "$env/static/public";

export const load: PageServerLoad = () => {
	return {
		form: superValidate(formSchema)
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

		throw redirect(303, "/inventory");
	}
};
