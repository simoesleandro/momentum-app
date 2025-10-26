import { GoogleGenAI, Type, Content } from "@google/genai";
import type { Workout, Exercise } from '../types';

const SYSTEM_INSTRUCTION_NUTRITION = `Você é um assistente nutricional de elite, especializado em nutrição para ganho de massa muscular (hipertrofia) para mulheres na faixa dos 40 anos. Suas respostas devem ser claras, baseadas em evidências, seguras e motivadoras. Foque em estratégias práticas que se encaixem em uma rotina agitada. Responda sempre em português do Brasil.`;

const SYSTEM_INSTRUCTION_WORKOUT = `Você é um personal trainer IA de elite, especialista em hipertrofia para mulheres. A sua função é fornecer conselhos concisos e motivacionais durante um treino. Com base no feedback de dificuldade de um exercício, sugira um ajuste de carga (peso) ou de repetições para o próximo treino. A resposta deve ser curta (máximo 2 frases), direta, encorajadora e focada na ação. Responda sempre em português do Brasil.`;

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const buildGeminiContent = (history: ChatMessage[]): Content[] => {
    return history.map(message => ({
        role: message.role,
        parts: [{ text: message.text }]
    }));
};

export async function getNutritionAdvice(history: ChatMessage[]): Promise<string> {
  if (!process.env.API_KEY) {
    return "Erro: A chave da API não foi configurada. Por favor, configure a variável de ambiente API_KEY.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
    console.error("Erro ao chamar a API Gemini:", error);
    return "Desculpe, não consegui processar sua pergunta no momento. Tente novamente mais tarde.";
  }
}

export async function generateFollowUpQuestions(lastResponse: string): Promise<string[]> {
    if (!process.env.API_KEY) {
        console.error("Erro: A chave da API não foi configurada.");
        return [];
    }

    const prompt = `
    Com base na resposta anterior de um assistente nutricional: "${lastResponse}", 
    gere exatamente 3 perguntas de seguimento curtas e pertinentes que um utilizador poderia fazer para aprofundar o tópico.
    As perguntas devem ser concisas e focadas em ação ou clarificação.
    `;

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
                            items: {
                                type: Type.STRING,
                                description: "Uma pergunta de seguimento sugerida."
                            }
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
  if (!process.env.API_KEY) {
    return "Erro: A chave da API não foi configurada.";
  }

  const prompt = `
    Contexto do Treino:
    - Nome do Plano: ${workout.name}
    - Objetivo: Hipertrofia
    
    Exercício Realizado:
    - Nome: ${exercise.name}
    - Séries e Reps Programadas: ${exercise.setsReps}
    - Carga Atual: ${exercise.currentLoad} kg
    
    Feedback da Utilizadora:
    - "A execução deste exercício foi ${feedback.toLowerCase()}."
    
    Seu Pedido:
    Com base neste feedback, forneça uma sugestão curta e direta (máximo 2 frases) sobre como devo ajustar a carga ou as repetições para este mesmo exercício no meu próximo treino. Seja encorajador.
    `;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
    return "Não foi possível obter uma sugestão neste momento. Tente novamente.";
  }
}