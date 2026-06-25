import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());

  const PORT = 3000;

  // Initialize GoogleGenAI client (lazy initialization format)
  let aiClient: GoogleGenAI | null = null;
  function getAiClient() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      aiClient = new GoogleGenAI({
        apiKey: apiKey || "",
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // API route for brainstorming & prompt suggestions
  app.post("/api/gemini/brainstorm", async (req, res) => {
    try {
      const { prompt, category } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        // Fallback response for missing API key so that the UI still works gracefully offline
        return res.json({
          text: `### [Offline Preview Mode] Swalah Union Suggestions\n\n` +
                `Here are some premium brainstorm suggestions for **${category || 'Swalah Union'}** based on your prompt: *"${prompt}"*:\n\n` +
                `- **Theme Choice**: "Vivid Horizons (Fostering Classmates Legacy)"\n` +
                `- **Execution Model**: Setup interactive roundtable meets, peer feedback loops, and multi-lingual review boards.\n` +
                `- **Key Action Points**:\n` +
                `  - Host a regional inter-wing standard exhibition.\n` +
                `  - Create digital files catalogs for easy archival.\n\n` +
                `*Note: Add a valid GEMINI_API_KEY in Settings > Secrets to unlock full server-side live AI brainstorming.*`
        });
      }

      const ai = getAiClient();
      const systemInstruction = `You are the Swalah Union AI Advisor, an expert academic planner and cultural event coordinator for a prestigious student union with language wings (Arabic, English, Urdu, Kannada). 
      Generate creative, detailed, highly engaging suggestions, programs, themes, and formats based on the user's prompt. 
      Keep your response structured, practical, inspiring, and formatted cleanly in markdown with bullet points. Do not include excessive introductory or concluding text.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error("Gemini API error:", err);
      res.status(500).json({ error: err.message || "Failed to generate AI brainstorming ideas" });
    }
  });

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
