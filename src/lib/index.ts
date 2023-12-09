import { PUBLIC_API_URL, PUBLIC_APP_ID, PUBLIC_AUTH_URL } from "$env/static/public";
import axios from "axios";
import Decimal from "decimal.js";

// place files you want to import through the `$lib` alias in this folder.
export type Inventory = {
	items: Item[];
	total_inventory_count: number;
};

export type Item = {
	market_hash_name: string;
	prices: any;
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

export enum Currencies {
	USD = "USD",
	EUR = "EUR",
	CNY = "CNY"
}

export enum Market {
	STEAM = "steam",
	BUFF163 = "buff163",
	SKINPORT = "skinport"
}

export type Rates = {
	EUR: number;
	CNY: number;
};

export const format_price = (price: number, currency: Currencies) => {
	const format = Intl.NumberFormat("de-DE", {
		style: "currency",
		currency
	});

	return format.format(price);
};

export const get_latest_price = (item_prices: any, sel_market: string) => {
	let latest_price = 0;
	let prices = item_prices[sel_market];

	switch (sel_market) {
		case "steam": {
			latest_price = prices.last_24h || prices.last_7d || prices.last_30d || prices.last_90d || 0;

			break;
		}
		case "buff163": {
			latest_price = prices.starting_at?.price || 0;

			break;
		}
		case "skinport": {
			latest_price = prices.starting_at || 0;

			break;
		}
	}

	return latest_price;
};

export const convert_price = (price: number, currency: Currencies, rates: Rates) => {
	switch (currency) {
		case "USD":
			return price;
		case "EUR":
			return new Decimal(price).mul(rates.EUR).toDecimalPlaces(2).toNumber();
		case "CNY":
			return new Decimal(price).mul(rates.CNY).toDecimalPlaces(2).toNumber();
	}

	return 0;
};
