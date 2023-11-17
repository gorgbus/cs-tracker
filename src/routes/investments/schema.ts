import { z } from "zod";
import { Currencies } from "./investment";

export const invFormSchema = z.object({
	col_id: z.number().min(1),
	market_hash_name: z.string().min(2).max(256),
	cost: z.number().min(0.01),
	amount: z.number().min(1),
	currency: z.nativeEnum(Currencies)
});

export type InvFormSchema = typeof invFormSchema;

export const invEditFormSchema = z.object({
	inv_id: z.number().min(1),
	col_id: z.number().min(1),
	cost: z.number().min(0.01),
	amount: z.number().min(1),
	currency: z.nativeEnum(Currencies)
});

export type InvEditFormSchema = typeof invEditFormSchema;

export const collFormSchema = z.object({
	name: z.string().min(2).max(256)
});

export type CollFormSchema = typeof collFormSchema;

export const collEditFormSchema = z.object({
	col_id: z.number().min(1),
	name: z.string().min(2).max(256)
});

export type CollEditFormSchema = typeof collEditFormSchema;
