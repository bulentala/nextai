// components/FileListDisplay.tsx
"use client";

import React from "react";

interface FileListDisplayProps {
  files: string[];
}

const FileListDisplay: React.FC<FileListDisplayProps> = ({ files }) => {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Scanned Files:</h2>
      <ul className="list-disc list-inside">
        {files.map((file, index) => (
          <li key={index} className="text-gray-700">
            {file}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileListDisplay;
