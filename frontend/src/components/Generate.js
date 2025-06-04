import React, { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";

export default function Generate() {
  const [prompt, setPrompt] = useState("");
  const [cid, setCid] = useState("");
  const [status, setStatus] = useState("");

  // 簡單示範：使用者點擊生成後，送到 /api/generate
  async function handleGenerate() {
    if (!prompt) return;
    setStatus("生成中…請稍候");
    try {
      // 先連錢包
      if (!window.ethereum) {
        setStatus("請安裝 MetaMask 等以太坊錢包");
        return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const walletAddress = await signer.getAddress();

      const res = await axios.post(
        "/api/generate",
        { prompt, walletAddress },
        { headers: { "Content-Type": "application/json" } }
      );
      setCid(res.data.cid);
      setStatus("生成完成！");
    } catch (err) {
      console.error(err);
      setStatus("生成失敗，請重試");
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">AI 圖片生成</h2>
      <textarea
        className="w-full border rounded-lg p-2 mb-4"
        rows={4}
        placeholder="輸入文字描述，讓 AI 幫您繪製"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={handleGenerate}
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        生成並上傳 IPFS
      </button>
      <p className="mt-4 text-gray-600">{status}</p>
      {cid && (
        <div className="mt-6">
          <h3 className="text-xl font-medium mb-2">預覽：</h3>
          <img
            src={`https://ipfs.io/ipfs/${cid}`}
            alt="AI Art Preview"
            className="mx-auto border rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
