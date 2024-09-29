import { promises as fs } from 'fs';
import path from 'path';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { OllamaEmbeddings } from '@langchain/ollama';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { NextResponse } from 'next/server';

const EXCLUDED_DIRS = ['node_modules', '.git', 'dist']; // Dışlanacak dizinler
const EXCLUDED_FILES = ['package.json', 'package-lock.json']; // Dışlanacak dosyalar

async function getFiles(dir: string): Promise<string[]> {
  let files: string[] = [];
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      if (!EXCLUDED_DIRS.includes(dirent.name)) {
        files = files.concat(await getFiles(res)); // Alt dizinlere git
      }
    } else {
      if (!EXCLUDED_FILES.includes(dirent.name)) {
        files.push(res); // Dosyayı listeye ekle
      }
    }
  }
  return files;
}

export async function POST() {
  try {
    const projectDir = path.resolve('./'); // Proje dizinini başlat
    const files = await getFiles(projectDir);

    const embeddings = new OllamaEmbeddings({
      model: 'llama3.2:3b',
    });

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 100,
      separators: ['\n'],
    });

    for (const file of files) {
      const fileContent = await fs.readFile(file, 'utf-8');
      const splitDocs = await textSplitter.createDocuments([fileContent]);

      const vectorStore = await HNSWLib.fromDocuments(splitDocs, embeddings);
      await vectorStore.save('vectorstore/rag-store.index'); // Vektör deposuna kaydet
    }

    return NextResponse.json({ success: true, files: files.length });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ message: 'Error processing request', success: false, error: error.message }, { status: 500 });
  }
}
