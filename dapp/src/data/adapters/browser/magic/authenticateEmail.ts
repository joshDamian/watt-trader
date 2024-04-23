import { emailSchema } from "~/data/schemas/auth";
import { getMagicClient } from "./webClient";

export const authenticateEmail = async (email: string) => {
    const validEmail = emailSchema.parse(email);

    const magic = getMagicClient();

    const didToken = await magic.auth.loginWithEmailOTP({ email: validEmail });

    return didToken;
};