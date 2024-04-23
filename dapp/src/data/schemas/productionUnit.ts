import { z } from "zod";

export const registerProductionUnitFormInputs = z.object({
    gridSize: z.coerce.number(),
});

export const mintProducerEnergyTokensBody = z.object({
    amount: z.coerce.number(),
});

export type RegisterProductionUnitFormInputs = z.infer<typeof registerProductionUnitFormInputs>;