import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "@nomiclabs/hardhat-etherscan";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./src",
  },
  networks: {
    // Sender chain ---------------------------------------------------------------------------------
    arbitrumGoerli: {
      chainId: 421613,
      url: "https://goerli-rollup.arbitrum.io/rpc",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      live: true,
      saveDeployments: true,
      tags: ["staging", "sender", "layer2"],
      companionNetworks: {
        receiver: "chiado",
      },
      verify: {
        etherscan: {
          apiKey: process.env.ARBISCAN_API_KEY,
        },
      },
    },
    chiado: {
      chainId: 10200,
      url: "https://rpc.chiadochain.net",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      live: true,
      saveDeployments: true,
      tags: ["staging", "outbox", "layer1"],
      companionNetworks: {
        arbitrumGoerli: "arbitrumGoerli",
      },
      verify: {
        etherscan: {
          apiUrl: "https://blockscout.com/gnosis/chiado",
        },
      },
    },
    // Receiver chain ---------------------------------------------------------------------------------
    goerli: {
      chainId: 5,
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      live: true,
      saveDeployments: true,
      tags: ["staging", "receiver", "layer1"],
      companionNetworks: {
        sender: "arbitrumGoerli",
      },
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    relayer: {
      default: 1,
    },
    bridger: {
      default: 2,
    },
    challenger: {
      default: 3,
    },
  },
  verify: {
    etherscan: {
      apiKey: process.env.ETHERSCAN_API_KEY_FIX,
    },
  }
};

export default config;
