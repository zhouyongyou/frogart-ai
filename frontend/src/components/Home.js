import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-green-700 mb-6">
        歡迎來到 FrogArt AI
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        使用 AI 技術生成獨一無二的藝術作品，並鑄造成 NFT 與大家分享！
      </p>
      <div className="space-x-4">
        <Link
          to="/generate"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          立即生成
        </Link>
        <Link
          to="/ranking"
          className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
        >
          查看排行榜
        </Link>
      </div>
    </div>
  );
}
