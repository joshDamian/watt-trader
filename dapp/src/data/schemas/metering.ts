import { z } from "zod";

export const reportConsumptionSchema = z.object({
    amount: z.number().positive()
});