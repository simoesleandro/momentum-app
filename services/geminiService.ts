import type { Workout, Exercise, ChatMessage } from '../types';

const API_ENDPOINT = '/api/gemini';

const API_KEY_ERROR_MESSAGE = "Erro: A chave da API não foi configurada no ambiente do servidor. Por favor, adicione a variável de ambiente API_KEY na sua plataforma de alojamento (ex: Vercel, Netlify).";
const GENERIC_ERROR_MESSAGE = "Desculpe, não consegui processar sua pergunta no momento. Tente novamente mais tarde.";

// Helper function to call our secure backend API
async function callGeminiApi(payload: object): Promise<any> {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // If the server returns a specific error message, use it.
      const errorData = await response.json();
      if (errorData.error === 'API_KEY_MISSING') {
        throw new Error(API_KEY_ERROR_MESSAGE);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao chamar a API Gemini via proxy:", error);
    // Propagate the specific API key error message
    if (error instanceof Error && error.message.includes("API não foi configurada")) {
      throw error;
    }
    throw new Error(GENERIC_ERROR_MESSAGE);
  }
}

export async function getNutritionAdvice(history: ChatMessage[]): Promise<string> {
  try {
    const data = await callGeminiApi({
      type: 'nutrition',
      history,
    });
    return data.text;
  } catch (error) {
    return (error as Error).message;
  }
}

export async function generateFollowUpQuestions(lastResponse: string): Promise<string[]> {
  try {
    const data = await callGeminiApi({
      type: 'follow-up',
      lastResponse,
    });
    return data.questions || [];
  } catch (error) {
    console.error("Erro ao gerar perguntas de seguimento:", error);
    return [];
  }
}

export async function getWorkoutAdvice(workout: Workout, exercise: Exercise, feedback: 'Fácil' | 'Ideal' | 'Difícil'): Promise<string> {
  try {
    const data = await callGeminiApi({
      type: 'workout',
      workout,
      exercise,
      feedback,
    });
    return data.text;
  } catch (error) {
    return (error as Error).message;
  }
}