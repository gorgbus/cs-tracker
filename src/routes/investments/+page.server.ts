import { message, superValidate } from "sveltekit-superforms/server";
import type { Actions, PageServerLoad } from "./$types";
import { collEditFormSchema, collFormSchema, invEditFormSchema, invFormSchema } from "./schema";
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
		inv_edit_form: superValidate(invEditFormSchema),
		coll_form: superValidate(collFormSchema),
		coll_edit_form: superValidate(collEditFormSchema)
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
	},
	inv_edit: async (event) => {
		const form = await superValidate(event, invEditFormSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const access = event.cookies.get("access");

			await axios.post(`${PUBLIC_API_URL}/api/investment/${form.data.inv_id}`, form.data, {
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

		return message(form, {
			type: "success",
			text: "success"
		});
	},
	coll_rename: async (event) => {
		const form = await superValidate(event, collEditFormSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const access = event.cookies.get("access");

			await axios.post(
				`${PUBLIC_API_URL}/api/investment/collection/${form.data.col_id}`,
				form.data,
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

		return message(form, {
			type: "success",
			text: "success"
		});
	}
};
