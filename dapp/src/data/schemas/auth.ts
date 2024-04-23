import { z } from "zod";

export const emailSchema = z.string().email();

export const signInInputs = z.object({
    email: emailSchema
});

export type SignInInputs = z.infer<typeof signInInputs>;
