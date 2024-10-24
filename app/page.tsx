"use client";
import GetAllFileNamesComp from "@/components/GetAllFileNamesComp";
import GetFilteredFileNamesComp from "@/components/GetFilteredFileNamesComp";
import GetFilteredFileContentsComp from "@/components/GetFilteredFileContentsComp"; // Yolun doğruluğunu kontrol edin

import React, { useState } from "react";

const Tabs = () => {
  const [activeTab, setActiveTab] = useState<string>("GetAllFileNames");

  const openTab = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <div>
      <div className="space-x-6  font-bold">
        <button onClick={() => openTab("GetAllFileNames")}>
          GetAllFileNames
        </button>
        <button onClick={() => openTab("GetFilteredFileNames")}>
          GetFilteredFileNames
        </button>
        <button onClick={() => openTab("Tokyo")}>
          GetFilteredFileContents
        </button>
      </div>

      {/* Tab içerikleri */}
      {activeTab === "GetAllFileNames" && (
        <div>
          <GetAllFileNamesComp />
        </div>
      )}
      {activeTab === "GetFilteredFileNames" && (
        <div>
          <GetFilteredFileNamesComp />
        </div>
      )}
      {activeTab === "Tokyo" && (
        <div>
          <GetFilteredFileContentsComp />
        </div>
      )}
    </div>
  );
};

export default Tabs;
