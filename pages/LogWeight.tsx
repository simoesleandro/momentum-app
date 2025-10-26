import React, { useState } from 'react';
import { useUserData } from '../hooks/useUserData';
import type { Page } from '../types';

interface LogWeightProps {
  setPage: (page: Page) => void;
}

const LogWeight: React.FC<LogWeightProps> = ({ setPage }) => {
  const { addWeightEntry, getCurrentWeight } = useUserData();
  const [newWeight, setNewWeight] = useState('');
  const [feedback, setFeedback] = useState('');

  const currentWeight = getCurrentWeight();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weightValue = parseFloat(newWeight);
    if (isNaN(weightValue) || weightValue <= 0) {
      setFeedback('Por favor, insira um peso válido.');
      return;
    }
    
    addWeightEntry(weightValue);
    setFeedback('Peso registrado com sucesso!');
    
    setTimeout(() => {
      setPage('Início');
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full max-w-md bg-brand-surface rounded-xl shadow-sm border border-gray-200/50 p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-brand-text">Registrar Novo Peso</h1>
        
        <div className="text-center bg-brand-background border border-gray-200 p-4 rounded-lg">
            <p className="text-brand-subtle">Peso Atual</p>
            <p className="text-4xl font-bold text-brand-primary">{currentWeight.toFixed(1)} kg</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newWeight" className="block text-sm font-medium text-brand-subtle mb-2">Novo Peso (kg)</label>
            <input
              type="number"
              id="newWeight"
              step="0.1"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="w-full bg-brand-background border border-gray-300 p-4 text-2xl text-center rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder="00.0"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg text-lg shadow-lg transition-transform transform hover:scale-105"
          >
            Salvar Registro
          </button>
        </form>

        {feedback && (
          <p className="text-center text-green-500">{feedback}</p>
        )}
      </div>
    </div>
  );
};

export default LogWeight;