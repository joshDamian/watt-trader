import { Magic } from "@magic-sdk/admin";
import { env } from "~/env";

let instance: Magic | undefined = undefined;

export const getMagicAdmin = () => {
    const magicSecretKey = env.MAGIC_SECRET_KEY;

    if (!instance) {
        instance = new Magic(magicSecretKey);
    }

    return instance;
};