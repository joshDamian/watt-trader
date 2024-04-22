import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ENERGY_TOKEN_ADDRESS = "0xe63ab7eD5caFaf72AA4214c6fB89A1D26a2761aE";
const METERING_ORACLE_ADDRESS = "0xd73594Ddc43B368719a0003BcC1a520c17a16DeB";

const WattTraderModule = buildModule("WattTraderModule", (m) => {
    const lock = m.contract("WattTrader", [ENERGY_TOKEN_ADDRESS, METERING_ORACLE_ADDRESS]);

    return { lock };
});

export default WattTraderModule;
