const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying SwapQuestRouter to World Chain...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  console.log("💰 Account balance:", ethers.utils.formatEther(await deployer.getBalance()), "ETH");

  // Deploy the SwapQuestRouter contract
  console.log("📦 Deploying SwapQuestRouter...");
  const SwapQuestRouter = await ethers.getContractFactory("SwapQuestRouter");
  const swapQuestRouter = await SwapQuestRouter.deploy();

  await swapQuestRouter.deployed();

  console.log("✅ SwapQuestRouter deployed to:", swapQuestRouter.address);
  console.log("🔗 Transaction hash:", swapQuestRouter.deployTransaction.hash);

  // Verify contract addresses
  console.log("\n📋 Contract Configuration:");
  console.log("🔄 Uniswap V3 Router:", await swapQuestRouter.UNISWAP_V3_ROUTER());
  console.log("💎 WETH Address:", await swapQuestRouter.WETH());
  console.log("🌍 WLD Address:", await swapQuestRouter.WLD());
  console.log("💵 USDC Address:", await swapQuestRouter.USDC());

  // Save deployment info
  const deploymentInfo = {
    network: "worldchain",
    contractAddress: swapQuestRouter.address,
    deployerAddress: deployer.address,
    transactionHash: swapQuestRouter.deployTransaction.hash,
    blockNumber: swapQuestRouter.deployTransaction.blockNumber,
    timestamp: new Date().toISOString(),
    contractConfig: {
      uniswapV3Router: await swapQuestRouter.UNISWAP_V3_ROUTER(),
      weth: await swapQuestRouter.WETH(),
      wld: await swapQuestRouter.WLD(),
      usdc: await swapQuestRouter.USDC()
    }
  };

  // Write deployment info to file
  const fs = require('fs');
  const path = require('path');
  
  const deploymentsDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(deploymentsDir, 'worldchain-deployment.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n💾 Deployment info saved to deployments/worldchain-deployment.json");
  
  // Instructions for verification
  console.log("\n🔍 To verify the contract on World Chain explorer, run:");
  console.log(`npx hardhat verify --network worldchain ${swapQuestRouter.address}`);

  console.log("\n🎉 Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
