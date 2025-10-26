import React, { useState, useEffect, useRef } from 'react';
import type { Workout } from '../types';
import WorkoutSummary from './WorkoutSummary';
import { getWorkoutAdvice } from '../services/geminiService';
import { triggerVibration } from '../utils/haptics';
import { useUserData } from '../hooks/useUserData';

const REST_DURATION_SECONDS = 60;

// --- Helper Functions ---
const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

// --- Main Component ---
interface LiveWorkoutProps {
  workout: Workout;
  onFinish: () => void;
}

const LiveWorkout: React.FC<LiveWorkoutProps> = ({ workout, onFinish }) => {
  // --- State Management ---
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState(0);
  const [status, setStatus] = useState<'exercising' | 'resting' | 'feedback' | 'summary'>('exercising');
  const [restTimer, setRestTimer] = useState(0);
  const [totalTimer, setTotalTimer] = useState(0);
  const [feedbackData, setFeedbackData] = useState<Map<string, { feedback: 'Fácil' | 'Ideal' | 'Difícil'; advice: string | null }>>(new Map());
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState<'finish' | 'restart' | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<'restart' | 'finish' | null>(null);
  
  const { updateExerciseLoad } = useUserData();
  const timerIdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- Derived State ---
  const currentExercise = workout.exercises[exerciseIndex];
  if (!currentExercise) {
    return <WorkoutSummary workout={workout} elapsedTime={totalTimer} completedExercises={new Set(feedbackData.keys())} onClose={onFinish} />;
  }
  const totalSets = parseInt(currentExercise.setsReps.split('x')[0] || '1', 10);
  
  // --- Centralized Timer Management ---
  useEffect(() => {
    // Limpa timer anterior
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }

    // Só inicia timer se não houver ação bloqueante e status for correto
    if (!isActionLoading && (status === 'exercising' || status === 'resting')) {
      timerIdRef.current = setInterval(() => {
        setTotalTimer(t => t + 1);

        if (status === 'resting') {
          setRestTimer(r => {
            if (r <= 1) {
              setStatus('exercising');
              triggerVibration([100, 50, 100]);
              return 0;
            }
            return r - 1;
          });
        }
      }, 1000);
    }

    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
      }
    };
  }, [status, isActionLoading]);


  // --- Event Handlers ---

  const handleMainAction = () => {
    if (status === 'exercising') {
      const newCompletedSets = completedSets + 1;
      setCompletedSets(newCompletedSets);
      triggerVibration(50);

      if (newCompletedSets < totalSets) {
        setStatus('resting');
        setRestTimer(REST_DURATION_SECONDS);
      } else {
        setStatus('feedback');
      }
    }
  };

  const handleFeedback = async (feedback: 'Fácil' | 'Ideal' | 'Difícil') => {
    setIsAiLoading(true);
    setFeedbackData(prev => new Map(prev).set(currentExercise.id, { feedback, advice: null }));

    let newLoad = currentExercise.currentLoad;
    const loadIncrement = 2.5;
    if (feedback === 'Fácil') {
        newLoad += loadIncrement;
    } else if (feedback === 'Difícil' && newLoad > 0) {
        newLoad = Math.max(0, newLoad - loadIncrement);
    }
    if (newLoad !== currentExercise.currentLoad) {
        updateExerciseLoad(workout.id, currentExercise.id, newLoad);
    }

    try {
        const advice = await getWorkoutAdvice(workout, currentExercise, feedback);
        setFeedbackData(prev => new Map(prev).set(currentExercise.id, { feedback, advice }));
    } catch (error) {
        const fallbackAdvice = "Boa! Continue focado(a) no seu objetivo. Lembre-se de manter a boa forma.";
        setFeedbackData(prev => new Map(prev).set(currentExercise.id, { feedback, advice: fallbackAdvice }));
    } finally {
        setIsAiLoading(false);
    }
  };

  const handleNextExercise = () => {
    if (exerciseIndex < workout.exercises.length - 1) {
      setExerciseIndex(prev => prev + 1);
      setCompletedSets(0);
      setStatus('exercising');
    } else {
      setStatus('summary');
    }
  };
  
  const handlePrevExercise = () => {
    if (exerciseIndex > 0) {
        setExerciseIndex(prev => prev - 1);
        setCompletedSets(0);
        setStatus('exercising');
    }
  }
  
  const handleRestartWorkout = () => {
    setShowConfirmModal('restart');
  };
  
  const confirmRestart = () => {
    setShowConfirmModal(null);
    setIsActionLoading('restart');
    
    // Para o timer
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
    
    // Reseta todos os estados
    setExerciseIndex(0);
    setCompletedSets(0);
    setRestTimer(0);
    setTotalTimer(0);
    setFeedbackData(new Map());
    setStatus('exercising');
    
    setTimeout(() => {
        setIsActionLoading(null);
    }, 300);
  };
  
  const handleFinishWorkout = () => {
    setShowConfirmModal('finish');
  };
  
  const confirmFinish = () => {
    setShowConfirmModal(null);
    setIsActionLoading('finish');
    
    // Para o timer
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
    
    setTimeout(() => {
        setStatus('summary');
        setIsActionLoading(null);
    }, 300);
  };

  const handleSkipRest = () => {
    if (status === 'resting') {
        setStatus('exercising');
        triggerVibration(30);
    }
  };

  // --- Button & Content Logic ---

  const getButtonContent = () => {
    if (status === 'exercising') {
      return `Completar ${completedSets + 1}ª Série`;
    }
    if (status === 'resting') {
      return (
        <div className="flex items-center justify-center">
          <i className="fas fa-hourglass-half mr-3 animate-spin"></i>
          <span>Descansar: {formatTime(restTimer)}</span>
        </div>
      );
    }
    return '';
  };
  
  // --- Render Logic ---

  if (status === 'summary') {
    return <WorkoutSummary workout={workout} elapsedTime={totalTimer} completedExercises={new Set(feedbackData.keys())} onClose={onFinish} />;
  }

  const exerciseFeedback = feedbackData.get(currentExercise.id);

  return (
     <div className="space-y-6">
       <style>{`
        @keyframes slide-in { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-in { animation: slide-in 0.4s ease-out forwards; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}</style>
      
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowConfirmModal(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm mx-4 shadow-2xl animate-slide-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4 text-brand-text dark:text-brand-text-dark">
              {showConfirmModal === 'restart' ? '🔄 Reiniciar Treino?' : '🏁 Finalizar Treino?'}
            </h3>
            <p className="text-brand-subtle mb-6">
              {showConfirmModal === 'restart' 
                ? 'Tem a certeza de que deseja reiniciar o treino? O seu progresso será perdido.' 
                : 'Tem a certeza que deseja finalizar o treino agora?'}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirmModal(null)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={showConfirmModal === 'restart' ? confirmRestart : confirmFinish}
                className={`flex-1 font-semibold py-3 rounded-lg transition-colors ${
                  showConfirmModal === 'restart' 
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {showConfirmModal === 'restart' ? 'Sim, Reiniciar' : 'Sim, Finalizar'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-text dark:text-brand-text-dark">{workout.name}</h1>
          <p className="text-brand-primary">Exercício {exerciseIndex + 1} de {workout.exercises.length}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-mono text-brand-text dark:text-brand-text-dark">{formatTime(totalTimer)}</p>
        </div>
      </header>

      <div key={currentExercise.id} className="bg-brand-surface dark:bg-brand-surface-dark p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 animate-slide-in flex flex-col justify-between" style={{ minHeight: '60vh' }}>
        {/* Exercise Info */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold my-2 text-brand-text dark:text-brand-text-dark">{currentExercise.name}</h2>
          <div className="flex items-center justify-center gap-4 text-lg">
            <span className="text-brand-primary font-semibold">{currentExercise.setsReps}</span>
            <span className="text-brand-subtle">@</span>
            <span className="text-brand-primary font-semibold">{currentExercise.currentLoad.toFixed(1)} kg</span>
          </div>
        </div>
        
         {/* Progress Dots */}
        <div className="flex justify-center gap-3 my-4">
          {[...Array(totalSets)].map((_, i) => (
            <div key={i} className={`w-4 h-4 rounded-full transition-colors duration-300 ${i < completedSets ? 'bg-brand-primary' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
          ))}
        </div>

        {/* Main Interaction Area */}
        <div className="flex-grow flex flex-col items-center justify-center">
          {status === 'feedback' ? (
            <div className="w-full max-w-md text-center animate-slide-in">
              {!exerciseFeedback ? (
                <>
                  <p className="font-semibold mb-3 text-lg">Como sentiu a última série?</p>
                  <div className="flex justify-center gap-3">
                    {(['Fácil', 'Ideal', 'Difícil'] as const).map(f => (
                      <button key={f} onClick={() => handleFeedback(f)} className="flex-1 bg-brand-surface dark:bg-brand-surface-dark border-2 border-brand-primary/50 text-brand-primary font-semibold py-3 px-4 rounded-lg hover:bg-brand-primary/10 transition-colors">
                        {f}
                      </button>
                    ))}
                  </div>
                </>
              ) : isAiLoading || !exerciseFeedback.advice ? (
                <div className="mt-3 flex items-center justify-center gap-2 text-sm text-brand-subtle">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-primary"></div>
                  <span>Coach IA a analisar...</span>
                </div>
              ) : (
                <div className="p-4 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-lg text-brand-text dark:text-brand-text-dark">
                  <p className="font-semibold text-center"><i className="fas fa-robot mr-2"></i>Dica do Coach IA</p>
                  <p className="text-center text-sm mt-1 mb-4">{exerciseFeedback.advice}</p>
                  <button onClick={handleNextExercise} className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white font-bold py-3 rounded-lg transition-colors">
                    {exerciseIndex === workout.exercises.length - 1 ? 'Finalizar Treino' : 'Próximo Exercício'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={handleMainAction}
                disabled={status === 'resting'}
                className="w-full max-w-sm bg-brand-primary text-white font-bold text-2xl py-8 px-4 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:bg-brand-subtle disabled:cursor-not-allowed disabled:scale-100"
              >
                {getButtonContent()}
              </button>
              {status === 'resting' && (
                <button 
                  onClick={handleSkipRest} 
                  className="mt-6 bg-brand-surface dark:bg-brand-surface-dark border border-brand-primary/30 text-brand-primary font-semibold py-2 px-6 rounded-lg hover:bg-brand-primary/10 transition-colors flex items-center gap-2"
                >
                  Pular Descanso <i className="fas fa-forward"></i>
                </button>
              )}
            </>
          )}
        </div>
        
        {/* Navigation Arrows */}
        <div className="flex justify-between items-center mt-6">
            <button onClick={handlePrevExercise} disabled={exerciseIndex === 0 || isActionLoading !== null} className="p-3 text-brand-subtle hover:text-brand-primary disabled:opacity-30 disabled:cursor-not-allowed">
                <i className="fas fa-chevron-left fa-2x"></i>
            </button>
            <button onClick={handleNextExercise} disabled={isActionLoading !== null || (exerciseIndex === workout.exercises.length - 1 && status !== 'feedback')} className="p-3 text-brand-subtle hover:text-brand-primary disabled:opacity-30 disabled:cursor-not-allowed">
                <i className="fas fa-chevron-right fa-2x"></i>
            </button>
        </div>
      </div>

       {/* Bottom Controls */}
      <div className="flex justify-center gap-4">
        <button
            onClick={handleRestartWorkout}
            disabled={isActionLoading !== null}
            className="bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 font-bold py-2 px-4 rounded-lg text-sm hover:bg-yellow-200 dark:hover:bg-yellow-900/60 flex items-center justify-center gap-2 min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isActionLoading === 'restart' ? (
                <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    <span>A reiniciar...</span>
                </>
            ) : (
                <>
                    <i className="fas fa-sync-alt"></i> Reiniciar
                </>
            )}
        </button>
        <button
            onClick={handleFinishWorkout}
            disabled={isActionLoading !== null}
            className="bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 font-bold py-2 px-4 rounded-lg text-sm hover:bg-red-200 dark:hover:bg-red-900/60 flex items-center justify-center gap-2 min-w-[160px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isActionLoading === 'finish' ? (
                <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    <span>A finalizar...</span>
                </>
            ) : (
                <>
                    <i className="fas fa-flag-checkered"></i> Finalizar Treino
                </>
            )}
        </button>
      </div>

    </div>
  );
};

export default LiveWorkout;