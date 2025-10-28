import React, { useMemo } from 'react';
import type { Workout, Exercise, ExerciseDetail } from '../types';
import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';

interface ExportWorkoutModalProps {
  workout: Workout | null;
  onClose: () => void;
}

const ExportWorkoutModal: React.FC<ExportWorkoutModalProps> = ({ workout, onClose }) => {
  if (!workout) return null;

  const groupedExercises: { [key: string]: Exercise[] } = useMemo(() => {
    return workout.exercises.reduce((acc, exercise) => {
      const group = exercise.group;
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(exercise);
      return acc;
    }, {} as { [key: string]: Exercise[] });
  }, [workout.exercises]);
  
  const exerciseDetailMap = useMemo(() => {
    const map: { [key: string]: ExerciseDetail } = {};
    Object.values(EXERCISE_LIBRARY).flat().forEach(exDetail => {
      map[exDetail.name] = exDetail;
    });
    return map;
  }, []);

  const generateTextContent = () => {
    let content = `Plano de Treino: ${workout.name}\n`;
    content += "========================================\n\n";
    
    Object.entries(groupedExercises).forEach(([group, exercises]) => {
      content += `** ${group.toUpperCase()} **\n\n`;
      exercises.forEach(ex => {
        content += `${ex.name}\n`;
        content += `  - Séries/Reps: ${ex.sets}x${ex.reps}\n`;
        content += `  - Carga Atual: ${ex.currentLoad.toFixed(1)} kg\n\n`;
      });
    });
    return content;
  };

  const handleTextExport = () => {
    const content = generateTextContent();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = `plano_${workout.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onClose();
  };

  const generateHtmlContent = () => {
    let content = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        
        body { 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
          line-height: 1.5; 
          color: #1f2937;
          margin: 0;
          padding: 0;
          background-color: #f9fafb;
          -webkit-print-color-adjust: exact;
        }
        
        @media print {
          body {
            margin: 20px;
            background-color: #ffffff;
          }
          .no-print {
            display: none;
          }
          * {
             -webkit-print-color-adjust: exact !important;
             print-color-adjust: exact !important;
          }
        }

        .page-container {
          max-width: 800px;
          margin: 20px auto;
          padding: 20px;
          background-color: #ffffff;
        }

        header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 4px solid #7c3aed;
          padding-bottom: 20px;
        }

        header h1 { 
          color: #6d28d9;
          font-size: 2.5em;
          margin: 0;
        }
        
        header p {
          color: #6b7280;
          font-size: 1.2em;
          margin: 5px 0 0;
        }

        .muscle-group h2 { 
          color: #7c3aed; 
          font-size: 1.8em;
          margin-top: 30px;
          margin-bottom: 20px;
          border-left: 5px solid #a78bfa;
          padding-left: 15px;
          background-color: #f5f3ff;
          padding-top: 5px;
          padding-bottom: 5px;
          border-radius: 0 5px 5px 0;
        }

        .exercise-card {
          display: flex;
          gap: 20px;
          align-items: center;
          background-color: #f9fafb; 
          border: 1px solid #e5e7eb; 
          border-radius: 12px; 
          padding: 20px; 
          margin-bottom: 20px; 
          page-break-inside: avoid;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }
        
        .exercise-details {
          flex: 1;
        }
        
        .exercise-details strong { 
          font-size: 1.4em; 
          color: #1f2937;
          display: block;
          margin-bottom: 10px;
        }
        
        .exercise-details p {
          margin: 5px 0;
          font-size: 1.1em;
          color: #374151;
        }
        
        .exercise-details span {
          background-color: #f5f3ff;
          color: #6d28d9;
          padding: 4px 10px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 1.05em;
        }
        
        .exercise-gif {
          flex-shrink: 0;
          width: 150px;
          height: 150px;
          border-radius: 8px;
          overflow: hidden;
          border: 3px solid #a78bfa;
          background-color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .exercise-gif img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        footer {
          margin-top: 40px;
          text-align: center;
          font-size: 0.9em;
          color: #9ca3af;
        }
      </style>
      <div class="page-container">
        <header>
          <h1>Plano de Treino</h1>
          <p>${workout.name}</p>
        </header>
    `;
    
    Object.entries(groupedExercises).forEach(([group, exercises]) => {
      content += `<div class="muscle-group"><h2>${group}</h2>`;
      exercises.forEach(ex => {
        const detail = exerciseDetailMap[ex.name];
        content += `
          <div class="exercise-card">
            <div class="exercise-details">
              <strong>${ex.name}</strong>
              <p>Séries/Reps: <span>${ex.sets}x${ex.reps}</span></p>
              <p>Carga Atual: <span>${ex.currentLoad.toFixed(1)} kg</span></p>
            </div>
            ${detail ? `
            <div class="exercise-gif">
              <img src="${detail.gifUrl}" alt="Animação de ${ex.name}">
            </div>
            ` : ''}
          </div>
        `;
      });
      content += '</div>';
    });

    content += `
        <footer>
          Gerado por Marta's Dashboard
        </footer>
      </div>
    `;
    return content;
  };

  const handlePdfExport = () => {
    const htmlContent = generateHtmlContent();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Exportar Plano: ${workout.name}</title>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      
      printWindow.onload = function() {
        printWindow.focus();
        printWindow.print();
      };
    }
    onClose();
  };


  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-brand-surface rounded-xl shadow-lg p-6 w-full max-w-md mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-brand-text">Exportar Plano</h2>
          <button onClick={onClose} className="text-brand-subtle hover:text-brand-text text-2xl">&times;</button>
        </div>
        <p className="text-brand-subtle mb-6">Escolha o formato para exportar o plano "{workout.name}".</p>
        <div className="space-y-4">
          <button
            onClick={handleTextExport}
            className="w-full flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md transition-colors"
          >
            <i className="fas fa-file-alt"></i>
            <span>Exportar como Texto (.txt)</span>
          </button>
          <button
            onClick={handlePdfExport}
            className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-md transition-colors"
          >
            <i className="fas fa-file-pdf"></i>
            <span>Gerar PDF para Impressão</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportWorkoutModal;