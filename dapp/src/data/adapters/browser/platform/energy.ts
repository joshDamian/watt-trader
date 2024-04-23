import { type Address, formatEther, parseEther } from "viem";
import { energyTokenAbi } from "~/resources/web3/abis/wattEnergyToken";
import { wattTraderAbi } from "~/resources/web3/abis/wattTrader";
import { getAccount, getTokenBalance } from "~/resources/web3/account";
import { getContractAddress } from "~/resources/web3/contracts";
import { getPublicClient, getWalletClient } from "~/resources/web3/viem/clients";

export const getEnergyBalance = async (userWallet: Address) => {
    const energyTokenAddress = getContractAddress('WATT_ENERGY_TOKEN');

    const energyBalance = await getTokenBalance({
        tokenAddress: energyTokenAddress,
        walletAddress: userWallet
    });

    return energyBalance;
}

export const getEnergyOverview = async (userWallet: Address) => {
    const wattTraderAddress = getContractAddress('WATT_TRADER');

    const publicClient = getPublicClient();

    const overview = await publicClient.readContract({
        address: wattTraderAddress,
        abi: wattTraderAbi,
        functionName: 'getEnergyOverview',
        args: [userWallet]
    });

    return {
        energyBalance: formatEther(overview.energyBalance),
        energyConsumed: formatEther(overview.energyConsumed),
        energyProduced: formatEther(overview.energyProduced),
        energyPurchased: formatEther(overview.energyPurchased),
    } as const;
}

const SIMULATED_LOAD = 10000; // 10000 watts
const AN_HOUR = 60 * 60; // 1 hour in seconds

export const test_reportEnergyConsumption = async (energyBalance: number) => {
    if (typeof window === 'undefined') {
        return;
    }

    const lastReportTime = Number(window.localStorage.getItem('lastEnergyReport') ?? 0);

    const timeDifferenceInSeconds = lastReportTime > 0 ? (Date.now() - lastReportTime) / 1000 : 2 // 2 seconds;

    // Calculate energy usage in kWh based on load
    const usageInKWh = (SIMULATED_LOAD * (timeDifferenceInSeconds / AN_HOUR)) / 1000; // Convert watt-hours to kilowatt-hours

    // Check if the energy balance is sufficient to report
    if (energyBalance >= usageInKWh) {
        // Send a report with the calculated energy usage
        window.localStorage.setItem('lastEnergyReport', `${Date.now()}`);

        const response = await fetch('/api/test/reportConsumption', {
            method: "POST",
            body: JSON.stringify({
                amount: usageInKWh
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Failed to report energy consumption");
        }
    }
}

export const test_mintEnergyTokens = async (amount: number) => {
    const response = await fetch('/api/test/mintProducerEnergyTokens', {
        method: "POST",
        body: JSON.stringify({
            amount
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error("Failed to mint energy tokens");
    }
}

export const test_registerEnergyProductionUnit = async (gridSize: number) => {
    const response = await fetch('/api/test/registerProductionUnit', {
        method: "POST",
        body: JSON.stringify({
            gridSize
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error("Failed to register production unit");
    }
}

export const getEnergyListings = async () => {
    const wattTraderAddress = getContractAddress('WATT_TRADER');

    const publicClient = getPublicClient();

    const listings = await publicClient.readContract({
        address: wattTraderAddress,
        abi: wattTraderAbi,
        functionName: 'getEnergyListings',
    });

    return listings.map((listing) => ({
        ...listing,
        amount: Number(formatEther(listing.amount)),
        price: Number(formatEther(listing.price)),
        listingId: Number(listing.listingId.toString())
    })).reverse();
}

const approveEnergyTokenAmount = async (amount: number) => {
    const publicClient = getPublicClient();
    const walletClient = getWalletClient();

    const account = await getAccount();

    const { request } = await publicClient.simulateContract({
        account,
        address: getContractAddress('WATT_ENERGY_TOKEN'),
        abi: energyTokenAbi,
        functionName: 'approve',
        args: [getContractAddress('WATT_TRADER'), parseEther(`${amount}`)]
    });

    const hash = await walletClient.writeContract(request);

    const transaction = await publicClient.waitForTransactionReceipt(
        { hash }
    );

    if (transaction.status === 'reverted') throw new Error('Transaction reverted');
}

export const listEnergy = async (params: { amount: number, price: number }) => {
    const { amount, price } = params;

    const publicClient = getPublicClient();
    const walletClient = getWalletClient();

    const account = await getAccount();

    await approveEnergyTokenAmount(amount);

    const { request } = await publicClient.simulateContract({
        account,
        address: getContractAddress('WATT_TRADER'),
        abi: wattTraderAbi,
        functionName: 'listEnergy',
        args: [parseEther(`${amount}`), parseEther(`${price}`)]
    });

    const hash = await walletClient.writeContract(request);

    const transaction = await publicClient.waitForTransactionReceipt(
        { hash }
    );

    if (transaction.status === 'reverted') throw new Error('Transaction reverted');
}

export const purchaseEnergy = async (params: { listingId: number, price: number }) => {
    const { listingId, price } = params;

    const publicClient = getPublicClient();
    const walletClient = getWalletClient();

    const account = await getAccount();

    const { request } = await publicClient.simulateContract({
        account,
        address: getContractAddress('WATT_TRADER'),
        abi: wattTraderAbi,
        functionName: 'purchaseEnergy',
        args: [BigInt(listingId)],
        value: parseEther(`${price}`)
    });

    const hash = await walletClient.writeContract(request);

    const transaction = await publicClient.waitForTransactionReceipt(
        { hash }
    );

    if (transaction.status === 'reverted') throw new Error('Transaction reverted');
}

