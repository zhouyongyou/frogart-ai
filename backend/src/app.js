/**
 * Express 應用主入口
 */
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./config");

async function main() {
  // 連接 MongoDB
  await mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log("MongoDB connected.");

  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "10mb" })); // 支援大檔案上傳

  // 路由掛載
  app.use("/api/generate", require("./routes/generate"));
  app.use("/api/verifyShare", require("./routes/share"));
  app.use("/api/invite", require("./routes/invite"));
  app.use("/api/ranking", require("./routes/ranking"));
  app.use("/api/competition", require("./routes/competition"));

  const port = config.port;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
