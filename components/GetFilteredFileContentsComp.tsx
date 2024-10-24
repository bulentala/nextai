// components/GetFilteredFileContentsComp.tsx
"use client";

import React, { useEffect, useState } from "react";

const GetFilteredFileContentsComp = () => {
  const [fileContents, setFileContents] = useState<
    { file: string; content: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFileContents = async () => {
      try {
        const response = await fetch("/api/getFilteredFileContents");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setFileContents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFileContents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Filtered File Contents</h2>
      <ul>
        {fileContents.map(({ file, content }) => (
          <li key={file}>
            <h3>{file}</h3>
            <pre>{content}</pre>{" "}
            {/* İçeriği daha okunaklı bir formatta göster */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetFilteredFileContentsComp;
