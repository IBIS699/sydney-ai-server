// server.js — Sydney AI Bot Backend (Render + Zapier + Lovable)

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("Sydney AI Server running ✅");
});

// 🧠 Memory to store the most recent ChatGPT reply
let latestReply = "";

// ✅ Route to receive messages from the website and forward to Zapier
app.post("/api/send-to-zapier", async (req, res) => {
  const { message, timestamp, source } = req.body;

  // Immediately respond to the website to prevent "No reply text received"
  res.status(200).json({ reply: "Sydney is thinking..." });

  try {
    const zapierURL = "https://hooks.zapier.com/hooks/catch/24818852/u9zavjs/";
    await axios.post(zapierURL, { message, timestamp, source });
    console.log("✅ Forwarded to Zapier:", message);
  } catch (err) {
    console.error("❌ Error sending to Zapier:", err.message);
  }
});

// ✅ Route to receive replies from Zapier / ChatGPT
app.post("/api/from-zapier", (req, res) => {
  const { reply } = req.body;
  console.log("💬 Received reply from Zapier:", reply);
  latestReply = reply; // save reply so front-end can fetch it
  res.status(200).json({ received: true, reply });
});

// ✅ Route for the front-end to poll the latest reply
app.get("/api/latest-reply", (req, res) => {
  const replyToSend = latestReply;
  latestReply = ""; // clear after sending so it doesn't repeat
  res.json({ reply: replyToSend });
});

// ✅ Start the server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Sydney AI Bridge running on port ${PORT}`));
