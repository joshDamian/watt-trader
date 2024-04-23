import { getMagicClient } from "~/data/adapters/browser/magic/webClient";
import { type PublicClient, type WalletClient, createPublicClient, createWalletClient, custom, http } from "viem";
import { etherlinkTestnet } from "viem/chains";
import { privateKeyToAccount } from 'viem/accounts';
import { getNetworkConfig } from "../network";
import { env } from "~/env";

let publicClientInstance: PublicClient | undefined;
let walletClientInstance: WalletClient | undefined;

const getPublicClient = () => {
    if (publicClientInstance) return publicClientInstance;

    publicClientInstance = createPublicClient({
        chain: etherlinkTestnet,
        transport: http(getNetworkConfig().rpcUrl),
    });
    return publicClientInstance;
}

const getWalletClient = () => {
    if (walletClientInstance) return walletClientInstance;
    const magic = getMagicClient();

    walletClientInstance = createWalletClient({
        chain: etherlinkTestnet,
        transport: custom(magic.rpcProvider),
    });
    return walletClientInstance;
}


let oracleWalletClientInstance: WalletClient | undefined;
const getOracleWalletClient = () => {
    if (oracleWalletClientInstance) return oracleWalletClientInstance;

    const account = privateKeyToAccount(env.ORACLE_ACCOUNT)

    oracleWalletClientInstance = createWalletClient({
        account,
        chain: etherlinkTestnet,
        transport: http(getNetworkConfig().rpcUrl),
    });

    return oracleWalletClientInstance;
}

export { getPublicClient, getWalletClient, getOracleWalletClient }