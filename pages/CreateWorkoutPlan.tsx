import React, { useState, useMemo, useEffect } from 'react';
import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';
import Card from '../components/Card';
import type { ExerciseDetail, Workout } from '../types';
import { triggerVibration } from '../utils/haptics';
import { useDebounce } from '../hooks/useDebounce';

type SelectedExercise = {
  id?: string;
  name: string;
  group: string;
  sets: number;
  reps: string;
  currentLoad: number;
};

interface CreateWorkoutPlanProps {
  onSave: (workout: { id?: string; name: string; intensity: number; exercises: SelectedExercise[] }) => void;
  onCancel: () => void;
  initialData?: Workout | null;
}

const StarRatingInput: React.FC<{ rating: number; setRating: (rating: number) => void }> = ({ rating, setRating }) => (
    <div className="flex items-center gap-2">
      {[...Array(5)].map((_, i) => (
        <button key={i} onClick={() => setRating(i + 1)} type="button" className="text-3xl text-yellow-400 focus:outline-none transition-transform transform hover:scale-110">
          <i className={`fa-star ${i < rating ? 'fas' : 'far text-gray-300'}`}></i>
        </button>
      ))}
    </div>
  );

const CreateWorkoutPlan: React.FC<CreateWorkoutPlanProps> = ({ onSave, onCancel, initialData }) => {
  const isEditing = !!initialData;
  
  const [workoutName, setWorkoutName] = useState(initialData?.name.replace(/^🔥\s*/, '') || '');
  const [intensity, setIntensity] = useState(initialData?.intensity || 3);
  const [workoutNameError, setWorkoutNameError] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>(
      initialData?.exercises.map(ex => ({ 
          id: ex.id, 
          name: ex.name, 
          group: ex.group, 
          sets: ex.sets,
          reps: ex.reps,
          currentLoad: ex.currentLoad 
        })) || []
    );
  const [exerciseErrors, setExerciseErrors] = useState<Array<{ sets?: string; reps?: string; currentLoad?: string }>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Drag and Drop State
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  useEffect(() => {
    // Sync errors array with exercises array
    if (selectedExercises.length !== exerciseErrors.length) {
        setExerciseErrors(Array(selectedExercises.length).fill({}));
    }
  }, [selectedExercises.length, exerciseErrors.length]);

  const handleAddExercise = (exercise: ExerciseDetail, group: string) => {
    if (!selectedExercises.some(e => e.name === exercise.name)) {
      setSelectedExercises(prev => [...prev, { name: exercise.name, group, sets: 3, reps: '12', currentLoad: 0 }]);
    }
  };

  const handleRemoveExercise = (index: number) => {
    setSelectedExercises(prev => prev.filter((_, i) => i !== index));
    setExerciseErrors(prev => prev.filter((_, i) => i !== index));
  };

  const handleExerciseChange = (index: number, field: 'sets' | 'reps' | 'currentLoad', value: string) => {
    const newExercises = [...selectedExercises];
    const newErrors = [...exerciseErrors];
    if (!newErrors[index]) newErrors[index] = {};

    const exerciseToUpdate = { ...newExercises[index] };
    
    if (field === 'currentLoad' || field === 'sets') {
        const numValue = field === 'sets' ? parseInt(value, 10) : parseFloat(value);
        exerciseToUpdate[field] = isNaN(numValue) ? 0 : numValue;
        
        if (value.trim() !== '' && (isNaN(numValue) || numValue < 0)) {
            newErrors[index][field] = 'Inválido';
        } else if (field === 'sets' && numValue <= 0) {
            newErrors[index][field] = '> 0';
        }
        else {
            delete newErrors[index][field];
        }
    } else { // reps
        exerciseToUpdate[field] = value;
         if (!value.trim()) {
            newErrors[index].reps = 'Obrigatório';
        } else {
            delete newErrors[index].reps;
        }
    }
    
    newExercises[index] = exerciseToUpdate;
    setSelectedExercises(newExercises);
    setExerciseErrors(newErrors);
  };
  
  const handleWorkoutNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setWorkoutName(name);
    if (!name.trim()) {
        setWorkoutNameError('O nome do plano é obrigatório.');
    } else {
        setWorkoutNameError('');
    }
  };

  const filteredLibrary = useMemo(() => {
    if (!debouncedSearchTerm) {
      return EXERCISE_LIBRARY;
    }
    const lowercasedFilter = debouncedSearchTerm.toLowerCase();
    const filtered: { [group: string]: ExerciseDetail[] } = {};

    for (const group in EXERCISE_LIBRARY) {
      const exercises = EXERCISE_LIBRARY[group].filter(ex =>
        ex.name.toLowerCase().includes(lowercasedFilter)
      );
      if (exercises.length > 0) {
        filtered[group] = exercises;
      }
    }
    return filtered;
  }, [debouncedSearchTerm]);

  const hasErrors = useMemo(() => {
    if (workoutNameError) return true;
    return exerciseErrors.some(e => e && (e.sets || e.reps || e.currentLoad));
  }, [workoutNameError, exerciseErrors]);

  const handleSave = () => {
    handleWorkoutNameChange({ target: { value: workoutName } } as any);

    if (!workoutName.trim() || selectedExercises.length === 0 || hasErrors) {
      alert('Por favor, dê um nome ao plano, adicione pelo menos um exercício e corrija todos os erros antes de salvar.');
      return;
    }
    const finalWorkoutName = `🔥 ${workoutName}`;
    onSave({ id: initialData?.id, name: finalWorkoutName, exercises: selectedExercises, intensity });
    triggerVibration();
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("exerciseIndex", index.toString());
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (index !== dragOverIndex) {
      setDragOverIndex(index);
    }
  };
  
  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const draggedItemIndex = parseInt(e.dataTransfer.getData("exerciseIndex"), 10);
    
    if (draggedItemIndex === dropIndex) return;

    const newExercises = [...selectedExercises];
    const [draggedItem] = newExercises.splice(draggedItemIndex, 1);
    newExercises.splice(dropIndex, 0, draggedItem);
    
    setSelectedExercises(newExercises);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };
  
  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{isEditing ? 'Editar Plano de Treino' : 'Criar Novo Plano de Treino'}</h1>
        <div className="flex gap-2">
            <button onClick={onCancel} className="bg-brand-subtle/20 text-brand-subtle font-bold py-2 px-4 rounded-lg hover:bg-brand-subtle/30 transition-colors">
            Cancelar
            </button>
            <button onClick={handleSave} disabled={hasErrors} className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary transition-colors disabled:bg-brand-subtle disabled:cursor-not-allowed">
            {isEditing ? 'Salvar Alterações' : 'Salvar Plano'}
            </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Coluna da Biblioteca de Exercícios */}
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-brand-text">1. Adicionar Exercícios</h2>
            <input
                type="text"
                placeholder="Pesquisar exercício..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full p-3 bg-brand-background border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
            <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
            {Object.keys(filteredLibrary).length > 0 ? (
                // FIX: Use Object.keys and explicit lookup to help TypeScript infer the correct type for `exercises`.
                Object.keys(filteredLibrary).map((group) => {
                    const exercises = filteredLibrary[group];
                    return (
                        <Card key={group} title={group}>
                            <div className="space-y-2">
                            {exercises.map(ex => (
                                <div key={ex.name} className="flex justify-between items-center p-2 bg-brand-background rounded-md">
                                    <span className="font-medium">{ex.name}</span>
                                    <button onClick={() => handleAddExercise(ex, group)} className="text-brand-primary hover:text-brand-secondary text-2xl">
                                        <i className="fas fa-plus-circle"></i>
                                    </button>
                                </div>
                            ))}
                            </div>
                        </Card>
                    );
                })
            ) : (
                <div className="text-center py-10 text-brand-subtle">
                    <i className="fas fa-search text-3xl mb-3"></i>
                    <p>Nenhum exercício encontrado para "<span className="font-semibold text-brand-text">{debouncedSearchTerm}</span>".</p>
                    <p className="text-sm">Tente um termo de pesquisa diferente.</p>
                </div>
            )}
            </div>
        </div>

        {/* Coluna do Plano Atual */}
        <div className="space-y-4">
             <h2 className="text-xl font-bold text-brand-text">2. Montar o Plano</h2>
            <Card title="Detalhes do Plano" icon={<i className="fas fa-tasks"></i>}>
                <div className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Nome do Plano (Ex: Treino D - Peito)"
                            value={workoutName}
                            onChange={handleWorkoutNameChange}
                            className={`w-full p-3 bg-brand-background border rounded-md focus:outline-none focus:ring-2 ${workoutNameError ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-brand-primary'}`}
                            aria-invalid={!!workoutNameError}
                            aria-describedby="workout-name-error"
                        />
                        {workoutNameError && <p id="workout-name-error" className="text-red-500 text-sm mt-1">{workoutNameError}</p>}
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-brand-text dark:text-brand-text-dark mb-2">Intensidade do Treino</label>
                        <StarRatingInput rating={intensity} setRating={setIntensity} />
                    </div>
                    <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                        {selectedExercises.length > 0 ? (
                            selectedExercises.map((ex, index) => (
                            <div 
                                key={ex.id || index} 
                                className={`flex flex-col p-3 bg-brand-background rounded-md gap-2 transition-all duration-300 ease-in-out
                                  ${draggedIndex === index
                                    ? 'opacity-60 bg-brand-surface shadow-2xl scale-105'
                                    : dragOverIndex === index && draggedIndex !== index
                                      ? 'border-t-4 border-brand-primary'
                                      : 'border border-gray-200'
                                  }
                                `}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, index)}
                                onDragEnd={handleDragEnd}
                            >
                                <div className="flex items-center w-full">
                                    <span className="cursor-grab text-brand-subtle pr-2" title="Arrastar para reordenar">
                                        <i className="fas fa-grip-vertical"></i>
                                    </span>
                                    <div className="flex-1">
                                        <p className="font-bold">{ex.name}</p>
                                        <p className="text-xs text-brand-subtle">{ex.group}</p>
                                    </div>
                                    <button onClick={() => handleRemoveExercise(index)} className="text-red-500 hover:text-red-600">
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                                <div className="grid grid-cols-3 items-start gap-2 pl-6 w-full">
                                    <div className="flex-1">
                                        <label className="text-xs text-brand-subtle block text-center mb-1">Séries</label>
                                        <input
                                            type="number"
                                            value={ex.sets}
                                            onChange={e => handleExerciseChange(index, 'sets', e.target.value)}
                                            className={`w-full bg-white text-center p-1 rounded-md border focus:outline-none focus:ring-2 ${exerciseErrors[index]?.sets ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-brand-primary'}`}
                                            placeholder="Séries"
                                        />
                                        {exerciseErrors[index]?.sets && <p className="text-red-500 text-xs mt-1 text-center">{exerciseErrors[index].sets}</p>}
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs text-brand-subtle block text-center mb-1">Reps</label>
                                        <input
                                            type="text"
                                            value={ex.reps}
                                            onChange={e => handleExerciseChange(index, 'reps', e.target.value)}
                                            className={`w-full bg-white text-center p-1 rounded-md border focus:outline-none focus:ring-2 ${exerciseErrors[index]?.reps ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-brand-primary'}`}
                                            placeholder="Ex: 10-12"
                                        />
                                        {exerciseErrors[index]?.reps && <p className="text-red-500 text-xs mt-1 text-center">{exerciseErrors[index].reps}</p>}
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs text-brand-subtle block text-center mb-1">Carga (kg)</label>
                                        <input
                                            type="number"
                                            value={ex.currentLoad}
                                            onChange={e => handleExerciseChange(index, 'currentLoad', e.target.value)}
                                            className={`w-full bg-white text-center p-1 rounded-md border focus:outline-none focus:ring-2 ${exerciseErrors[index]?.currentLoad ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-brand-primary'}`}
                                            placeholder="Carga (kg)"
                                        />
                                        {exerciseErrors[index]?.currentLoad && <p className="text-red-500 text-xs mt-1 text-center">{exerciseErrors[index].currentLoad}</p>}
                                    </div>
                                </div>
                            </div>
                            ))
                        ) : (
                            <p className="text-center text-brand-subtle py-8">Adicione exercícios da lista à esquerda para começar a montar o seu plano.</p>
                        )}
                    </div>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkoutPlan;
