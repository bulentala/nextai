import chokidar from "chokidar";
import http from "http";
import path from "path";

// Projenin kök dizini
const rootDir = process.cwd();

// Dosya değişikliklerini dinle
const watcher = chokidar.watch(rootDir, {
  ignored: /(^|[\/\\])\../, // Gizli dosyaları yoksay
  persistent: true,
});

// Dosya değişikliği algılandığında API'yi tetikle
watcher.on("change", (filePath) => {
  console.log(`Dosya değişti: ${filePath}`);
  // API'yi tetikle
  http
    .get("http://localhost:3000/api/scanCodeBase", (res) => {
      console.log("API tetiklendi. Durum kodu:", res.statusCode);
    })
    .on("error", (err) => {
      console.error("API tetiklenirken hata oluştu:", err.message);
    });
});

console.log("Dosya değişiklikleri dinleniyor...");
