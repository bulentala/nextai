import { Ollama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

export async function processWithAI(code: string, userRequest: string): Promise<string> {
  const llm = new Ollama({
    baseUrl: OLLAMA_BASE_URL,
    model: "llama3.2:3b",
    temperature: 0.7,
  });

  const template = `
    Aşağıdaki kodu analiz et ve kullanıcının sorusuna doğrudan cevap ver.
    Yanıtını Türkçe olarak ver ve sadece kullanıcının sorduğu soruya odaklan.
    Gereksiz bilgiler verme, sadece sorulan soruyu cevapla.
    
    Kod:
    {code}
    
    Kullanıcı Sorusu: {userRequest}
    
    Cevap (Türkçe olarak ve sadece soruya odaklanarak):
  `;

  const prompt = PromptTemplate.fromTemplate(template);

  const chain = prompt.pipe(llm);
  const result = await chain.invoke({ code, userRequest });

  return result;
}