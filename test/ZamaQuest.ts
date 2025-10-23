import { FhevmType } from "@fhevm/hardhat-plugin";
import { expect } from "chai";
import { deployments, ethers, fhevm } from "hardhat";

describe("ZamaQuest", function () {
  it("runs the full NPC quest flow", async function () {
    await deployments.fixture(["ZamaQuest"]);
    await fhevm.initializeCLIApi();

    const questDeployment = await deployments.get("ZamaQuest");
    const itemDeployment = await deployments.get("GameItemNFT");

    const quest = await ethers.getContractAt("ZamaQuest", questDeployment.address);
    const item = await ethers.getContractAt("GameItemNFT", itemDeployment.address);
    const [player] = await ethers.getSigners();

    const txStart = await quest.connect(player).beginNPC1Quest();
    await txStart.wait();

    const unlockTx = await quest.connect(player).unlockNPC1Requirement();
    await unlockTx.wait();

    const requirement = await quest.getNPC1Requirement(player.address);
    const value = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      requirement,
      questDeployment.address,
      player,
    );

    expect(value).to.be.gte(100n);
    expect(value).to.be.lte(200n);

    const encrypted = await fhevm
      .createEncryptedInput(questDeployment.address, player.address)
      .add64(value)
      .encrypt();

    const submitTx = await quest
      .connect(player)
      .submitNPC1Payment(encrypted.handles[0], encrypted.inputProof);
    await submitTx.wait();

    await fhevm.awaitDecryptionOracle();

    const progressAfterNpc1 = await quest.getPlayerProgress(player.address);
    expect(progressAfterNpc1[2]).to.equal(true);

    const unlockNpc2Tx = await quest.connect(player).unlockNPC2Details();
    await unlockNpc2Tx.wait();

    const npc2ContractCipher = await quest.getNPC2ContractCipher();
    const npc2NameCipher = await quest.getNPC2NameCipher();
    expect(npc2ContractCipher).to.not.equal(ethers.ZeroHash);
    expect(npc2NameCipher).to.not.equal(ethers.ZeroHash);

    const mintItemTx = await item.connect(player).mintItem();
    await mintItemTx.wait();

    const tokenId = 1n;
    await item.connect(player).approve(quest.target, tokenId);

    const submitNpc2Tx = await quest.connect(player).submitNPC2Item(tokenId);
    await submitNpc2Tx.wait();

    const rewardTx = await quest.connect(player).mintReward();
    await rewardTx.wait();

    expect(await quest.balanceOf(player.address)).to.equal(1n);
    expect(await quest.ownerOf(1n)).to.equal(player.address);
    expect(await item.ownerOf(tokenId)).to.equal(quest.target);
  });
});
