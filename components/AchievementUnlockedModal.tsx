import React from 'react';
import type { Achievement } from '../data/gamification';

interface AchievementUnlockedModalProps {
  achievement: Achievement | null;
  onClose: () => void;
}

const AchievementUnlockedModal: React.FC<AchievementUnlockedModalProps> = ({ achievement, onClose }) => {
  if (!achievement) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <style>{`
        @keyframes modal-fade-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-modal-fade-in {
          animation: modal-fade-in 0.3s ease-out forwards;
        }
      `}</style>
      <div
        className="bg-brand-surface dark:bg-brand-surface-dark rounded-xl shadow-2xl p-8 w-full max-w-sm mx-auto text-center animate-modal-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-24 h-24 rounded-full flex items-center justify-center bg-brand-primary/10 mx-auto mb-4 border-4 border-brand-primary/20">
            <i className={`${achievement.icon} text-5xl text-brand-primary`}></i>
        </div>
        
        <p className="text-sm font-bold uppercase text-brand-primary tracking-wider">CONQUISTA DESBLOQUEADA</p>
        <h2 className="text-2xl font-bold text-brand-text dark:text-brand-text-dark mt-2 mb-3">{achievement.name}</h2>
        <p className="text-brand-subtle dark:text-brand-subtle-dark mb-6">{achievement.description}</p>
        
        <button
          onClick={onClose}
          className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white font-bold py-3 px-4 rounded-md transition-colors shadow-lg"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default AchievementUnlockedModal;