import { type Address, formatUnits, formatEther } from "viem";
import { getPublicClient, getWalletClient } from "./viem/clients";
import { balanceAbi } from "./abis/erc20";
import { logOut } from "~/data/adapters/browser/auth";

let account: Address | undefined;

const getAccount = async () => {
    if (account) return account;

    const walletClient = getWalletClient();

    const accounts = await walletClient.getAddresses();

    if (accounts.length === 0) {
        await logOut();

        window.location.reload();
    };

    account = accounts[0]!;

    return account;
}

const getNativeBalance = async (walletAddress?: Address) => {
    const address = walletAddress ?? (await getAccount());
    const publicClient = getPublicClient();

    const balance = await publicClient.getBalance({
        address,
    });

    return parseFloat(formatEther(balance));
};

const getTokenBalance = async ({ tokenAddress, walletAddress }: { tokenAddress: Address, walletAddress?: Address }) => {
    const address = walletAddress ?? (await getAccount());
    const publicClient = getPublicClient();

    const [balance, decimals] = await Promise.all([
        await publicClient.readContract({
            address: tokenAddress,
            abi: balanceAbi,
            functionName: "balanceOf",
            args: [address],
        }),
        await publicClient.readContract({
            address: tokenAddress,
            abi: balanceAbi,
            functionName: "decimals",
        }),
    ]);

    return parseFloat(formatUnits(balance, decimals));
};

export { getNativeBalance, getTokenBalance, getAccount };