import React, { useState, useEffect, useRef } from 'react';
import { getNutritionAdvice, generateFollowUpQuestions } from '../services/geminiService';
import Card from '../components/Card';
import type { ChatMessage } from '../types';
import { useUserData } from '../hooks/useUserData';

const NutritionGuide: React.FC = () => {
  const { data, logNutritionChat } = useUserData();
  const [conversation, setConversation] = useState<ChatMessage[]>(data.nutritionChatHistory);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [conversation, isLoading]);
  
  useEffect(() => {
    logNutritionChat(conversation);
  }, [conversation, logNutritionChat]);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const newUserMessage: ChatMessage = { role: 'user', text: messageText };
    const newConversation = [...conversation, newUserMessage];
    
    setConversation(newConversation);
    setCurrentInput('');
    setIsLoading(true);
    setFollowUpQuestions([]);

    try {
      const advice = await getNutritionAdvice(newConversation);
      const newModelMessage: ChatMessage = { role: 'model', text: advice };
      setConversation(prev => [...prev, newModelMessage]);
      
      const questions = await generateFollowUpQuestions(advice);
      setFollowUpQuestions(questions);

    } catch (error) {
      const errorMessage: ChatMessage = { role: 'model', text: 'Ocorreu um erro ao buscar o conselho. Tente novamente.' };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(currentInput);
  };
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Guia Nutricional</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Princípios Chave" icon={<i className="fas fa-apple-alt"></i>}>
          <ul className="list-disc list-inside space-y-2 text-brand-subtle">
            <li>Superavit calórico controlado (~300-500 kcal acima do gasto).</li>
            <li>Ingestão proteica elevada (1.6-2.2g por kg de peso corporal).</li>
            <li>Carboidratos complexos como principal fonte de energia.</li>
            <li>Gorduras saudáveis para suporte hormonal.</li>
            <li>Hidratação constante (mínimo 2-3 litros de água por dia).</li>
            <li>Refeições bem distribuídas ao longo do dia.</li>
          </ul>
        </Card>
        <Card title="Suplementação Recomendada" icon={<i className="fas fa-pills"></i>}>
          <ul className="list-disc list-inside space-y-2 text-brand-subtle">
            <li><strong>Creatina Monohidratada:</strong> 3-5g por dia para força e performance.</li>
            <li><strong>Whey Protein:</strong> Para complementar a ingestão proteica, especialmente no pós-treino.</li>
            <li><strong>Multivitamínico:</strong> Para garantir a ingestão de micronutrientes essenciais.</li>
            <li><strong>Ômega 3:</strong> Propriedades anti-inflamatórias e saúde geral.</li>
          </ul>
        </Card>
      </div>
      
      <Card title="Assistente Nutricional IA" icon={<i className="fas fa-robot"></i>}>
        <div className="flex flex-col" style={{ height: 'clamp(50vh, 65vh, 700px)' }}>
          <div className="flex-1 overflow-y-auto pr-4 space-y-4">
            {conversation.length === 0 && (
              <div className="text-center text-brand-subtle p-8 flex flex-col items-center justify-center h-full">
                <i className="fas fa-comments text-4xl mb-4"></i>
                <p>Tem alguma dúvida sobre sua dieta, alimentos ou suplementos? Comece uma conversa!</p>
              </div>
            )}
            {conversation.map((msg, index) => (
              <div key={index} className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && <i className="fas fa-robot text-brand-primary bg-brand-primary/10 p-2 rounded-full self-start"></i>}
                <div className={`max-w-[80%] rounded-xl p-3 shadow-sm ${msg.role === 'user' ? 'bg-brand-primary text-white' : 'bg-brand-background dark:bg-brand-surface-dark'}`}>
                  <pre className="whitespace-pre-wrap font-sans text-sm">{msg.text}</pre>
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex items-end gap-3 justify-start">
                  <i className="fas fa-robot text-brand-primary bg-brand-primary/10 p-2 rounded-full self-start"></i>
                  <div className="max-w-[80%] rounded-xl p-3 bg-brand-background dark:bg-brand-surface-dark">
                      <div className="flex items-center gap-2 text-sm text-brand-subtle">
                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-primary"></div>
                         <span>A pensar...</span>
                      </div>
                  </div>
               </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="mt-auto border-t border-gray-200 dark:border-gray-700 pt-4">
            {followUpQuestions.length > 0 && !isLoading && (
              <div className="mb-4 flex flex-wrap justify-start gap-2 animate-fadeIn">
                {followUpQuestions.map((q, i) => (
                  <button 
                      key={i} 
                      onClick={() => handleSendMessage(q)}
                      className="px-3 py-1.5 text-sm rounded-full bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary-dark transition-colors border border-brand-primary/30"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="flex items-center gap-4">
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Ex: Qual o melhor lanche pré-treino?"
                className="flex-grow bg-brand-background dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-brand-primary text-white font-bold p-3 rounded-lg transition-colors hover:bg-brand-secondary disabled:bg-brand-subtle flex-shrink-0 w-12 h-12 flex items-center justify-center"
                disabled={isLoading || !currentInput.trim()}
                aria-label="Enviar mensagem"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NutritionGuide;