import React, { useState, useEffect } from 'react';
import { useUserData } from '../hooks/useUserData';
import Card from '../components/Card';
import { triggerVibration } from '../utils/haptics';

const Attendance: React.FC = () => {
  const { data, addAttendance, calculateStreak } = useUserData();
  const [today] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const todayStr = today.toISOString().split('T')[0];
  const hasCheckedInToday = data.attendance.includes(todayStr);

  const getMonthData = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const daysInMonth = getMonthData(currentYear, currentMonth);
  const monthName = new Date(currentYear, currentMonth).toLocaleString('pt-BR', { month: 'long' });
  
  const monthStats = daysInMonth.reduce((acc, day) => {
    const dayStr = day.toISOString().split('T')[0];
    const isTrainingDay = !!data.calendarSchedule[dayStr];
    const attended = data.attendance.includes(dayStr);
    
    if (isTrainingDay) {
        if (attended) {
            acc.visits++;
        } else if (day < today && day.toDateString() !== today.toDateString()) {
            acc.absences++;
        }
    }
    return acc;
  }, { visits: 0, absences: 0 });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Assiduidade</h1>
      
      <div className="text-center">
        <button
          onClick={() => {
            addAttendance();
            triggerVibration();
          }}
          disabled={hasCheckedInToday}
          className="bg-brand-primary text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-transform transform hover:scale-105 disabled:bg-brand-subtle disabled:cursor-not-allowed disabled:transform-none"
        >
          {hasCheckedInToday ? 'Presença Registrada!' : 'Registrar Presença Hoje'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Visitas Este Mês" icon={<i className="fas fa-calendar-check"></i>}><p className="text-2xl font-bold">{monthStats.visits}</p></Card>
        <Card title="Faltas Este Mês" icon={<i className="fas fa-calendar-times"></i>}><p className="text-2xl font-bold">{monthStats.absences}</p></Card>
        <Card title="Total de Visitas" icon={<i className="fas fa-calendar-plus"></i>}><p className="text-2xl font-bold">{data.attendance.length}</p></Card>
        <Card title="Sequência Atual" icon={<i className="fas fa-fire"></i>}><p className="text-2xl font-bold">{calculateStreak()} treinos</p></Card>
      </div>
      
      <Card title={`Calendário de ${monthName} de ${currentYear}`} icon={<i className="fas fa-calendar-day"></i>}>
        <div className="grid grid-cols-7 gap-2 text-center">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => <div key={day} className="font-bold text-brand-subtle">{day}</div>)}
          {Array.from({length: new Date(currentYear, currentMonth, 1).getDay()}).map((_, i) => <div key={`empty-${i}`}></div>)}
          {daysInMonth.map(day => {
            const dayStr = day.toISOString().split('T')[0];
            const isTrainingDay = !!data.calendarSchedule[dayStr];
            const attended = data.attendance.includes(dayStr);
            const isPast = day < today && day.toDateString() !== today.toDateString();
            const isToday = day.toDateString() === today.toDateString();

            let bgColor = 'bg-brand-surface dark:bg-brand-surface-dark';
            let textColor = 'text-brand-text dark:text-brand-text-dark';

            if (!isTrainingDay) {
                bgColor = 'bg-gray-100 dark:bg-brand-background-dark/50';
                textColor = 'text-gray-400 dark:text-gray-500';
            }
             if (isTrainingDay) {
                bgColor = 'bg-indigo-100 dark:bg-indigo-900/30';
                textColor = 'text-indigo-700 dark:text-indigo-300';
            }
            if (isTrainingDay && attended) {
                bgColor = 'bg-green-500';
                textColor = 'text-white';
            }
            if (isTrainingDay && !attended && isPast) {
                bgColor = 'bg-red-500';
                textColor = 'text-white';
            }

            return (
              <div key={dayStr} className={`p-1 rounded-lg transition-all duration-300 ${isToday ? 'ring-2 ring-brand-primary' : ''}`}>
                <div className={`w-full h-12 flex items-center justify-center rounded-md ${bgColor}`}>
                  <span className={`font-bold text-lg ${textColor}`}>{day.getDate()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default Attendance;