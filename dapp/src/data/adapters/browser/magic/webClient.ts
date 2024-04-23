import { Magic } from "magic-sdk";
import { env } from "~/env";
import { MisuseError } from "~/resources/errors/misuse";
import { getNetworkConfig } from "~/resources/web3/network";

let instance: Magic | undefined = undefined;

export const getMagicClient = () => {
    const magicPubKey = env.NEXT_PUBLIC_MAGIC_PUBLIC_KEY;

    if (typeof window === "undefined") {
        throw new MisuseError(
            "Magic web client should be used in non-SSR environments"
        );
    }

    if (!instance) {
        const networkConfig = getNetworkConfig();

        instance = new Magic(magicPubKey, {
            network: networkConfig
        });
    }

    return instance;
};