import React, { useEffect, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";

export default function Competition() {
  const [submissions, setSubmissions] = useState([]);
  const [cid, setCid] = useState("");
  const [desc, setDesc] = useState("");
  const [socialLink, setSocialLink] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function fetchSubmissions() {
    try {
      const res = await axios.get("/api/competition/list?status=approved");
      setSubmissions(res.data.submissions);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit() {
    if (!cid) return;
    setStatusMsg("提交中…");
    try {
      // 連錢包拿 address
      if (!window.ethereum) {
        setStatusMsg("請安裝 MetaMask 等以太坊錢包");
        return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const walletAddress = await signer.getAddress();

      await axios.post(
        "/api/competition/submit",
        { walletAddress, cid, description: desc, socialLink },
        { headers: { "Content-Type": "application/json" } }
      );
      setStatusMsg("提交成功！");
      fetchSubmissions();
    } catch (err) {
      console.error(err);
      setStatusMsg("提交失敗");
    }
  }

  async function handleVote(id) {
    try {
      // 連錢包拿 address
      if (!window.ethereum) {
        return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const walletAddress = await signer.getAddress();

      await axios.post(
        "/api/competition/vote",
        { walletAddress, submissionId: id },
        { headers: { "Content-Type": "application/json" } }
      );
      fetchSubmissions();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">創意挑戰賽</h2>

      <div className="mb-6">
        <h3 className="text-xl font-medium mb-2">我要參賽</h3>
        <input
          type="text"
          placeholder="IPFS CID"
          className="border rounded-lg p-2 w-full mb-2"
          value={cid}
          onChange={(e) => setCid(e.target.value)}
        />
        <textarea
          rows={2}
          placeholder="作品說明"
          className="border rounded-lg p-2 w-full mb-2"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <input
          type="text"
          placeholder="社交平台連結（選填）"
          className="border rounded-lg p-2 w-full mb-2"
          value={socialLink}
          onChange={(e) => setSocialLink(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          提交作品
        </button>
        <p className="mt-2 text-gray-600">{statusMsg}</p>
      </div>

      <div>
        <h3 className="text-xl font-medium mb-2">已通過作品</h3>
        <ul className="space-y-4">
          {submissions.map((sub) => (
            <li key={sub._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-800">CID: {sub.cid}</p>
                  <p className="text-gray-600">說明: {sub.description}</p>
                  <p className="text-gray-600">投票數: {sub.voteCount}</p>
                </div>
                <button
                  onClick={() => handleVote(sub._id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  投票
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
