
import React from 'react';
import { EXERCISE_ALTERNATIVES } from '../constants';

interface EditExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  muscleGroup: string;
  onSelectExercise: (exerciseName: string) => void;
}

const EditExerciseModal: React.FC<EditExerciseModalProps> = ({ isOpen, onClose, muscleGroup, onSelectExercise }) => {
  if (!isOpen) return null;

  const alternatives = EXERCISE_ALTERNATIVES[muscleGroup] || [];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-brand-surface rounded-lg p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Alterar Exercício - {muscleGroup}</h2>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {alternatives.length > 0 ? (
            alternatives.map((ex, index) => (
              <button
                key={index}
                onClick={() => onSelectExercise(ex)}
                className="w-full text-left p-3 bg-brand-background hover:bg-brand-primary rounded-md transition-colors"
              >
                {ex}
              </button>
            ))
          ) : (
            <p className="text-brand-subtle">Não há alternativas disponíveis para este grupo muscular.</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-brand-secondary hover:bg-brand-primary text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default EditExerciseModal;
