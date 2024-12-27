// app/page.tsx
"use client";

import { useChat } from "ai/react";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded bg-white p-4 shadow">
        <div className="mb-4 h-64 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}
            >
              <span
                className={`inline-block rounded p-2 ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
              >
                {msg.content}
              </span>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            className="flex-1 rounded-l border p-2"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="rounded-r bg-blue-500 p-2 text-white"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
