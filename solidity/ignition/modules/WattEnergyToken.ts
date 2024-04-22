import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TOKEN_NAME = "WattEnergyToken";
const TOKEN_SYMBOL = "WTT";

const WattEnergyTokenModule = buildModule("WattEnergyTokenModule", (m) => {
    const lock = m.contract("WattEnergyToken", [TOKEN_NAME, TOKEN_SYMBOL]);

    return { lock };
});

export default WattEnergyTokenModule;
