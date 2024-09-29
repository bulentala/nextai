import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { Ollama, OllamaEmbeddings } from '@langchain/ollama';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { Document } from '@langchain/core/documents';
import fs from 'fs';
import path from 'path';

const QA_PROMPT_TEMPLATE = `You are a good assistant that answers questions. Your knowledge is strictly limited to the following piece of context. Use it to answer the question at the end.
  If the answer can't be found in the context, just say you don't know. *DO NOT* try to make up an answer.
  If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.
  Give a response in the same language as the question.
  
  Context: {context}
  Question: {question}
  Helpful answer in markdown:`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const bodySchema = z.object({
      prompt: z.string(),
    });

    const { prompt } = bodySchema.parse(body);

    // Embeddings ve retriever ayarları
    const embeddings = new OllamaEmbeddings({
      model: 'llama3.2:3b',
    });

    // Projede taranmış dosya sayısını dinamik olarak bulma
    const vectorStorePath = path.join(process.cwd(), 'vectorstore');
    const files = fs.readdirSync(vectorStorePath); // vectorstore dizinindeki tüm dosyaları al
    const fileCount = files.length; // Taranan dosya sayısını dinamik olarak belirle

    // Dosya sayısına göre retriever ayarla
    const retriever = await HNSWLib.load('vectorstore/rag-store.index', embeddings).then((vectorStore) =>
      vectorStore.asRetriever({ k: fileCount })
    );

    const llm = new Ollama({
      model: 'llama3.2:3b',
      temperature: 0,
    });

    const qaPrompt = ChatPromptTemplate.fromTemplate(QA_PROMPT_TEMPLATE);

    const retrievalChain = RunnableSequence.from([
      (input: { question: string }) => ({ question: input.question }),
      {
        question: (input) => input.question,
        context: async (input) => {
          try {
            // Bağlamı retriever'dan getir
            const docs = await retriever.getRelevantDocuments(input.question);
            console.log("Retrieved documents:", docs); // Dokümanları logla
            return docs.map((doc: Document) => doc.pageContent).join('\n\n');
          } catch (error) {
            console.error('Error retrieving documents:', error);
            return ''; // Boş string döndür ki zincir devam etsin
          }
        },
      },
      qaPrompt,
      llm,
      new StringOutputParser(),
    ]);

    // Prompt'u işleme
    const response = await retrievalChain.invoke({ question: prompt });

    return new Response(JSON.stringify({ text: response }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ message: 'Error processing request', success: false, error: error.message }, { status: 500 });
  }
}
