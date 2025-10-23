import * as dotenv from "dotenv";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

dotenv.config();

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, log } = hre.deployments;

  if (hre.network.name === "hardhat" || hre.network.name === "localhost") {
    if (hre.fhevm) {
      await hre.fhevm.initializeCLIApi();
    }
  }

  log(`Deployer address: ${deployer}`);

  const confidentialGameCoin = await deploy("ConfidentialGameCoin", {
    from: deployer,
    log: true,
  });

  const gameItemNFT = await deploy("GameItemNFT", {
    from: deployer,
    log: true,
    args: ["https://zama.quest/items/"],
  });

  const isSepolia = hre.network.name === "sepolia";
  const sepoliaOracle = "0xa02Cda4Ca3a71D7C46997716F4283aa851C28812";
  const oracleAddress = isSepolia ? sepoliaOracle : hre.ethers.ZeroAddress;
  const enforceOracle = isSepolia;

  const zamaQuest = await deploy("ZamaQuest", {
    from: deployer,
    log: true,
    args: [
      confidentialGameCoin.address,
      gameItemNFT.address,
      "https://zama.quest/rewards/",
      "Cipher Blade",
      oracleAddress,
      enforceOracle,
    ],
  });

  log(`ConfidentialGameCoin deployed at ${confidentialGameCoin.address}`);
  log(`GameItemNFT deployed at ${gameItemNFT.address}`);
  log(`ZamaQuest deployed at ${zamaQuest.address}`);
};

export default func;
func.id = "deploy_zama_quest";
func.tags = ["ZamaQuest"];
