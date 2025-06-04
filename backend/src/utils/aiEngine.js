/**
 * 示範：呼叫本地 Docker 化的 Stable Diffusion 
 * 輸入 prompt，生成一張 512×512 PNG 並返回本地檔案路徑或 Buffer
 * 實際可依團隊環境改為呼叫第三方 API（如 Replicate、OpenAI DALL·E）
 */

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

async function generateAIImage(prompt, outputFileName) {
  /**
   * 假定已經有一個 Docker 容器可接受命令：
   *   docker run --rm stable-diffusion-cli "你的 prompt" output.png
   * 生成 output.png 放到當前目錄下
   */
  return new Promise((resolve, reject) => {
    const cmd = `docker run --rm stable-diffusion-cli "${prompt}" ${outputFileName}`;
    exec(cmd, (error, stdout, stderr) => {
      if (error) return reject(error);
      // 確認檔案已生成
      const filePath = path.join(process.cwd(), outputFileName);
      if (fs.existsSync(filePath)) {
        resolve(filePath);
      } else {
        reject(new Error("AI 生成檔案不存在"));
      }
    });
  });
}

module.exports = { generateAIImage };
