import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-600">
          FrogArt AI
        </Link>
        <div className="space-x-4">
          <Link to="/" className="text-gray-700 hover:text-green-600">
            首頁
          </Link>
          <Link to="/generate" className="text-gray-700 hover:text-green-600">
            AI 生成
          </Link>
          <Link to="/ranking" className="text-gray-700 hover:text-green-600">
            排行榜
          </Link>
          <Link to="/competition" className="text-gray-700 hover:text-green-600">
            挑戰賽
          </Link>
        </div>
      </div>
    </nav>
  );
}
