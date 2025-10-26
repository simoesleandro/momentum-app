import React, { useState } from 'react';

interface FloatingActionButtonProps {
  onLogWeight: () => void;
  onStartWorkout: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onLogWeight, onStartWorkout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { label: 'Registrar Peso', icon: 'fas fa-weight-hanging', action: onLogWeight, color: 'bg-blue-500' },
    { label: 'Iniciar Treino', icon: 'fas fa-play', action: onStartWorkout, color: 'bg-green-500' },
    { label: 'Registrar Refeição', icon: 'fas fa-utensils', action: () => alert('Funcionalidade em breve!'), color: 'bg-orange-500' },
  ];

  return (
    <div className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-40">
      <div className="relative flex flex-col items-center gap-3">
        {/* Action Buttons */}
        <div 
          className={`transition-all duration-300 ease-in-out flex flex-col items-center gap-3 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        >
          {actions.map((action, index) => (
            <div key={index} className="flex items-center gap-3 group">
              <span className="bg-brand-surface dark:bg-brand-surface-dark text-sm font-semibold px-3 py-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {action.label}
              </span>
              <button
                onClick={() => { action.action(); setIsOpen(false); }}
                className={`${action.color} text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform`}
                aria-label={action.label}
              >
                <i className={action.icon}></i>
              </button>
            </div>
          ))}
        </div>
        
        {/* Main FAB */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`bg-brand-primary text-white w-16 h-16 rounded-full flex items-center justify-center shadow-xl hover:bg-brand-primary-dark transition-all duration-300 transform ${isOpen ? 'rotate-45' : 'rotate-0'}`}
          aria-expanded={isOpen}
          aria-label="Ações rápidas"
        >
          <i className="fas fa-plus text-2xl"></i>
        </button>
      </div>
    </div>
  );
};

export default FloatingActionButton;
