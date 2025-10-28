import { GoogleGenAI, Type } from "@google/genai";
import type { Workout, Exercise, ChatMessage } from '../types';

// O process.env.API_KEY é injetado pelo ambiente de execução.
if (!process.env.API_KEY) {
  // Isso não deve acontecer no ambiente de produção, mas é uma boa verificação.
  console.error("Erro: A chave da API não foi configurada no ambiente.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const GENERIC_ERROR_MESSAGE = "Desculpe, não consegui processar sua pergunta no momento. Tente novamente mais tarde.";

const SYSTEM_INSTRUCTION_NUTRITION = `Você é um assistente nutricional de elite, especializado em nutrição para ganho de massa muscular (hipertrofia) para mulheres na faixa dos 40 anos. Suas respostas devem ser claras, baseadas em evidências, seguras e motivadoras. Foque em estratégias práticas que se encaixem em uma rotina agitada. Responda sempre em português do Brasil.`;
const SYSTEM_INSTRUCTION_WORKOUT = `Você é um personal trainer IA de elite, especialista em hipertrofia para mulheres. A sua função é fornecer conselhos concisos e motivacionais durante um treino. Com base no feedback de dificuldade de um exercício, sugira um ajuste de carga (peso) ou de repetições para o próximo treino. A resposta deve ser curta (máximo 2 frases), direta, encorajadora e focada na ação. Responda sempre em português do Brasil.`;

const buildGeminiContent = (history: ChatMessage[]) => {
    return history.map(message => ({
        role: message.role,
        parts: [{ text: message.text }]
    }));
};

export async function getNutritionAdvice(history: ChatMessage[]): Promise<string> {
  try {
    const contents = buildGeminiContent(history);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_NUTRITION,
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao chamar a API Gemini para conselho nutricional:", error);
    return GENERIC_ERROR_MESSAGE;
  }
}

export async function generateFollowUpQuestions(lastResponse: string): Promise<string[]> {
  try {
    const prompt = `Com base na resposta anterior de um assistente nutricional: "${lastResponse}", gere exatamente 3 perguntas de seguimento curtas e pertinentes que um utilizador poderia fazer para aprofundar o tópico. As perguntas devem ser concisas e focadas em ação ou clarificação.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["questions"]
        },
        temperature: 0.8,
      }
    });
    const jsonResponse = JSON.parse(response.text);
    return jsonResponse.questions || [];
  } catch (error) {
    console.error("Erro ao gerar perguntas de seguimento:", error);
    return [];
  }
}

export async function getWorkoutAdvice(workout: Workout, exercise: Exercise, feedback: 'Fácil' | 'Ideal' | 'Difícil'): Promise<string> {
  try {
    const prompt = `Contexto do Treino:
- Nome do Plano: ${workout.name}
- Objetivo: Hipertrofia

Exercício Realizado:
- Nome: ${exercise.name}
- Séries e Reps Programadas: ${exercise.sets}x${exercise.reps}
- Carga Atual: ${exercise.currentLoad} kg

Feedback da Utilizadora:
- "A execução deste exercício foi ${feedback.toLowerCase()}."

Seu Pedido:
Com base neste feedback, forneça uma sugestão curta e direta (máximo 2 frases) sobre como devo ajustar a carga ou as repetições para este mesmo exercício no meu próximo treino. Seja encorajador.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_WORKOUT,
        temperature: 0.8,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao chamar a API Gemini para conselho de treino:", error);
    return GENERIC_ERROR_MESSAGE;
  }
}
