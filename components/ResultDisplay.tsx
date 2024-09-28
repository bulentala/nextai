import React from "react";
import { Ollama } from "@langchain/ollama";

const ResultDisplay = ({ result }) => {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Analysis Result:</h2>
      <pre
        className="bg-gray-100 p-4 rounded whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: result }}
      />
    </div>
  );
};

export default ResultDisplay;
