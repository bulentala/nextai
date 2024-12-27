// app/api/chat/route.ts
import { createOllama } from 'ollama-ai-provider';
import { streamText, convertToCoreMessages } from 'ai';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const previousMessages = messages.slice(0, -1); // Son mesaj hariç tüm mesajlar
  const latestMessage = messages[messages.length - 1]; // Son mesaj

  const ollama = createOllama({});

  const result = await streamText({
    model: ollama('llama3.2:3b'), // Sabit model
    messages: [
      ...convertToCoreMessages(previousMessages), // Önceki mesajları dönüştür
      { role: 'user', content: latestMessage.content }, // Son mesajı ekle
    ],
  });

  return result.toDataStreamResponse();
}