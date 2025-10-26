import React from 'react';
import type { ExerciseDetail } from '../types';

interface ExerciseDetailModalProps {
  exercise: ExerciseDetail | null;
  onClose: () => void;
}

const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({ exercise, onClose }) => {
  if (!exercise) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-brand-surface rounded-xl shadow-lg p-6 w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold text-brand-text mb-4">{exercise.name}</h2>
          <button onClick={onClose} className="text-brand-subtle hover:text-brand-text">&times;</button>
        </div>
        
        <div className="mb-4 bg-gray-100 rounded-md flex justify-center items-center border border-gray-200">
          <img src={exercise.gifUrl} alt={`Animação de ${exercise.name}`} className="rounded-md w-full" />
        </div>
        
        <h3 className="text-lg font-semibold text-brand-primary mb-2">Como Executar</h3>
        <p className="text-brand-subtle whitespace-pre-line leading-relaxed">{exercise.description}</p>
        
        <button
          onClick={onClose}
          className="mt-6 w-full bg-brand-secondary hover:bg-brand-primary text-white font-bold py-3 px-4 rounded-md transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default ExerciseDetailModal;