import { z } from "zod";

export const formSchema = z.object({
	market_hash_name: z.string().min(2).max(256),
	cost: z.number().min(0.01),
	amount: z.number().min(1),
	col_id: z.number().min(1),
	currency: z.enum(["USD", "EUR", "CNY"])
});

export type FormSchema = typeof formSchema;
