require("dotenv").config();

module.exports = {
  port: process.env.PORT || 4000,
  mongoURI: process.env.MONGODB_URI,
  ethRpcUrl: process.env.ETH_RPC_URL,
  privateKey: process.env.PRIVATE_KEY,

  contracts: {
    aiArtNFT: process.env.AIART_NFT_ADDRESS,
    inviterTracker: process.env.INVITER_TRACKER_ADDRESS,
    rewardSplitter: process.env.REWARD_SPLITTER_ADDRESS
  },

  pinata: {
    apiKey: process.env.PINATA_API_KEY,
    apiSecret: process.env.PINATA_API_SECRET
  }
};
