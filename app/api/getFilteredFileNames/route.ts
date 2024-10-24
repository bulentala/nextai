// app/api/getFilteredFileNames/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { EXCLUDED_DIRS, EXCLUDED_FILES } from "@/utils/constants";

// Dizin kontrolü için yardımcı fonksiyon
const isExcludedDir = (dirPath: string) => {
  return EXCLUDED_DIRS.some((excludedDir) => dirPath.includes(excludedDir));
};

// Dosya kontrolü için yardımcı fonksiyon
const isExcludedFile = (fileName: string) => {
  return EXCLUDED_FILES.some((excludedFile) => fileName.includes(excludedFile));
};

// Recursive olarak dosyaları tarayan ve filtreleyen fonksiyon
const getFilteredFiles = (dirPath: string, arrayOfFiles: string[] = []) => {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const relativePath = fullPath.replace(process.cwd(), "");

    // Önce dizin kontrolü yap
    if (isExcludedDir(relativePath)) {
      return; // Bu dizini atla
    }

    // Dosya kontrolü yap
    if (isExcludedFile(file)) {
      return; // Bu dosyayı atla
    }

    if (fs.statSync(fullPath).isDirectory()) {
      // Klasör ise recursive olarak devam et
      arrayOfFiles = getFilteredFiles(fullPath, arrayOfFiles);
    } else {
      // Dosya ise ekle
      arrayOfFiles.push(relativePath);
    }
  });

  return arrayOfFiles;
};

// API route handler
export async function GET() {
  try {
    const directoryPath = process.cwd();
    const filteredFiles = getFilteredFiles(directoryPath);

    console.log("Filtered Files:", filteredFiles); // Debug için

    return NextResponse.json({ files: filteredFiles });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { error: "Error reading directory" },
      { status: 500 }
    );
  }
}
