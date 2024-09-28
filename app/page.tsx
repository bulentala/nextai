import React from "react";
import CodeAnalyzer from "@/components/CodeAnalyzer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto py-8">
        <CodeAnalyzer />
      </main>
    </div>
  );
}
