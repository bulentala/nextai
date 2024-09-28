import { scanDirectory, readFileContents } from './fileScanner';

export async function processCode(): Promise<string> {
  const projectRoot = process.cwd();
  const files = await scanDirectory(projectRoot);

  const codeContents = await Promise.all(
    files.map(async (file) => {
      const content = await readFileContents(file);
      return `File: ${file}\n\n${content}\n\n`;
    })
  );

  return codeContents.join('');
}