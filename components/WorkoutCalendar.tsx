import React, { useState } from 'react';
import type { Workout } from '../types';

interface WorkoutCalendarProps {
  year: number;
  month: number;
  schedule: { [date: string]: string | null };
  workouts: Workout[];
  onDateChange: (date: string, workoutId: string | null) => void;
}

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const formatDate = (d: Date): string => d.toISOString().split('T')[0];

const WorkoutCalendar: React.FC<WorkoutCalendarProps> = ({ year, month, schedule, workouts, onDateChange }) => {
  const [dragOverDay, setDragOverDay] = useState<string | null>(null);

  const getMonthDays = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const daysInMonth = getMonthDays(year, month);
  const firstDayOfMonth = daysInMonth[0]?.getDay() || 0;

  const workoutMap = workouts.reduce((acc, w) => {
    acc[w.id] = w;
    return acc;
  }, {} as { [id: string]: Workout });

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, day: Date) => {
    e.preventDefault();
    const targetDateStr = formatDate(day);
    setDragOverDay(null);

    const workoutData = e.dataTransfer.getData('workout');
    const workoutFromDayData = e.dataTransfer.getData('workoutFromDay');

    if (workoutData) { // Dropped from the list on the side
      const workout: Workout = JSON.parse(workoutData);
      onDateChange(targetDateStr, workout.id);
    } else if (workoutFromDayData) { // Dragged from another day in the calendar
      const { workoutId, fromDateStr } = JSON.parse(workoutFromDayData);
      if (fromDateStr !== targetDateStr) {
        // Move requires two updates: remove from old, add to new
        onDateChange(fromDateStr, null); // Remove from source
        onDateChange(targetDateStr, workoutId); // Add to destination
      }
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, day: Date) => {
    e.preventDefault();
    setDragOverDay(formatDate(day));
  };
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, workoutId: string, fromDate: Date) => {
    const fromDateStr = formatDate(fromDate);
    e.dataTransfer.setData('workoutFromDay', JSON.stringify({ workoutId, fromDateStr }));
  };
  
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.clearData();
  }

  const handleRemoveWorkout = (e: React.MouseEvent<HTMLButtonElement>, day: Date) => {
      e.stopPropagation(); // Prevent triggering other click events
      const dateStr = formatDate(day);
      onDateChange(dateStr, null);
  };

  return (
    <div className="grid grid-cols-7 gap-1 text-center">
      {weekDays.map(day => (
        <div key={day} className="font-bold text-brand-subtle text-sm pb-2">{day}</div>
      ))}
      {Array.from({ length: firstDayOfMonth }).map((_, i) => (
        <div key={`empty-${i}`} className="bg-gray-50 dark:bg-brand-background-dark/50 rounded-md"></div>
      ))}
      {daysInMonth.map(day => {
        const dateStr = formatDate(day);
        const workoutId = schedule[dateStr];
        const workout = workoutId ? workoutMap[workoutId] : null;
        const isToday = new Date().toDateString() === day.toDateString();

        return (
          <div
            key={dateStr}
            onDrop={(e) => handleDrop(e, day)}
            onDragOver={(e) => handleDragOver(e, day)}
            onDragLeave={() => setDragOverDay(null)}
            className={`
              h-28 rounded-md p-1.5 border transition-colors flex flex-col items-start
              ${dragOverDay === dateStr ? 'bg-brand-primary/10 border-brand-primary' : 'bg-brand-surface dark:bg-brand-surface-dark border-gray-200 dark:border-gray-700'}
            `}
          >
            <span className={`
              text-sm font-bold mb-1
              ${isToday ? 'bg-brand-primary text-white rounded-full w-6 h-6 flex items-center justify-center' : 'text-brand-subtle dark:text-brand-subtle-dark'}
            `}>
              {day.getDate()}
            </span>
            {workout && (
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, workout.id, day)}
                onDragEnd={handleDragEnd}
                className="w-full p-1 bg-brand-primary text-white text-[11px] leading-tight font-bold rounded-md cursor-grab flex-grow flex flex-col justify-center relative group"
                title={workout.name}
              >
                  <p className="text-center">
                    {workout.name.split('–')[1]?.trim() || workout.name}
                  </p>
                   <button
                        onClick={(e) => handleRemoveWorkout(e, day)}
                        className="absolute top-0 right-0 -mt-1.5 -mr-1.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow hover:scale-110"
                        aria-label="Remover treino"
                    >
                        &times;
                   </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WorkoutCalendar;