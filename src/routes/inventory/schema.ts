import { Currencies } from "$lib";
import { z } from "zod";

export const formSchema = z.object({
	market_hash_name: z.string().min(2).max(256),
	cost: z.number().min(0.01),
	amount: z.number().min(1),
	col_id: z.number().min(1),
	currency: z.nativeEnum(Currencies)
});

export type FormSchema = typeof formSchema;
