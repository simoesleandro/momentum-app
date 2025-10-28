import React from 'react';
import type { Workout } from '../types';
import { useUserData } from '../hooks/useUserData';
import Card from './Card';

interface WorkoutSummaryProps {
  workout: Workout;
  elapsedTime: number;
  completedExercises: Set<string>;
  onClose: () => void;
}

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const WorkoutSummary: React.FC<WorkoutSummaryProps> = ({ workout, elapsedTime, completedExercises, onClose }) => {
  const { data } = useUserData();

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center animate-fadeIn">
        {/* Add a custom style tag for the animation */}
        <style>{`
          .checkmark__circle {
            stroke-dasharray: 166;
            stroke-dashoffset: 166;
            stroke-width: 2;
            stroke-miterlimit: 10;
            stroke: #7ac142;
            fill: none;
            animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
          }
          .checkmark {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            display: block;
            stroke-width: 2;
            stroke: #fff;
            stroke-miterlimit: 10;
            margin: 10% auto;
            box-shadow: inset 0px 0px 0px #7ac142;
            animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
          }
          .checkmark__check {
            transform-origin: 50% 50%;
            stroke-dasharray: 48;
            stroke-dashoffset: 48;
            animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
          }
          @keyframes stroke {
            100% {
              stroke-dashoffset: 0;
            }
          }
          @keyframes scale {
            0%, 100% {
              transform: none;
            }
            50% {
              transform: scale3d(1.1, 1.1, 1);
            }
          }
          @keyframes fill {
            100% {
              box-shadow: inset 0px 0px 0px 45px #7ac142;
            }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
        `}</style>
        
        <div className="mb-4">
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
        </div>
      
        <h1 className="text-4xl font-bold text-brand-text dark:text-brand-text-dark mb-2">Treino Concluído!</h1>
        <p className="text-lg text-brand-subtle mb-8">Excelente trabalho, {data.userName.split(' ')[0]}! Você completou o treino {workout.name}.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mb-8">
            <Card title="Tempo Total" icon={<i className="fas fa-clock"></i>}>
                <p className="text-3xl font-bold text-brand-primary">{formatTime(elapsedTime)}</p>
            </Card>
            <Card title="Exercícios Completos" icon={<i className="fas fa-dumbbell"></i>}>
                <p className="text-3xl font-bold text-brand-primary">
                    {completedExercises.size} / {workout.exercises.length}
                </p>
            </Card>
        </div>
        
        <Card title="Resumo dos Exercícios" className="w-full max-w-2xl">
            <ul className="space-y-3 text-left max-h-60 overflow-y-auto pr-2">
                {workout.exercises.map(ex => {
                    const isCompleted = completedExercises.has(ex.id);
                    return (
                        <li key={ex.id} className="flex items-center justify-between p-3 bg-brand-background dark:bg-brand-background-dark/50 rounded-md">
                            <div>
                                <p className={`font-medium ${!isCompleted ? 'text-brand-subtle' : 'text-brand-text dark:text-brand-text-dark'}`}>{ex.name}</p>
                                <p className="text-sm text-brand-subtle">{ex.sets}x{ex.reps} @ {ex.currentLoad.toFixed(1)} kg</p>
                            </div>
                            {isCompleted ? (
                                <i className="fas fa-check-circle text-green-500 text-xl"></i>
                            ) : (
                                <i className="fas fa-times-circle text-red-400 text-xl"></i>
                            )}
                        </li>
                    )
                })}
            </ul>
        </Card>

        <button 
            onClick={onClose}
            className="mt-10 bg-brand-primary text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg hover:bg-brand-primary-dark transition-colors"
        >
            Voltar ao Plano de Treino
        </button>
    </div>
  );
};

export default WorkoutSummary;