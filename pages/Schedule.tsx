import React, { useState, useCallback, useMemo } from 'react';
import { useUserData } from '../hooks/useUserData';
import Card from '../components/Card';
import WorkoutCalendar from '../components/WorkoutCalendar';
import type { Workout } from '../types';

const DraggableWorkout: React.FC<{ workout: Workout }> = ({ workout }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('workout', JSON.stringify(workout));
  };
  
  const [main, sub] = useMemo(() => {
    const parts = workout.name.split('(');
    if (parts.length > 1) {
      return [parts[0].trim(), `(${parts.slice(1).join('(').trim()}`];
    }
    return [workout.name, ''];
  }, [workout.name]);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="p-3 bg-brand-surface dark:bg-brand-surface-dark rounded-lg cursor-grab hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
    >
      <p className="font-bold text-brand-text dark:text-brand-text-dark text-sm">{main}</p>
      {sub && <p className="text-xs text-brand-subtle dark:text-brand-subtle-dark mt-1">{sub}</p>}
    </div>
  );
};

const Schedule: React.FC = () => {
  const { data, updateCalendarDate } = useUserData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [animationClass, setAnimationClass] = useState('');

  const handleDateUpdate = useCallback((date: string, workoutId: string | null) => {
    updateCalendarDate(date, workoutId);
  }, [updateCalendarDate]);

  const handlePrevMonth = () => {
    setAnimationClass('animate-slideOutToRight');
    setTimeout(() => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
      setAnimationClass('animate-slideInFromLeft');
    }, 150);
  };

  const handleNextMonth = () => {
    setAnimationClass('animate-slideOutToLeft');
    setTimeout(() => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
      setAnimationClass('animate-slideInFromRight');
    }, 150);
  };
  
  const handleToday = () => {
    const today = new Date();
    if (today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear()) {
      return; // Already on the correct month
    }

    const isFuture = today > currentDate;
    setAnimationClass(isFuture ? 'animate-slideOutToLeft' : 'animate-slideOutToRight');
    setTimeout(() => {
      setCurrentDate(today);
      setAnimationClass(isFuture ? 'animate-slideInFromRight' : 'animate-slideInFromLeft');
    }, 150);
  };


  return (
    <div className="space-y-8">
      <style>{`
        @keyframes slideOutToLeft { from { transform: translateX(0); opacity: 1; } to { transform: translateX(-10%); opacity: 0; } }
        @keyframes slideInFromRight { from { transform: translateX(10%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOutToRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(10%); opacity: 0; } }
        @keyframes slideInFromLeft { from { transform: translateX(-10%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slideOutToLeft { animation: slideOutToLeft 0.15s ease-in forwards; }
        .animate-slideInFromRight { animation: slideInFromRight 0.15s ease-out forwards; }
        .animate-slideOutToRight { animation: slideOutToRight 0.15s ease-in forwards; }
        .animate-slideInFromLeft { animation: slideInFromLeft 0.15s ease-out forwards; }
      `}</style>
      <header>
        <h1 className="text-3xl font-bold text-brand-text dark:text-brand-text-dark">Agenda de Treinos</h1>
        <p className="text-brand-subtle dark:text-brand-subtle-dark mt-1">Planeie o seu mês arrastando e soltando os seus treinos.</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Card title={`${currentDate.toLocaleString('pt-BR', { month: 'long' })} de ${currentDate.getFullYear()}`} headerActions={
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                <button
                    onClick={handlePrevMonth}
                    className="px-3 py-1 text-sm rounded-l-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Mês anterior"
                >
                    &lt;
                </button>
                 <button
                    onClick={handleToday}
                    className="px-3 py-1 text-sm border-x border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                 >
                    Hoje
                 </button>
                <button
                    onClick={handleNextMonth}
                    className="px-3 py-1 text-sm rounded-r-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Próximo mês"
                >
                    &gt;
                </button>
            </div>
          }>
            <div className="overflow-hidden">
                <div className={animationClass}>
                    <WorkoutCalendar
                      year={currentDate.getFullYear()}
                      month={currentDate.getMonth()}
                      schedule={data.calendarSchedule}
                      workouts={data.workouts}
                      onDateChange={handleDateUpdate}
                    />
                </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card title="Meus Treinos" icon={<i className="fas fa-grip-vertical text-brand-subtle"></i>}>
            <p className="text-xs text-brand-subtle mb-4 -mt-2">Arraste um treino para o calendário.</p>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {data.workouts.map(workout => (
                <DraggableWorkout key={workout.id} workout={workout} />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Schedule;