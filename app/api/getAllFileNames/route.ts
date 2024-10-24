// app/api/getAllFileNames/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Belirli bir dizindeki tüm dosya ve klasörleri tarayan recursive fonksiyon
const getAllFiles = (dirPath: string, arrayOfFiles: string[] = []) => {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      // Eğer klasörse, recursive olarak içindeki dosyaları da tarar
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      // Dosya ise, tam yolunu array'e ekler
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
};

// API route handler
export async function GET() {
  const directoryPath = process.cwd();

  try {
    const files = getAllFiles(directoryPath);

    // Dosya isimlerini döndür
    return NextResponse.json({
      files: files.map((file) => file.replace(directoryPath, "")),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error reading directory" },
      { status: 500 }
    );
  }
}
