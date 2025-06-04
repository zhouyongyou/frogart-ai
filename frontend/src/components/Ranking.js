import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Ranking() {
  const [inviteRank, setInviteRank] = useState([]);
  const [shareRank, setShareRank] = useState([]);

  useEffect(() => {
    async function fetchRankings() {
      try {
        const invRes = await axios.get("/api/ranking?type=invite&period=daily");
        setInviteRank(invRes.data.ranking);

        const shareRes = await axios.get("/api/ranking?type=share&period=daily");
        setShareRank(shareRes.data.ranking);
      } catch (err) {
        console.error(err);
      }
    }
    fetchRankings();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">排行榜（每日）</h2>

      <div className="mb-8">
        <h3 className="text-xl font-medium mb-2">邀請排行榜</h3>
        <ul className="list-decimal list-inside">
          {inviteRank.map((item, idx) => (
            <li key={idx}>
              {item._id}：{item.count} 人
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-medium mb-2">分享排行榜</h3>
        <ul className="list-decimal list-inside">
          {shareRank.map((item, idx) => (
            <li key={idx}>
              {item._id}：{item.count} 次
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
