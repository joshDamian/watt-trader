import type { NextApiResponse, NextApiRequest } from "next";
import { validateAuthInApiHandler } from "~/data/adapters/server/platform/session";
import { mintProducerEnergyTokensBody } from "~/data/schemas/productionUnit";
import { energyTokenAbi } from "~/resources/web3/abis/wattEnergyToken";
import { getContractAddress } from "~/resources/web3/contracts";
import { getOracleWalletClient, getPublicClient } from "~/resources/web3/viem/clients";
import { parseEther } from "viem";
import { userRepository } from "~/data/adapters/server/xata/repositories";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await validateAuthInApiHandler(req, res);

        const body = mintProducerEnergyTokensBody.parse(req.body);

        const user = await userRepository().readOrThrow(session.user.id);

        if (!user.isEnergyProducer) {
            throw new Error('User is not an energy producer');
        }

        const publicClient = getPublicClient();
        const walletClient = getOracleWalletClient();

        const { request } = await publicClient.simulateContract({
            address: getContractAddress('WATT_ENERGY_TOKEN'),
            abi: energyTokenAbi,
            functionName: 'mint',
            account: walletClient.account,
            args: [session.user.walletAddress, parseEther(`${body.amount}`)]
        });

        const hash = await walletClient.writeContract(request);

        console.log('Minting energy token hash: ', hash);

        return res.status(200).json({ hash });
    } catch (error) {
        console.log('Error minting energy token', error);

        return res.status(500).json({ message: 'Error minting energy token' });
    }
}