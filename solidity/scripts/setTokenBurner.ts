import hre from "hardhat";

async function main() {
    const [mainWalletClient] =
        await hre.viem.getWalletClients();

    const publicClient = await hre.viem.getPublicClient();

    const ABI = (await hre.artifacts.readArtifact('WattEnergyToken')).abi;

    console.log({ address: mainWalletClient.account.address });

    const { request } = await publicClient.simulateContract({
        address: '0xe63ab7eD5caFaf72AA4214c6fB89A1D26a2761aE',
        abi: ABI,
        functionName: 'setBurnControl',
        args: ['0x420b7ffD558257976ee0AfA447F22272CAc67248']
    });

    const hash = await mainWalletClient.writeContract(request);

    await publicClient.waitForTransactionReceipt({ hash });

    console.log({ hash });
}

main()
    .then(() => process.exit())
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });