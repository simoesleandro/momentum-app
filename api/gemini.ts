// @ts-nocheck
// Note: Vercel serverless functions can have issues with standard TS imports.
// This file is designed to work in that environment.

// We need to manually import these from the CDN inside the function
// because Vercel might not bundle them correctly from the import map.
let GoogleGenAI;
let Type;

async function loadGenAI() {
  if (!GoogleGenAI || !Type) {
    const genaiModule = await import('https://aistudiocdn.com/@google/genai@^1.26.0');
    GoogleGenAI = genaiModule.GoogleGenAI;
    Type = genaiModule.Type;
  }
}

const SYSTEM_INSTRUCTION_NUTRITION = `Você é um assistente nutricional de elite, especializado em nutrição para ganho de massa muscular (hipertrofia) para mulheres na faixa dos 40 anos. Suas respostas devem ser claras, baseadas em evidências, seguras e motivadoras. Foque em estratégias práticas que se encaixem em uma rotina agitada. Responda sempre em português do Brasil.`;
const SYSTEM_INSTRUCTION_WORKOUT = `Você é um personal trainer IA de elite, especialista em hipertrofia para mulheres. A sua função é fornecer conselhos concisos e motivacionais durante um treino. Com base no feedback de dificuldade de um exercício, sugira um ajuste de carga (peso) ou de repetições para o próximo treino. A resposta deve ser curta (máximo 2 frases), direta, encorajadora e focada na ação. Responda sempre em português do Brasil.`;

const buildGeminiContent = (history) => {
    return history.map(message => ({
        role: message.role,
        parts: [{ text: message.text }]
    }));
};

// This is the Vercel serverless function handler
export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
        return response.status(500).json({ error: 'API_KEY_MISSING', message: 'API key is not configured on the server.' });
    }

    try {
        await loadGenAI();
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const body = request.body;

        switch (body.type) {
            case 'nutrition': {
                const contents = buildGeminiContent(body.history);
                const geminiResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: contents,
                    config: {
                        systemInstruction: SYSTEM_INSTRUCTION_NUTRITION,
                        temperature: 0.7,
                    }
                });
                return response.status(200).json({ text: geminiResponse.text });
            }

            case 'follow-up': {
                const prompt = `Com base na resposta anterior de um assistente nutricional: "${body.lastResponse}", gere exatamente 3 perguntas de seguimento curtas e pertinentes que um utilizador poderia fazer para aprofundar o tópico. As perguntas devem ser concisas e focadas em ação ou clarificação.`;
                const geminiResponse = await ai.models.generateContent({
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
                const jsonResponse = JSON.parse(geminiResponse.text);
                return response.status(200).json({ questions: jsonResponse.questions || [] });
            }

            case 'workout': {
                 const { workout, exercise, feedback } = body;
                 const prompt = `Contexto do Treino:
- Nome do Plano: ${workout.name}
- Objetivo: Hipertrofia

Exercício Realizado:
- Nome: ${exercise.name}
- Séries e Reps Programadas: ${exercise.setsReps}
- Carga Atual: ${exercise.currentLoad} kg

Feedback da Utilizadora:
- "A execução deste exercício foi ${feedback.toLowerCase()}."

Seu Pedido:
Com base neste feedback, forneça uma sugestão curta e direta (máximo 2 frases) sobre como devo ajustar a carga ou as repetições para este mesmo exercício no meu próximo treino. Seja encorajador.`;

                const geminiResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        systemInstruction: SYSTEM_INSTRUCTION_WORKOUT,
                        temperature: 0.8,
                    }
                });
                return response.status(200).json({ text: geminiResponse.text });
            }

            default:
                return response.status(400).json({ error: 'Invalid request type' });
        }
    } catch (error) {
        console.error('Error in Gemini API handler:', error);
        return response.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}