// components/CodeAnalyzer.tsx
"use client";

import React, { useState } from "react";
import ResultDisplay from "./ResultDisplay";
import FileListDisplay from "./FileListDisplay";

const CodeAnalyzer: React.FC = () => {
  const [userRequest, setUserRequest] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<string[]>([]);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userRequest }),
      });

      if (!response.ok) {
        throw new Error("API isteği başarısız oldu");
      }

      const data = await response.json();
      setResult(data.aiResult);

      // Assuming the API also returns the list of scanned files
      setFiles(data.scannedFiles || []);
    } catch (error) {
      console.error("Analiz sırasında hata:", error);
      setResult("Analiz sırasında bir hata oluştu.");
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Kod Analizörü</h1>
      <input
        type="text"
        value={userRequest}
        onChange={(e) => setUserRequest(e.target.value)}
        placeholder="Sorunuzu girin (örn. 'Bu projede kaç dosya var?')"
        className="w-full p-2 mb-4 border rounded"
      />
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? "Cevap alınıyor..." : "Cevap Al"}
      </button>
      <ResultDisplay result={result} />
      <FileListDisplay files={files} />
    </div>
  );
};

export default CodeAnalyzer;
