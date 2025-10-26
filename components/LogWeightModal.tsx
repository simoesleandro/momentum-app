import React, { useState, useEffect } from 'react';
import { useUserData } from '../hooks/useUserData';

interface LogWeightModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogWeightModal: React.FC<LogWeightModalProps> = ({ isOpen, onClose }) => {
  const { addWeightEntry, getCurrentWeight } = useUserData();
  const [newWeight, setNewWeight] = useState('');
  const [feedback, setFeedback] = useState('');
  const currentWeight = getCurrentWeight();

  useEffect(() => {
    if (isOpen) {
      setNewWeight('');
      setFeedback('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const weightValue = parseFloat(newWeight);
    if (isNaN(weightValue) || weightValue <= 0) {
      setFeedback('Por favor, insira um peso válido.');
      return;
    }
    addWeightEntry(weightValue);
    setFeedback('Peso registrado com sucesso!');
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-brand-surface dark:bg-brand-surface-dark rounded-xl shadow-lg p-6 w-full max-w-sm mx-auto animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-center mb-4">Registrar Peso</h2>
        <div className="text-center bg-brand-background dark:bg-brand-background-dark p-3 rounded-lg mb-4">
          <p className="text-sm text-brand-subtle">Peso Atual</p>
          <p className="text-3xl font-bold text-brand-primary">{currentWeight.toFixed(1)} kg</p>
        </div>
        <div className="space-y-4">
          <input
            type="number"
            step="0.1"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            className="w-full bg-brand-background dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-3 text-2xl text-center rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
            placeholder="00.0"
            autoFocus
          />
          <button
            onClick={handleSave}
            className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg text-lg shadow-lg hover:bg-brand-primary-dark transition-transform transform hover:scale-105"
          >
            Salvar
          </button>
          {feedback && <p className="text-center text-sm text-green-500 animate-fadeIn">{feedback}</p>}
        </div>
      </div>
    </div>
  );
};

export default LogWeightModal;
