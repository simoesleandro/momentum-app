import React, { useState, useMemo, useCallback } from 'react';
import { useUserData } from '../hooks/useUserData';
import type { Workout, Exercise, ExerciseDetail } from '../types';
import ExerciseDetailModal from '../components/ExerciseDetailModal';
import CreateWorkoutPlan from './CreateWorkoutPlan';
import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';
import ExportWorkoutModal from '../components/ExportWorkoutModal';
import LiveWorkout from '../components/LiveWorkout';
import MuscleGroupIcon from '../components/MuscleGroupIcon';

interface WorkoutContentsProps {
  workout: Workout;
}

const WorkoutContents: React.FC<WorkoutContentsProps> = ({ workout }) => {
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState<ExerciseDetail | null>(null);

  const exerciseDetailMap = useMemo(() => {
    const map: { [key: string]: ExerciseDetail } = {};
    Object.values(EXERCISE_LIBRARY).flat().forEach(exDetail => {
      map[exDetail.name] = exDetail;
    });
    return map;
  }, []);

  const handleExerciseClick = (exerciseName: string) => {
    const detail = exerciseDetailMap[exerciseName];
    if (detail) {
      setSelectedExerciseForModal(detail);
    }
  };
  
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

  return (
    <>
      <div className="space-y-6">
        {Object.entries(groupedExercises).map(([group, exercises]) => (
          <div key={group}>
            <h4 className="text-md font-bold text-brand-primary mb-3 pb-2 border-b border-brand-primary/20">
              {group}
            </h4>
            <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
              {exercises.map((ex) => (
                <li key={ex.id} className="flex items-center justify-between py-4 space-x-4">
                  <div className="min-w-0">
                    <p className="font-medium text-brand-text dark:text-brand-text-dark flex items-center gap-3">
                      <MuscleGroupIcon group={ex.group} className="text-brand-subtle text-lg w-5 text-center" />
                      <span>{ex.name}</span>
                       <span className="relative group">
                          <button 
                            onClick={() => handleExerciseClick(ex.name)}
                            className="text-brand-subtle dark:text-brand-subtle-dark hover:text-brand-primary transition-colors text-sm"
                            aria-label={`Ver execução de ${ex.name}`}
                          >
                            <i className="fas fa-info-circle"></i>
                          </button>
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max px-2 py-1 bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                              Ver Execução
                          </span>
                      </span>
                    </p>
                    <p className="text-sm text-brand-subtle dark:text-brand-subtle-dark ml-8">{ex.setsReps}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-lg font-bold text-brand-primary">
                      {ex.currentLoad.toFixed(1)}<span className="text-sm font-normal text-brand-subtle dark:text-brand-subtle-dark"> kg</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {selectedExerciseForModal && (
        <ExerciseDetailModal
          exercise={selectedExerciseForModal}
          onClose={() => setSelectedExerciseForModal(null)}
        />
      )}
    </>
  );
};

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center gap-1 text-yellow-400 mt-1" aria-label={`Intensidade: ${rating} de 5 estrelas`}>
      {[...Array(5)].map((_, i) => (
        <i key={i} className={`fa-star ${i < rating ? 'fas' : 'far text-gray-300'}`}></i>
      ))}
    </div>
  );
};

const WorkoutPlan: React.FC = () => {
  const { data, addWorkout, updateWorkout, deleteWorkout, addAttendance } = useUserData();
  const [isCreating, setIsCreating] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [exportingWorkout, setExportingWorkout] = useState<Workout | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);

  const handleSaveWorkout = (workout: Parameters<typeof addWorkout>[0]) => {
    addWorkout(workout);
    setIsCreating(false);
  };
  
  const handleUpdateWorkout = (workout: Parameters<typeof updateWorkout>[0]) => {
    updateWorkout(workout);
    setEditingWorkout(null);
  };
  
  const handleDeleteWorkout = (workoutId: string, workoutName: string) => {
      if (window.confirm(`Tem a certeza que deseja eliminar o plano "${workoutName}"? Esta ação não pode ser revertida.`)) {
          deleteWorkout(workoutId);
      }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingWorkout(null);
  }

  const handleFinishWorkout = useCallback(() => {
    addAttendance();
    setActiveWorkout(null);
  }, [addAttendance]);

  if (activeWorkout) {
    return <LiveWorkout workout={activeWorkout} onFinish={handleFinishWorkout} />;
  }

  if (isCreating || editingWorkout) {
    return <CreateWorkoutPlan 
      onSave={(workoutData) => {
        if ('id' in workoutData && workoutData.id) {
          handleUpdateWorkout(workoutData as Parameters<typeof updateWorkout>[0]);
        } else {
          handleSaveWorkout(workoutData as Parameters<typeof addWorkout>[0]);
        }
      }} 
      onCancel={handleCancel}
      initialData={editingWorkout} 
    />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Plano de Treino</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-brand-primary-dark transition-colors flex items-center gap-2"
        >
          <i className="fas fa-plus-circle"></i>
          Criar Novo Plano
        </button>
      </div>
      {data.workouts.map((workout) => (
        <div key={workout.id} className="bg-brand-surface dark:bg-brand-surface-dark rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-brand-text dark:text-brand-text-dark">{workout.name}</h2>
                  {workout.intensity > 0 && <StarRating rating={workout.intensity} />}
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <button
                            onClick={() => setActiveWorkout(workout)}
                            className="text-green-500 hover:text-green-600 transition-colors p-1 text-2xl"
                            aria-label={`Iniciar treino ${workout.name}`}
                        >
                            <i className="fas fa-play-circle"></i>
                        </button>
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Iniciar Treino
                        </span>
                    </div>
                    <div className="relative group">
                        <button
                            onClick={() => setExportingWorkout(workout)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
                            aria-label={`Exportar plano ${workout.name}`}
                        >
                            <i className="fas fa-file-export"></i>
                        </button>
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Exportar Plano
                        </span>
                    </div>
                    <div className="relative group">
                        <button
                            onClick={() => setEditingWorkout(workout)}
                            className="text-blue-400 hover:text-blue-600 transition-colors p-1"
                            aria-label={`Editar plano ${workout.name}`}
                        >
                            <i className="fas fa-edit"></i>
                        </button>
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Editar Plano
                        </span>
                    </div>
                    <div className="relative group">
                        <button 
                            onClick={() => handleDeleteWorkout(workout.id, workout.name)}
                            className="text-red-400 hover:text-red-600 transition-colors p-1"
                            aria-label={`Eliminar plano ${workout.name}`}
                        >
                            <i className="fas fa-trash-alt"></i>
                        </button>
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Eliminar Plano
                        </span>
                    </div>
                </div>
            </div>
            <WorkoutContents workout={workout} />
        </div>
      ))}

      {exportingWorkout && (
        <ExportWorkoutModal
          workout={exportingWorkout}
          onClose={() => setExportingWorkout(null)}
        />
      )}
    </div>
  );
};

export default WorkoutPlan;