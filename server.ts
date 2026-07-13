/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { trainAndCompareAll, predictCrop } from "./src/utils/mlEngine.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily to avoid crashing on startup if the key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API Routes FIRST

// 1. Prediction API with Expert AI Explanation
app.post("/api/predict", async (req, res) => {
  try {
    const { N, P, K, temperature, humidity, pH, rainfall } = req.body;

    if (
      N === undefined ||
      P === undefined ||
      K === undefined ||
      temperature === undefined ||
      humidity === undefined ||
      pH === undefined ||
      rainfall === undefined
    ) {
      res.status(400).json({ error: "Missing soil or environmental parameters" });
      return;
    }

    // Call the built-in Machine Learning Predictor
    const prediction = predictCrop({
      N: parseFloat(N),
      P: parseFloat(P),
      K: parseFloat(K),
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      pH: parseFloat(pH),
      rainfall: parseFloat(rainfall),
    });

    // Lazy load Gemini for explanation
    let aiExplanation = "";
    try {
      const ai = getGeminiClient();
      const prompt = `You are an expert Agronomist and Senior Soil Scientist.
The Machine Learning Crop Recommendation model has predicted that the crop "${prediction.bestCrop}" is the absolute best match for the following soil and environmental parameters:
- Nitrogen (N): ${N} kg/ha (typical crop requirements range from 0 to 140)
- Phosphorus (P): ${P} kg/ha (typical crop requirements range from 5 to 145)
- Potassium (K): ${K} kg/ha (typical crop requirements range from 5 to 205)
- Temperature: ${temperature} °C
- Humidity: ${humidity} %
- pH: ${pH} (soil acidity level)
- Rainfall: ${rainfall} mm

Please generate a professional, highly detailed, and copyable Agronomy & Fertilizer Recommendation Report for this selection. Include:
1. **Soil Health Assessment**: Analyze whether N, P, K levels are optimal, deficient, or excessive for growing "${prediction.bestCrop}".
2. **Environmental & Climate Match**: Verify if the Temperature, Humidity, and Rainfall are suitable, explaining the crop's physiological needs.
3. **Fertilizer Application Plan**: Give explicit, calculated, step-by-step guidance on what fertilizer or soil amendments to apply to correct any deficits (e.g. Urea for Nitrogen, DAP for Phosphorus, MOP for Potassium).
4. **Cultivation Guidelines**: Provide practical guidelines on sowing dates, irrigation management, pest controls, and harvesting strategies.

Format your response in beautiful, professional Markdown with bullet points, bold text, and clean tables where relevant. Keep it practical, structured, and friendly.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });
      aiExplanation = response.text || "Failed to generate AI explanation.";
    } catch (aiErr: any) {
      console.error("Gemini API call failed:", aiErr);
      aiExplanation = `**[AI Report Unavailable]**
Gemini API key is not configured or rate-limited. However, here is the standard statistical profile for the recommended crop:
- **Recommended Crop**: **${prediction.bestCrop.toUpperCase()}**
- **Optimal Soil pH Range**: Suitable for pH ${pH}
- **Optimal Rainfall**: Fits within ${rainfall} mm precipitation.
- **Nitrogen Requirement**: Recommended N level around ${N} kg/ha.
*(Please configure your GEMINI_API_KEY in Settings > Secrets to unlock complete agronomic reports).*`;
    }

    res.json({
      prediction,
      aiExplanation,
    });
  } catch (error: any) {
    console.error("Prediction endpoint failed:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// 2. Machine Learning Training Sim API
app.post("/api/train", async (req, res) => {
  try {
    const { knnK, dtDepth, rfTrees, rfDepth } = req.body;
    
    // Call our training simulation engine
    const results = trainAndCompareAll({
      knnK: knnK ? parseInt(knnK) : 5,
      dtDepth: dtDepth ? parseInt(dtDepth) : 6,
      rfTrees: rfTrees ? parseInt(rfTrees) : 10,
      rfDepth: rfDepth ? parseInt(rfDepth) : 6,
    });

    res.json({ results });
  } catch (error: any) {
    console.error("Training endpoint failed:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// 3. Expert Chatbot API
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Messages array is required" });
      return;
    }

    const ai = getGeminiClient();
    
    // Convert client messages to Gemini contents structure
    // We expect messages to be [{ role: 'user' | 'model', content: string }]
    const formattedHistory = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedHistory,
      config: {
        systemInstruction: `You are an expert Agronomist, Soil Chemist, and Crop Scientist. Your goal is to help students, farmers, and data scientists understand soil properties, fertilizer management, crop physiology, and machine learning applications in agriculture.
        Keep your tone supportive, authoritative, highly detailed, and educational. Use Markdown formatting. Use tables and bullets where helpful.`
      }
    });

    res.json({
      reply: response.text || "I was unable to formulate a response at this time."
    });
  } catch (error: any) {
    console.error("Chat endpoint failed:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Start server and mount Vite middleware
async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
