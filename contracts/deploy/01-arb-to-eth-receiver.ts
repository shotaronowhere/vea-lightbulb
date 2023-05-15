import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import getContractAddress from "../deploy-helpers/getContractAddress";
import { ethers } from "hardhat";

enum ReceiverChains {
  ETHEREUM_GOERLI = 5,
  GNOSIS_CHIADO = 10200,
}


const deployReceiver: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { ethers, deployments, getNamedAccounts, getChainId, config } = hre;
  const { deploy } = deployments;
  const { providers } = ethers;

  // fallback to hardhat node signers on local network
  const deployer = (await getNamedAccounts()).deployer ?? (await hre.ethers.getSigners())[0].address;
  const chainId = Number(await getChainId());
  console.log("deploying to chainId %s with deployer %s", chainId, deployer);

  const senderNetworks = {
    ETHEREUM_GOERLI: config.networks.arbitrumGoerli,
    GNOSIS_CHIADO: config.networks.arbitrumGoerli,
    HARDHAT: config.networks.localhost,
  };

  // Hack to predict the deployment address on the sender chain.
  // TODO: use deterministic deployments

  // ----------------------------------------------------------------------------------------------
  const liveDeployer = async () => {
    console.log(config.networks);
    const senderChainProvider = new providers.JsonRpcProvider(senderNetworks[ReceiverChains[chainId]].url);
    let nonce = await senderChainProvider.getTransactionCount(deployer);
    const lightBulbsSwitch = getContractAddress(deployer, nonce);
    const outbox = "0x906dE43dBef27639b1688Ac46532a16dc07Ce410";
    console.log("LightBulbsSwitch address: %s", lightBulbsSwitch);
    const lightbulb = await deploy("LightBulb", {
      from: deployer,
      args: [outbox, lightBulbsSwitch],
      log: true,
      gasPrice: ethers.utils.parseUnits("1", "gwei"),
    });

    console.log("LightBulb deployed to: %s", lightbulb.address);
  };

  // ----------------------------------------------------------------------------------------------
    await liveDeployer();
};

deployReceiver.tags = ["ArbToEthReceiver"];
deployReceiver.skip = async ({ getChainId }) => {
  const chainId = Number(await getChainId());
  console.log(chainId);
  return !ReceiverChains[chainId];
};

export default deployReceiver;
