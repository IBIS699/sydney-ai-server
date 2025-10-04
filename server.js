// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("Sydney AI Server running ✅");
});

// ✅ Route to receive messages from the website and forward to Zapier
app.post("/api/send-to-zapier", async (req, res) => {
  const { message, timestamp, source } = req.body;
  try {
    const zapierURL = "https://hooks.zapier.com/hooks/catch/24818852/u9zavjs/"; // your real Zapier hook URL
    const response = await axios.post(zapierURL, { message, timestamp, source });
    res.status(200).json({ status: "sent", zapierResponse: response.data });
  } catch (err) {
    console.error("Error sending to Zapier:", err.message);
    res.status(500).json({ error: "Failed to send to Zapier" });
  }
});

// ✅ Route to receive replies from Zapier / ChatGPT
app.post("/api/from-zapier", (req, res) => {
  const { reply } = req.body;
  console.log("Received reply from Zapier:", reply);
  res.status(200).json({ received: true, reply });
});

// ✅ Start the server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Sydney AI Bridge running on port ${PORT}`));
