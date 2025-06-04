/**
 * 部署腳本：使用 Hardhat + @openzeppelin/hardhat-upgrades
 * 
 * 準備：
 *  - 在根目錄運行 `npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers @openzeppelin/hardhat-upgrades`
 *  - 配置 hardhat.config.js 指定網路（Goerli/Polygon/Matic 等）
 */

const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // 部署 AIArtNFT 可升級合約
  const AIArt = await ethers.getContractFactory("AIArtNFT");
  console.log("Deploying AIArtNFT...");
  const aiArt = await upgrades.deployProxy(AIArt, ["FrogArt AI", "FAI"], {
    initializer: "initialize"
  });
  await aiArt.deployed();
  console.log("AIArtNFT deployed to:", aiArt.address);

  // 部署 InviterTracker 可升級合約
  const InviterTracker = await ethers.getContractFactory("InviterTracker");
  console.log("Deploying InviterTracker...");
  const inviterTracker = await upgrades.deployProxy(InviterTracker, [], {
    initializer: "initialize"
  });
  await inviterTracker.deployed();
  console.log("InviterTracker deployed to:", inviterTracker.address);

  // 部署 RewardSplitter 合約（一次性傳入 payees 和 shares）
  // 這裡只是示範，正式使用時請替換為真實地址和份額
  const payees = [
    "0x1111111111111111111111111111111111111111",
    "0x2222222222222222222222222222222222222222",
    "0x3333333333333333333333333333333333333333"
  ];
  const shares = [50, 30, 20]; // 分別表示 50%、30%、20%
  const RewardSplitter = await ethers.getContractFactory("RewardSplitter");
  console.log("Deploying RewardSplitter...");
  const rewardSplitter = await RewardSplitter.deploy(payees, shares);
  await rewardSplitter.deployed();
  console.log("RewardSplitter deployed to:", rewardSplitter.address);

  console.log("All contracts deployed.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
