const CHAT_API_URL = "http://localhost:8000/chat"; // FastAPI URL

/**
 * Send a chat message to FastAPI and get a better-formatted response
 * @param {string} prompt - User's question or topic
 * @returns {Promise<string>} - AI response in improved phrasing & format
 */
async function runChat(prompt, language = "en") {
  try {
    const enhancedPrompt = `
      Explain the following topic clearly and concisely. 
      Use short paragraphs, bullet points, and simple examples if needed.
      Avoid long walls of text. Make it easy to read and understand.
      
      Topic: ${prompt}
    `;

    const payload = {
      user_id: 1,
      message: enhancedPrompt,
      document_ids: [1],
      language: language, // ✅ use selected language
    };

    const response = await fetch(CHAT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`FastAPI error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.response || typeof data.response !== "string") {
      throw new Error("Invalid response format from FastAPI");
    }

    return data.response;
  } catch (error) {
    console.error("Error while running chat:", error);
    throw error;
  }
}

export default runChat;