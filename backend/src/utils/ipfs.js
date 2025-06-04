/**
 * 負責把生成的圖片 Buffer 上傳到 IPFS（示範使用 Pinata SDK）
 */

const pinataSDK = require("@pinata/sdk");
const fs = require("fs");
const path = require("path");
const config = require("../config");

const pinata = pinataSDK(config.pinata.apiKey, config.pinata.apiSecret);

/**
 * 上傳本地檔案或 Buffer 到 IPFS
 * @param {Buffer} fileBuffer - 要上傳的圖像 Buffer
 * @param {string} fileName   - 檔名，例如 "frog123.png"
 * @returns {Promise<string>} 返回 IPFS CID
 */
async function uploadToIPFS(fileBuffer, fileName) {
  const options = {
    pinataMetadata: {
      name: fileName
    },
    pinataOptions: {
      cidVersion: 1
    }
  };
  const result = await pinata.pinFileToIPFS(
    fs.createReadStream(fileName),
    options
  );
  // 返回 CID (例如 "Qm...")，前端可拼接到 gateway
  return result.IpfsHash;
}

module.exports = { uploadToIPFS };
