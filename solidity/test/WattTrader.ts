import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseEther } from "viem";

describe("WattTrader", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployWattTraderFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount, oracleAccount] = await hre.viem.getWalletClients();

        const wattEnergyToken = await hre.viem.deployContract("WattEnergyToken", ["WattToken", "WTT"]);


        const wattTrader = await hre.viem.deployContract("WattTrader", [wattEnergyToken.address, oracleAccount.account.address]);

        await wattEnergyToken.write.setBurnControl([wattTrader.address]);

        const publicClient = await hre.viem.getPublicClient();

        return {
            wattTrader,
            wattEnergyToken,
            oracleAccount,
            owner,
            otherAccount,
            publicClient,
        };
    }

    describe("Deployment", function () {
        it("Should set the right watt energy token", async function () {
            const { wattTrader, wattEnergyToken } = await loadFixture(deployWattTraderFixture);

            expect((await wattTrader.read.energyToken()).toLowerCase()).to.equal(wattEnergyToken.address.toLowerCase());
        });
    });

    describe("Energy Purchase", function () {
        const energyAmount = parseEther('2000');

        it("Should mint energy tokens to specified wallet", async function () {
            const { wattEnergyToken, otherAccount } = await loadFixture(deployWattTraderFixture);

            await wattEnergyToken.write.mint([otherAccount.account.address, energyAmount]);

            const wattEnergyTokenBalance = await wattEnergyToken.read.balanceOf([otherAccount.account.address]);

            expect(wattEnergyTokenBalance).to.equal(energyAmount);
        });

        it("Can list energy for sale", async function () {
            const { wattTrader, wattEnergyToken, otherAccount } = await loadFixture(deployWattTraderFixture);

            await wattEnergyToken.write.mint([otherAccount.account.address, energyAmount]);

            await wattEnergyToken.write.approve([wattTrader.address, energyAmount], {
                account: otherAccount.account,
            });

            await wattTrader.write.listEnergy([parseEther('1000'), parseEther('2')], {
                account: otherAccount.account,
            });

            const energyListings = await wattTrader.read.getEnergyListings();

            expect(energyListings).to.not.empty;
        })
    });
});