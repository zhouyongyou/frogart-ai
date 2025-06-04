/**
 * 以太坊鏈上交互工具：用於初始化 ethers.js、發送交易給合約
 */

const { ethers } = require("ethers");
const config = require("../config");
const AIArtABI = require("../../contracts/build/contracts/AIArtNFT.json").abi;
const InviterABI = require("../../contracts/build/contracts/InviterTracker.json").abi;
const RewardSplitterABI = require("../../contracts/build/contracts/RewardSplitter.json").abi;

const provider = new ethers.providers.JsonRpcProvider(config.ethRpcUrl);
const wallet = new ethers.Wallet(config.privateKey, provider);

// 合約實例
const aiArtContract = new ethers.Contract(
  config.contracts.aiArtNFT,
  AIArtABI,
  wallet
);
const inviterContract = new ethers.Contract(
  config.contracts.inviterTracker,
  InviterABI,
  wallet
);
const rewardSplitterContract = new ethers.Contract(
  config.contracts.rewardSplitter,
  RewardSplitterABI,
  wallet
);

module.exports = {
  provider,
  wallet,
  aiArtContract,
  inviterContract,
  rewardSplitterContract,
  ethers
};
