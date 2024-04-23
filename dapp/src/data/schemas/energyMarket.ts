import { z } from "zod";

export const listEnergyInputs = (energyBalance: number) => z.object({
    amount: z.coerce.number().positive().max(energyBalance),
    price: z.coerce.number().positive(),
});

export type ListEnergyInputs = z.infer<ReturnType<typeof listEnergyInputs>>;