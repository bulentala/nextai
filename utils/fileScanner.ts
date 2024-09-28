import fs from 'fs/promises';
import path from 'path';

const excludedDirs = ['node_modules', 'public', 'build', '.next', 'docs', '.git', 'fonts'];
const excludedFiles = ['','tailwind.config.ts','README.md','favicon.ico','.eslintrc.json','.gitignore','next-env.d.ts','next.config.mjs','package-lock.json','postcss.config.mjs','ProjectPrompt.md']; // Yeni eklenen satır
const includedExtensions = ['.ts', '.tsx', '.js', '.jsx'];

export async function scanDirectory(dir: string): Promise<string[]> {
  const files: string[] = [];

  async function scan(currentDir: string) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        if (!excludedDirs.includes(entry.name)) {
          await scan(fullPath);
        }
      } else if (entry.isFile() && includedExtensions.includes(path.extname(entry.name)) && !excludedFiles.includes(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  await scan(dir);
  return files;
}

export async function readFileContents(filePath: string): Promise<string> {
  return fs.readFile(filePath, 'utf-8');
}