import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const rootDir = process.cwd(); // Projenin kök dizini
  const fileList: {
    fileName: string;
    fileType: string;
    filePath: string;
    fileContent: string;
  }[] = [];

  const excludeDir = [".next", "node_modules", ".git", "fonts"]; // Hariç tutulacak dizinler
  const excludeFile = [
    ".env",
    ".env.local",
    ".DS_Store",
    "file.svg",
    "globe.svg",
    "next.svg",
    "vercel.svg",
    "window.svg",
    "README.md",
    ".gitignore",
    "favicon.ico",
    "package-lock.json",
  ];
  // Dosya ve dizinleri tarayarak listeleyen bir yardımcı fonksiyon
  function scanDirectory(dir: string) {
    const items = fs.readdirSync(dir);

    items.forEach((item) => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);

      if (excludeDir.includes(item) || excludeFile.includes(item)) {
        // Eğer hariç tutulacak bir dizin veya dosya ise, taramayı atla
        return;
      }

      if (stat.isDirectory()) {
        // Eğer bir dizinse, içini tarayalım
        scanDirectory(itemPath);
      } else {
        // Eğer bir dosyaysa, listeye ekleyelim
        const fileName = path.basename(itemPath);
        const fileType = path.extname(itemPath).slice(1); // Dosya uzantısını alır ve noktayı kaldırır
        const relativePath = path
          .relative(rootDir, itemPath)
          .replace(/\\/g, "/"); // Windows yolu Unix stiline dönüştürülür
        const fileContent = fs.readFileSync(itemPath, "utf-8"); // Dosya içeriğini oku

        fileList.push({
          fileName,
          fileType,
          filePath: relativePath,
          fileContent,
        });
      }
    });
  }

  // Kök dizinden başlayarak tüm dosyaları tarayalım
  scanDirectory(rootDir);

  // Tarama sonucunu JSON formatında döndür
  const response = NextResponse.json({ fileList });

  // JSON verisini data/data.json dosyasına yaz
  const outputPath = path.join(rootDir, "data", "data.json");
  fs.writeFileSync(outputPath, JSON.stringify({ fileList }, null, 2));

  return response;
}
