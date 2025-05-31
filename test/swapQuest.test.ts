import { ethers } from "hardhat";
import { expect } from "chai";

describe("SwapQuest", function () {
  let owner: any, user: any, dex: any, ArenaToken: any, arena: any, SwapQuest: any, quest: any;

  beforeEach(async function () {
    [owner, user, dex] = await ethers.getSigners();
    ArenaToken = await ethers.getContractFactory("ArenaToken");
    arena = await ArenaToken.deploy();
    await arena.waitForDeployment();
    SwapQuest = await ethers.getContractFactory("SwapQuest");
    quest = await SwapQuest.deploy(await arena.getAddress());
    await quest.waitForDeployment();
    // Owner authorizes DEX
    await quest.authorizeDEX(dex.address, true);
    // Owner adds quest as minter in ArenaToken
    await arena.addMinter(await quest.getAddress());
  });

  it("should create a mission", async function () {
    await expect(
      quest.createMission(
        ethers.ZeroAddress, // fromToken
        ethers.ZeroAddress, // toToken
        100,
        2, // requiredSwaps
        50, // rewardAmount
        3600 // duration
      )
    ).to.emit(quest, "MissionCreated");
    const mission = await quest.getMission(1);
    expect(mission.id).to.equal(1);
    expect(mission.rewardAmount).to.equal(50);
  });

  it("should record a swap and complete mission", async function () {
    await quest.createMission(ethers.ZeroAddress, ethers.ZeroAddress, 100, 1, 50, 3600);
    // DEX calls recordSwap
    await expect(
      quest.connect(dex).recordSwap(1, user.address, 100)
    ).to.emit(quest, "SwapCompleted");
    // User should have reward balance
    const userArena = await quest.userArenaBalance(user.address);
    expect(userArena).to.equal(50);
  });

  it("should allow user to claim rewards", async function () {
    await quest.createMission(ethers.ZeroAddress, ethers.ZeroAddress, 100, 1, 50, 3600);
    await quest.connect(dex).recordSwap(1, user.address, 100);
    // Mint tokens to quest contract so it can pay
    await arena.mint(await quest.getAddress(), 100);
    await expect(quest.connect(user).claimRewards()).to.emit(quest, "RewardClaimed");
    expect(await arena.balanceOf(user.address)).to.equal(50);
  });

  it("should not allow unauthorized DEX to record swap", async function () {
    await quest.createMission(ethers.ZeroAddress, ethers.ZeroAddress, 100, 1, 50, 3600);
    await expect(
      quest.recordSwap(1, user.address, 100)
    ).to.be.revertedWith("Unauthorized DEX");
  });
}); 