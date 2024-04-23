import type { Address } from "viem";

type NetworkConfig = {
    rpcUrl: `https://${string}`;
    chainId: number;
    explorerUrl: `https://${string}`;
};

const networkConfig: NetworkConfig = {
    rpcUrl: "https://node.ghostnet.etherlink.com",
    chainId: 128123,
    explorerUrl: "https://testnet-explorer.etherlink.com",
};

const getNetworkConfig = () => {
    return networkConfig;
};

const getTransactionExplorerUrl = (txHash: string): `https://${string}` => {
    const explorerUrl = networkConfig.explorerUrl;

    return `${explorerUrl}/tx/${txHash}`;
};

const getAddressExplorerUrl = (address: Address): `https://${string}` => {
    const explorerUrl = networkConfig.explorerUrl;

    return `${explorerUrl}/address/${address}`;
};


export { getNetworkConfig, getTransactionExplorerUrl, getAddressExplorerUrl };