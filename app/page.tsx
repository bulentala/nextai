"use client";
import React, { useState, ChangeEvent } from "react";

const HomePage = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prompt değişikliğini yönetir
  const handlePromptChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value);
  };

  // Prompt gönderimini yönetir
  const handleSubmitPrompt = async () => {
    setIsLoading(true);
    setResponse("");
    setError(null);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Chat request failed: ${response.statusText}`);
      }

      const data = await response.json();
      setResponse(data.text);
    } catch (error: any) {
      console.error("Error in handleSubmitPrompt:", error);
      setError(`Error fetching response: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>RAG Chatbot</h1>
      <input
        type="text"
        value={prompt}
        onChange={handlePromptChange}
        placeholder="Enter your prompt"
      />
      <button onClick={handleSubmitPrompt} disabled={isLoading}>
        {isLoading ? "Loading..." : "Submit"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <h2>Response:</h2>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default HomePage;
