import { ethers } from "hardhat";
import { expect } from "chai";

describe("ArenaToken", function () {
  let owner: any, minter: any, user: any, ArenaToken: any, arena: any;

  beforeEach(async function () {
    [owner, minter, user] = await ethers.getSigners();
    ArenaToken = await ethers.getContractFactory("ArenaToken");
    arena = await ArenaToken.deploy();
    await arena.waitForDeployment();
  });

  it("should deploy with initial supply to owner", async function () {
    const balance = await arena.balanceOf(owner.address);
    expect(balance).to.be.gt(0);
  });

  it("owner can add and remove minter", async function () {
    await expect(arena.addMinter(minter.address)).to.emit(arena, "MinterAdded");
    expect(await arena.minters(minter.address)).to.be.true;
    await expect(arena.removeMinter(minter.address)).to.emit(arena, "MinterRemoved");
    expect(await arena.minters(minter.address)).to.be.false;
  });

  it("minter can mint tokens", async function () {
    await arena.addMinter(minter.address);
    await arena.connect(minter).mint(user.address, 1000);
    expect(await arena.balanceOf(user.address)).to.equal(1000);
  });

  it("user can burn their tokens", async function () {
    await arena.addMinter(minter.address);
    await arena.connect(minter).mint(user.address, 1000);
    await arena.connect(user).burn(500);
    expect(await arena.balanceOf(user.address)).to.equal(500);
  });

  it("should not allow non-minter to mint", async function () {
    await expect(arena.connect(user).mint(user.address, 1000)).to.be.revertedWith("Not authorized to mint");
  });
}); 