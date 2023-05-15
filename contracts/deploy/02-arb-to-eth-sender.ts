import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

enum SenderChains {
  ARBITRUM_GOERLI = 421613,
}

// TODO: use deterministic deployments
const deploySender: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts, getChainId } = hre;
  const { deploy, execute } = deployments;
  const chainId = Number(await getChainId());

  // fallback to hardhat node signers on local network
  const deployer = (await getNamedAccounts()).deployer ?? (await hre.ethers.getSigners())[0].address;
  console.log("deployer: %s", deployer);

  // ----------------------------------------------------------------------------------------------
  const liveDeployer = async () => {
    const LightBulb = await hre.companionNetworks.receiver.deployments.get("LightBulb");
    const veaInbox = "0x906dE43dBef27639b1688Ac46532a16dc07Ce410";
    const lightBulbsSwitch = await deploy("Switch", {
      from: deployer,
      contract: "Switch",
      args: [veaInbox, LightBulb.address],
      log: true,
    });

    console.log("Switch deployed to: %s", lightBulbsSwitch.address);
  };

  // ----------------------------------------------------------------------------------------------
    await liveDeployer();
};

deploySender.tags = ["ArbToEthSender"];
deploySender.skip = async ({ getChainId }) => {
  const chainId = Number(await getChainId());
  console.log(chainId);
  return !SenderChains[chainId];
};
deploySender.runAtTheEnd = true;

export default deploySender;
