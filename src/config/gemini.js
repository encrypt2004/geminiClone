

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;



// ✅ FIX 1 — model name should not include "models/"
const MODEL_NAME = "gemini-2.5-flash";
 // or "gemini-1.5-pro" for the newer model

// ✅ your API key (keep private — don’t expose publicly)


async function runChat(prompt) {
  // initialize Gemini
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  // generation settings (controls creativity and response length)
  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  // safety filters (to block harmful outputs)
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  // start chat session
  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [],
  });

  // ✅ FIX 2 — you were passing prompt inside text(), which caused issues
  const result = await chat.sendMessage(prompt);
  const response = result.response;

  console.log("AI Response:", response.text());
  return response.text();
}

export default runChat;
