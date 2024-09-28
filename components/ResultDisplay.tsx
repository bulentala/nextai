"use client";

import React from "react";

interface ResultDisplayProps {
  result: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Analysis Result:</h2>
      <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
        {result}
      </pre>
    </div>
  );
};

export default ResultDisplay;
