import axios from "axios";

const instance = axios.create({
  baseURL: "/", // 假設前端與後端同源，若不在同源，需要改成完整 API 域名
  headers: {
    "Content-Type": "application/json"
  }
});

export default instance;
