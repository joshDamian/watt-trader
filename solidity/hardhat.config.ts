import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const ETHERLINK_PRIVATE_KEY = vars.get('ETHERLINK_PRIVATE_KEY');

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    etherlinkTestnet: {
      url: `https://node.ghostnet.etherlink.com`,
      accounts: [ETHERLINK_PRIVATE_KEY],
    },
  }
};

export default config;
