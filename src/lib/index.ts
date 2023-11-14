import { PUBLIC_API_URL, PUBLIC_APP_ID, PUBLIC_AUTH_URL } from "$env/static/public";
import axios from "axios";

// place files you want to import through the `$lib` alias in this folder.
export type Inventory = {
	items: Item[];
	total_inventory_count: number;
};

export type Item = {
	contextid: string;
	assetid: string;
	classid: string;
	instanceid: string;
	amount: string;
	icon_url: string;
	name: string;
	market_hash_name: string;
	type: string;
	name_color: string;
};

export const axios_client = axios.create({
	baseURL: PUBLIC_API_URL,
	withCredentials: true
});

axios_client.interceptors.response.use(
	(response) => response,
	async (error) => {
		const config = error?.config;

		try {
			if ((error?.response?.status === 403 || error?.response?.status === 401) && !config?._retry) {
				config._retry = true;

				await axios.post(
					`${PUBLIC_AUTH_URL}/auth/${PUBLIC_APP_ID}/token/refresh`,
					{},
					{
						withCredentials: true
					}
				);

				return axios_client(config);
			}
		} catch (err) {
			// console.error(err);
		}

		return Promise.reject(error);
	}
);

export const format_price = (price: number, currency: "USD" | "EUR" | "CNY") => {
	const format = Intl.NumberFormat("de-DE", {
		style: "currency",
		currency
	});

	return format.format(price);
};
