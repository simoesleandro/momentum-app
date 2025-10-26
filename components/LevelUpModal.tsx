import React from 'react';

interface LevelUpModalProps {
  level: number | null;
  onClose: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, onClose }) => {
  if (!level) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60] p-4"
      onClick={onClose}
    >
      <style>{`
        @keyframes modal-fade-in-scale {
          from { opacity: 0; transform: scale(0.8) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-fade-in-scale {
          animation: modal-fade-in-scale 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        @keyframes sparkle-anim {
          0% { transform: scale(0); opacity: 0.5; }
          50% { opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .sparkle {
          position: absolute;
          width: 10px;
          height: 10px;
          background-color: #fde047; /* yellow-300 */
          border-radius: 50%;
          animation: sparkle-anim 0.8s ease-out;
        }
      `}</style>
      <div
        className="bg-brand-surface dark:bg-brand-surface-dark rounded-xl shadow-2xl p-8 w-full max-w-sm mx-auto text-center animate-modal-fade-in-scale relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sparkles for effect */}
        <div className="sparkle" style={{ top: '15%', left: '20%', animationDelay: '0.1s' }}></div>
        <div className="sparkle" style={{ top: '25%', left: '80%', animationDelay: '0.3s' }}></div>
        <div className="sparkle" style={{ top: '70%', left: '10%', animationDelay: '0.5s' }}></div>
        <div className="sparkle" style={{ top: '85%', left: '90%', animationDelay: '0.2s' }}></div>

        <div className="w-28 h-28 rounded-full flex items-center justify-center bg-brand-primary/10 mx-auto mb-4 border-4 border-brand-primary/20 relative">
            <i className="fas fa-star text-6xl text-brand-primary"></i>
        </div>
        
        <p className="text-sm font-bold uppercase text-brand-primary tracking-wider">SUBIU DE NÍVEL!</p>
        <h2 className="text-3xl font-bold text-brand-text dark:text-brand-text-dark mt-2 mb-3">Nível {level} Alcançado!</h2>
        <p className="text-brand-subtle dark:text-brand-subtle-dark mb-6">O seu esforço está a dar frutos. Continue com o excelente trabalho!</p>
        
        <button
          onClick={onClose}
          className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white font-bold py-3 px-4 rounded-md transition-colors shadow-lg"
        >
          Fantástico!
        </button>
      </div>
    </div>
  );
};

export default LevelUpModal;