import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmButtonClass = 'bg-red-500 hover:bg-red-600 text-white'
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[70] p-4"
      onClick={onClose}
    >
        <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
            .animate-slideIn { animation: slideIn 0.3s ease-out; }
        `}</style>
      <div
        className="bg-brand-surface dark:bg-brand-surface-dark rounded-xl shadow-lg p-6 w-full max-w-sm mx-auto animate-slideIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center bg-red-100 dark:bg-red-900/40">
                <i className="fas fa-exclamation-triangle text-2xl text-red-500 dark:text-red-400"></i>
            </div>
            <div>
                <h2 className="text-xl font-bold text-brand-text dark:text-brand-text-dark">{title}</h2>
                <p className="text-brand-subtle dark:text-brand-subtle-dark mt-2">{message}</p>
            </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-brand-subtle/20 text-brand-subtle hover:bg-brand-subtle/30 font-semibold transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2 rounded-md font-semibold transition-colors shadow ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
