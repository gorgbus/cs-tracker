import { PUBLIC_API_URL, PUBLIC_APP_ID, PUBLIC_AUTH_URL } from "$env/static/public";
import axios from "axios";
import Decimal from "decimal.js";
import type { Prices } from "../routes/investments/investment";

// place files you want to import through the `$lib` alias in this folder.
export type Inventory = {
	items: Item[];
	total_inventory_count: number;
};

export type Item = {
	market_hash_name: string;
	prices: Prices;
	count: number;
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
					`${PUBLIC_AUTH_URL}/api/auth/${PUBLIC_APP_ID}/token/refresh`,
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
	CNY = "CNY",
	TRY = "TRY",
	PLN = "PLN",
	GBP = "GBP",
	UAH = "UAH",
	KRW = "KRW",
	BRL = "BRL"
}

export enum Market {
	STEAM = "steam",
	BUFF163 = "buff163",
	SKINPORT = "skinport"
}

export type Rates = {
	USD: number;
	EUR: number;
	CNY: number;
	TRY: number;
	PLN: number;
	GBP: number;
	UAH: number;
	KRW: number;
	BRL: number;
};

export const get_currency_symbol = (currency: Currencies) => {
	switch (currency) {
		case Currencies.USD:
			return "$ USD";
		case Currencies.EUR:
			return "€ EUR";
		case Currencies.CNY:
			return "¥ CNY";
		case Currencies.TRY:
			return "₺ TRY";
		case Currencies.PLN:
			return "zł PLN";
		case Currencies.GBP:
			return "£ GBP";
		case Currencies.UAH:
			return "₴ UAH";
		case Currencies.KRW:
			return "₩ KRW";
		case Currencies.BRL:
			return "R$ BRL";
	}
};

export const currencies_list = [
	{ label: get_currency_symbol(Currencies.USD), value: "USD" },
	{ label: get_currency_symbol(Currencies.EUR), value: "EUR" },
	{ label: get_currency_symbol(Currencies.TRY), value: "TRY" },
	{ label: get_currency_symbol(Currencies.PLN), value: "PLN" },
	{ label: get_currency_symbol(Currencies.GBP), value: "GBP" },
	{ label: get_currency_symbol(Currencies.UAH), value: "UAH" },
	{ label: get_currency_symbol(Currencies.CNY), value: "CNY" },
	{ label: get_currency_symbol(Currencies.KRW), value: "KRW" },
	{ label: get_currency_symbol(Currencies.BRL), value: "BRL" }
];

export const format_price = (price: number, currency: Currencies) => {
	const format = Intl.NumberFormat(navigator.language, {
		style: "currency",
		currency
	});

	return format.format(price);
};

export const get_latest_price = (item_prices: any, sel_market: string) => {
	let latest_price = 0;
	let prices = item_prices[sel_market];

	if (prices) {
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
	}

	return latest_price;
};

export const convert_price = (price: number, currency: Currencies, rates: Rates) => {
	switch (currency) {
		case "USD":
			return price;
		default:
			return new Decimal(price).mul(rates[currency]).toDecimalPlaces(2).toNumber();
	}
};
