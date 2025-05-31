import { ethers } from "hardhat";
import { expect } from "chai";

describe("SwapTracker", function () {
  let owner: any, user: any, dex: any, SwapQuest: any, quest: any, SwapTracker: any, tracker: any;

  beforeEach(async function () {
    [owner, user, dex] = await ethers.getSigners();
    SwapQuest = await ethers.getContractFactory("SwapQuest");
    // Deploy a dummy ArenaToken for SwapQuest
    const ArenaToken = await ethers.getContractFactory("ArenaToken");
    const arena = await ArenaToken.deploy();
    await arena.waitForDeployment();
    quest = await SwapQuest.deploy(await arena.getAddress());
    await quest.waitForDeployment();
    SwapTracker = await ethers.getContractFactory("SwapTracker");
    tracker = await SwapTracker.deploy(await quest.getAddress());
    await tracker.waitForDeployment();
  });

  it("should allow owner to add supported DEX", async function () {
    await expect(tracker.connect(owner).addSupportedDEX(dex.address)).to.not.be.reverted;
    expect(await tracker.supportedDEXs(dex.address)).to.be.true;
  });

  it("should not allow non-owner to add supported DEX", async function () {
    await expect(tracker.connect(user).addSupportedDEX(dex.address)).to.be.revertedWith("Not authorized");
  });

  it("should allow supported DEX to track swap", async function () {
    await tracker.connect(owner).addSupportedDEX(dex.address);
    await expect(
      tracker.connect(dex).trackSwap(user.address, ethers.ZeroAddress, ethers.ZeroAddress, 100, 90, 1)
    ).to.emit(tracker, "SwapTracked");
  });

  it("should not allow unsupported DEX to track swap", async function () {
    await expect(
      tracker.connect(user).trackSwap(user.address, ethers.ZeroAddress, ethers.ZeroAddress, 100, 90, 1)
    ).to.be.revertedWith("Unsupported DEX");
  });
}); 