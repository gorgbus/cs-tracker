import { message, superValidate } from "sveltekit-superforms/server";
import type { Actions, PageServerLoad } from "./$types";
import { collFormSchema, invFormSchema } from "./schema";
import { fail } from "@sveltejs/kit";
import axios from "axios";
import { PUBLIC_API_URL } from "$env/static/public";

export const load: PageServerLoad = () => {
	return {
		inv_form: superValidate(
			{
				cost: 0.01,
				amount: 1
			},
			invFormSchema
		),
		coll_form: superValidate(collFormSchema)
	};
};

export const actions: Actions = {
	inv_create: async (event) => {
		const form = await superValidate(event, invFormSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const access = event.cookies.get("access");
			const col_id = event.url.searchParams.get("col_id");

			await axios.post(
				`${PUBLIC_API_URL}/api/investment/create`,
				{
					...form.data,
					col_id: Number(col_id)
				},
				{
					headers: {
						Cookie: `access=${access};`
					}
				}
			);
		} catch (e) {
			console.error(e);

			return fail(500, {
				form
			});
		}

		// throw redirect(303, "/investments");
		return message(form, "success");
	},
	coll_create: async (event) => {
		const form = await superValidate(event, collFormSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const access = event.cookies.get("access");

			await axios.post(`${PUBLIC_API_URL}/api/investment/collection/create`, form.data, {
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

		// throw redirect(303, "/investments");
		return message(form, "success");
	}
};
