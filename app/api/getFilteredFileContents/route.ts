// app/api/getFilteredFileContents/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const directoryPath = process.cwd();

  try {
    // Filtrelenmiş dosya isimlerini getFilteredFileNames endpoint'inden al
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/getFilteredFileNames`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const files = data.files;

    // Dosyaların içeriğini okuma
    const fileContents = await Promise.all(
      files.map(async (file: string) => {
        const filePath = path.join(directoryPath, file);
        const content = fs.readFileSync(filePath, { encoding: "utf-8" });
        return { file, content }; // Dosya adı ve içeriği bir obje olarak döndür
      })
    );

    // Dosya içeriklerini döndür
    return NextResponse.json(fileContents);
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ error: "Error reading files" }, { status: 500 });
  }
}
