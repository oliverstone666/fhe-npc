import { FhevmType } from "@fhevm/hardhat-plugin";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:quest:addresses", "Print deployed contract addresses").setAction(async (_args: TaskArguments, hre) => {
  const { deployments } = hre;
  const quest = await deployments.get("ZamaQuest");
  const coin = await deployments.get("ConfidentialGameCoin");
  const item = await deployments.get("GameItemNFT");

  console.log(`ZamaQuest        : ${quest.address}`);
  console.log(`cGC Token        : ${coin.address}`);
  console.log(`GameItemNFT      : ${item.address}`);
});

task("task:quest:npc1-start", "Start the NPC1 quest and generate a requirement")
  .addOptionalParam("address", "Optional ZamaQuest contract address")
  .setAction(async (_args: TaskArguments, hre) => {
    const { ethers, deployments } = hre;
    const deployment = _args.address ? { address: _args.address } : await deployments.get("ZamaQuest");
    const quest = await ethers.getContractAt("ZamaQuest", deployment.address);
    const signer = (await ethers.getSigners())[0];
    const tx = await quest.connect(signer).beginNPC1Quest();
    console.log(`beginNPC1Quest tx: ${tx.hash}`);
    await tx.wait();
  });

task("task:quest:npc1-unlock", "Unlock NPC1 requirement for decryption")
  .addOptionalParam("address", "Optional ZamaQuest contract address")
  .setAction(async (_args: TaskArguments, hre) => {
    const { ethers, deployments } = hre;
    const deployment = _args.address ? { address: _args.address } : await deployments.get("ZamaQuest");
    const quest = await ethers.getContractAt("ZamaQuest", deployment.address);
    const signer = (await ethers.getSigners())[0];
    const tx = await quest.connect(signer).unlockNPC1Requirement();
    console.log(`unlockNPC1Requirement tx: ${tx.hash}`);
    await tx.wait();
  });

task("task:quest:npc1-decrypt", "Decrypt the NPC1 cGC requirement")
  .addOptionalParam("address", "Optional ZamaQuest contract address")
  .addOptionalParam("player", "Player address (defaults to signer[0])")
  .setAction(async (_args: TaskArguments, hre) => {
    const { ethers, deployments, fhevm } = hre;
    await fhevm.initializeCLIApi();

    const deployment = _args.address ? { address: _args.address } : await deployments.get("ZamaQuest");
    const quest = await ethers.getContractAt("ZamaQuest", deployment.address);
    const signer = (await ethers.getSigners())[0];
    const playerAddress = _args.player ?? signer.address;

    const requirement = await quest.getNPC1Requirement(playerAddress);

    if (requirement === ethers.ZeroHash) {
      console.log("NPC1 requirement not initialized");
      return;
    }

    const value = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      requirement,
      deployment.address,
      signer,
    );

    console.log(`NPC1 requirement for ${playerAddress}: ${value} cGC`);
  });

task("task:quest:npc1-submit", "Submit the NPC1 payment")
  .addParam("value", "Amount of cGC to submit")
  .addOptionalParam("address", "Optional ZamaQuest contract address")
  .setAction(async (_args: TaskArguments, hre) => {
    const { ethers, deployments, fhevm } = hre;
    await fhevm.initializeCLIApi();

    const deployment = _args.address ? { address: _args.address } : await deployments.get("ZamaQuest");
    const quest = await ethers.getContractAt("ZamaQuest", deployment.address);
    const signer = (await ethers.getSigners())[0];

    const parsedValue = BigInt(_args.value);

    const encrypted = await fhevm
      .createEncryptedInput(deployment.address, signer.address)
      .add64(parsedValue)
      .encrypt();

    const tx = await quest
      .connect(signer)
      .submitNPC1Payment(encrypted.handles[0], encrypted.inputProof);
    console.log(`submitNPC1Payment tx: ${tx.hash}`);
    await tx.wait();
  });

task("task:quest:npc2-decrypt", "Decrypt NPC2 item contract and name")
  .addOptionalParam("address", "Optional ZamaQuest contract address")
  .setAction(async (_args: TaskArguments, hre) => {
    const { ethers, deployments, fhevm } = hre;
    await fhevm.initializeCLIApi();

    const deployment = _args.address ? { address: _args.address } : await deployments.get("ZamaQuest");
    const quest = await ethers.getContractAt("ZamaQuest", deployment.address);
    const signer = (await ethers.getSigners())[0];

    const contractCipher = await quest.getNPC2ContractCipher();
    const contractAddress = await fhevm.userDecryptEaddress(
      contractCipher,
      deployment.address,
      signer,
    );

    const nameCipher = await quest.getNPC2NameCipher();
    const nameValue = await fhevm.userDecryptEuint(
      FhevmType.euint256,
      nameCipher,
      deployment.address,
      signer,
    );

    const rawHex = nameValue.toString(16).padStart(64, "0");
    const bytes = Buffer.from(rawHex, "hex");
    const label = bytes.toString("utf8").replace(/\u0000+$/, "");

    console.log(`NPC2 item contract : ${contractAddress}`);
    console.log(`NPC2 item name     : ${label}`);
  });
