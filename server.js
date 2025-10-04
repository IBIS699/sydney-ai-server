{\rtf1\ansi\ansicpg1252\cocoartf2639
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;\f1\fnil\fcharset0 AppleColorEmoji;\f2\fnil\fcharset0 LucidaGrande;
}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww28300\viewh17140\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import express from "express";\
import axios from "axios";\
import cors from "cors";\
\
const app = express();\
app.use(cors());\
app.use(express.json());\
\
let lastReply = null;\
\
// 
\f1 1\uc0\u65039 \u8419 
\f0   from your website 
\f2 \uc0\u8594 
\f0  Zapier\
app.post("/api/send-to-zapier", async (req, res) => \{\
  const zapierHook = "https://hooks.zapier.com/hooks/catch/24818852/u9zavjs/"; // your Zapier hook\
  try \{\
    const r = await axios.post(zapierHook, req.body);\
    res.json(\{ ok: true, zapier_response: r.data || \{\} \});\
  \} catch (err) \{\
    console.error(err.message);\
    res.status(500).json(\{ ok: false, error: err.message \});\
  \}\
\});\
\
// 
\f1 2\uc0\u65039 \u8419 
\f0   Zapier 
\f2 \uc0\u8594 
\f0  your site\
app.post("/api/from-zapier", (req, res) => \{\
  console.log("Zapier sent reply:", req.body);\
  lastReply = req.body.message || req.body.reply || "No reply text received.";\
  res.json(\{ ok: true \});\
\});\
\
// 
\f1 3\uc0\u65039 \u8419 
\f0   website polls for reply\
app.get("/api/get-reply", (req, res) => \{\
  if (lastReply) \{\
    const temp = lastReply;\
    lastReply = null;\
    res.json(\{ reply: temp \});\
  \} else \{\
    res.json(\{\});\
  \}\
\});\
\
const PORT = process.env.PORT || 3000;\
app.listen(PORT, () => console.log("Sydney AI Bridge running on port " + PORT));\
}