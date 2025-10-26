import React, { useState } from 'react';
import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';
import Card from '../components/Card';
import ExerciseDetailModal from '../components/ExerciseDetailModal';
import type { ExerciseDetail } from '../types';
import MuscleGroupIcon from '../components/MuscleGroupIcon';

const ExerciseLibrary: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDetail | null>(null);

  const handleSelectExercise = (exercise: ExerciseDetail) => {
    setSelectedExercise(exercise);
  };

  const handleCloseModal = () => {
    setSelectedExercise(null);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-brand-text dark:text-brand-text-dark">Biblioteca de Exercícios</h1>
        <p className="text-brand-subtle dark:text-brand-subtle-dark mt-1">Consulte a execução correta dos movimentos.</p>
      </header>

      {Object.entries(EXERCISE_LIBRARY).map(([group, exercises]) => (
        <Card key={group} title={group} icon={<MuscleGroupIcon group={group} />}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {exercises.map(ex => (
              <button
                key={ex.name}
                onClick={() => handleSelectExercise(ex)}
                className="relative group aspect-video rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary focus:ring-opacity-50"
                style={{
                    backgroundImage: `url(${ex.gifUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
                aria-label={`Ver detalhes de ${ex.name}`}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 transition-all duration-300 group-hover:from-black/70 group-hover:via-black/30 group-hover:to-transparent"></div>
                
                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-4 text-white">
                    <h4 className="font-bold text-base leading-tight drop-shadow-md text-left">{ex.name}</h4>
                    {/* Play Icon on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/30 backdrop-blur-sm rounded-full w-14 h-14 flex items-center justify-center">
                            <i className="fas fa-play text-white text-xl ml-1"></i>
                        </div>
                    </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      ))}

      <ExerciseDetailModal
        exercise={selectedExercise}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ExerciseLibrary;
