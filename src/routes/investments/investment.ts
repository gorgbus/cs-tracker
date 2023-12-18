import { Currencies, axios_client, convert_price, type Rates, get_latest_price } from "$lib";
import Decimal from "decimal.js";
import type { Writable } from "svelte/store";

export type InvestmentType = {
	inv_id: number;
	steam_id: string;
	item: string;
	collection: number;
	col_name: string;
	cost: number;
	amount: number;
	currency: Currencies;
};

export type Collection = {
	col_id: number;
	name: string;
};

export type Prices = {
	steam?: {
		last_24h?: number;
		last_7d?: number;
		last_30d?: number;
		last_90d?: number;
	};
	skinport?: {
		suggested_price?: number;
		starting_at?: number;
	};
	buff163?: {
		starting_at?: {
			price?: number;
		};
		highest_order?: {
			price?: number;
		};
	};
};

export const fetch_collections = async () => {
	const { data } = await axios_client.get<{ collections: Collection[] }>(
		"/api/investment/collection/all"
	);

	return data;
};

const update_items = (
	items: Writable<{ [key: number]: any }>,
	prop: string,
	inv_id: number,
	value: number
) => {
	items.update((obj) => {
		const prev = obj[inv_id] || {};

		obj[inv_id] = { ...prev, [prop]: value };

		return obj;
	});
};

const calc_total_cost = (amount: number, cost: number) => {
	const dec_amount = new Decimal(amount);

	return dec_amount.mul(cost).toDecimalPlaces(2).toNumber();
};

const calc_curr_worth = (amount: number, latest_price: number) => {
	const dec_amount = new Decimal(amount);

	return dec_amount.mul(latest_price).toDecimalPlaces(2);
};

const calc_gain = (amount: number, latest_price: number, cost: number) => {
	const current_worth = calc_curr_worth(amount, latest_price);
	const total_cost = calc_total_cost(amount, cost);

	return current_worth.minus(total_cost).toNumber();
};

export const calc_perc_gain = (
	amount: number,
	latest_price: number,
	cost: number,
	item_currency: Currencies,
	rates: Rates
) => {
	const current_worth = calc_curr_worth(amount, convert_price(latest_price, item_currency, rates));
	const total_cost = calc_total_cost(amount, cost);

	return current_worth.minus(total_cost).div(total_cost).mul(100).round().toNumber();
};

export const convert_to_usd = (price: number, currency: Currencies, rates: Rates) => {
	switch (currency) {
		case "USD":
			return price;
		default:
			return new Decimal(price).div(rates[currency]).toDecimalPlaces(2).toNumber();
	}
};

export const update_wrapper = (
	items: Writable<{ [key: number]: any }>,
	update: string,
	item: InvestmentType,
	currency: Currencies,
	rates: Rates,
	latest_price = 0
) => {
	switch (update) {
		case "total_cost": {
			const converted_cost = convert_to_usd(item.cost, item.currency, rates);

			update_items(
				items,
				update,
				item.inv_id,
				calc_total_cost(item.amount, convert_price(converted_cost, currency, rates))
			);

			return calc_total_cost(item.amount, item.cost);
		}
		case "current_worth": {
			const converted_latest_price = convert_price(latest_price, currency, rates);

			update_items(
				items,
				update,
				item.inv_id,
				calc_curr_worth(item.amount, converted_latest_price).toNumber()
			);

			return calc_curr_worth(
				item.amount,
				convert_price(latest_price, item.currency, rates)
			).toNumber();
		}
		case "profit": {
			const converted_latest_price = convert_price(latest_price, currency, rates);
			const converted_cost = convert_to_usd(item.cost, item.currency, rates);

			update_items(
				items,
				update,
				item.inv_id,
				calc_gain(
					item.amount,
					converted_latest_price,
					convert_price(converted_cost, currency, rates)
				)
			);

			return calc_gain(item.amount, convert_price(latest_price, item.currency, rates), item.cost);
		}
	}

	return 0;
};

export const compare_fn = (column: string, left: any, right: any, rates: Rates, market: string) => {
	const left_cost = convert_to_usd(left.investment.cost, left.investment.currency, rates);
	const right_cost = convert_to_usd(right.investment.cost, right.investment.currency, rates);

	const left_latest = get_latest_price(left.prices, market);
	const right_latest = get_latest_price(right.prices, market);

	switch (column) {
		case "total_cost": {
			const left_total = calc_total_cost(left.investment.amount, left_cost);
			const right_total = calc_total_cost(right.investment.amount, right_cost);

			if (left_total < right_total) return -1;
			else if (left_total === right_total) return 0;

			return 1;
		}
		case "total_worth": {
			const left_total = calc_curr_worth(left.investment.amount, left_latest).toNumber();
			const right_total = calc_curr_worth(right.investment.amount, right_latest).toNumber();

			if (left_total < right_total) return -1;
			else if (left_total === right_total) return 0;

			return 1;
		}
		case "profit": {
			const left_profit = calc_gain(left.investment.amount, left_latest, left_cost);
			const right_profit = calc_gain(right.investment.amount, right_latest, right_cost);

			if (left_profit < right_profit) return -1;
			else if (left_profit === right_profit) return 0;

			return 1;
		}

		case "profit_perc": {
			const left_profit = calc_perc_gain(
				left.investment.amount,
				left_latest,
				left.investment.cost,
				left.investment.currency,
				rates
			);

			const right_profit = calc_perc_gain(
				right.investment.amount,
				right_latest,
				right.investment.cost,
				right.investment.currency,
				rates
			);

			if (left_profit < right_profit) return -1;
			else if (left_profit === right_profit) return 0;

			return 1;
		}
	}
};
