import type { NextApiResponse, NextApiRequest } from "next";
import { validateAuthInApiHandler } from "~/data/adapters/server/platform/session";
import { reportConsumptionSchema } from "~/data/schemas/metering";
import { wattTraderAbi } from "~/resources/web3/abis/wattTrader";
import { getContractAddress } from "~/resources/web3/contracts";
import { getOracleWalletClient, getPublicClient } from "~/resources/web3/viem/clients";
import { parseEther } from "viem";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await validateAuthInApiHandler(req, res);

        const body = reportConsumptionSchema.parse(req.body);

        const publicClient = getPublicClient();
        const walletClient = getOracleWalletClient();

        const { request } = await publicClient.simulateContract({
            address: getContractAddress('WATT_TRADER'),
            abi: wattTraderAbi,
            functionName: 'reportEnergyConsumption',
            account: walletClient.account,
            args: [session.user.walletAddress, parseEther(`${body.amount}`)]
        });

        const hash = await walletClient.writeContract(request);

        console.log('Reporting consumption hash: ', hash);

        return res.status(200).json({ hash });
    } catch (error) {
        console.log('Error reporting consumption', error);

        return res.status(500).json({ message: 'Error reporting energy consumption' });
    }
}