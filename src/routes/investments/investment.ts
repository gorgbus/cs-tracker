import { axios_client } from "$lib";

export type InvestmentType = {
	inv_id: number;
	steam_id: string;
	item: string;
	icon_url: string;
	collection: number;
	col_name: string;
	cost: number;
	amount: number;
	currency: "USD" | "EUR" | "CNY";
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

export const fetch_prices = async (market_hash_name: string) => {
	const { data } = await axios_client.get<Prices>(
		`/api/prices?market_hash_name=${market_hash_name}`
	);

	return data;
};

export const fetch_collections = async () => {
	const { data } = await axios_client.get<{ collections: Collection[] }>(
		"/api/investment/collection/all"
	);

	return data;
};
