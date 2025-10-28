import React, { useState, useEffect, useMemo } from 'react';
import { useUserData } from '../hooks/useUserData';
import Card from '../components/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, BarChart, Bar } from 'recharts';
import { useTheme } from '../hooks/useTheme';
import type { Page } from '../types';
import { NUTRITION_TIPS } from '../constants';
import FloatingActionButton from '../components/FloatingActionButton';
import LogWeightModal from '../components/LogWeightModal';
import Logo from '../components/Logo';

const motivationalQuotes = [
  "Hoje é um ótimo dia para conquistar mais um treino!",
  "A força não vem do que você pode fazer. Vem de superar as coisas que você pensou que não podia.",
  "Continue, mesmo que ninguém esteja a aplaudir. Faça por si!",
  "Cada treino é um presente para o seu corpo.",
  "O seu único limite é você.",
  "💪 A consistência supera a intensidade. Continue firme!",
  "Um passo de cada vez. Você está a ir mais longe do que imagina.",
];

const ThemeToggle: React.FC = () => {
  const { mode, toggleMode } = useTheme();

  return (
    <button
      onClick={toggleMode}
      className="w-12 h-12 bg-brand-surface/80 dark:bg-brand-surface-dark/70 backdrop-blur-md border border-gray-200/30 dark:border-white/10 rounded-full flex items-center justify-center text-brand-subtle hover:text-brand-primary dark:hover:text-brand-primary-light transition-colors"
      aria-label="Toggle dark mode"
    >
      {mode === 'light' ? <i className="fas fa-moon text-xl"></i> : <i className="fas fa-sun text-xl"></i>}
    </button>
  );
};


const StatCard: React.FC<{ title: string; value: string | number; unit?: string; icon: React.ReactNode; trend?: 'up' | 'down' | 'same' }> = ({ title, value, unit, icon, trend }) => (
    <div className="bg-brand-surface/80 dark:bg-brand-surface-dark/70 backdrop-blur-lg p-3 rounded-xl shadow-lg border border-gray-200/30 dark:border-white/10 flex flex-col text-center transition-transform duration-200 ease-in-out hover:scale-105 h-full">
        <p className="text-xs text-brand-subtle">{title}</p>
        <div className="flex-grow flex items-center justify-center gap-2 mt-1">
            <div className="text-brand-primary text-lg">{icon}</div>
            <p className="text-2xl font-bold text-brand-text dark:text-brand-text-dark">
                {value}
                {unit && <span className="text-base font-normal"> {unit}</span>}
            </p>
            {trend && trend !== 'same' && (
              <i className={`fas fa-arrow-trend-${trend} text-xs self-center ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}></i>
            )}
        </div>
    </div>
);

const ProgressGauge: React.FC<{ initial: number, current: number, goal: number }> = ({ initial, current, goal }) => {
    const goalIsToLose = initial > goal;
    const totalDistance = Math.abs(goal - initial);
    const distanceTravelled = goalIsToLose ? initial - current : current - initial;

    const progressPercentage = totalDistance > 0 
        ? Math.max(0, Math.min(100, (distanceTravelled / totalDistance) * 100))
        : ( (goalIsToLose && current <= goal) || (!goalIsToLose && current >= goal) ? 100 : 0 );

    const radius = 28;
    const stroke = 6;
    const normalizedRadius = radius;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;
    
    const remainingKg = Math.abs(goal - current);
    const goalReached = (goalIsToLose && current <= goal) || (!goalIsToLose && current >= goal);
    
    let message: React.ReactNode = `Faltam ${remainingKg.toFixed(1)} kg para a sua meta!`;
    if (goalReached) {
        message = <span className="text-green-500 font-semibold">Parabéns, meta atingida!</span>;
    }

    return (
        <div className="bg-brand-surface/80 dark:bg-brand-surface-dark/70 backdrop-blur-lg p-3 rounded-xl shadow-lg border border-gray-200/30 dark:border-white/10 flex flex-col items-center justify-center text-center transition-transform duration-200 ease-in-out hover:scale-105 h-full">
            <h3 className="text-xs text-brand-subtle">Progresso até à Meta</h3>
            <div className="relative w-20 h-20 my-1 flex-grow flex items-center justify-center">
                 <svg height="100%" width="100%" viewBox="0 0 68 68" className="transform -rotate-90">
                     <circle
                         stroke="#e5e7eb"
                         className="dark:stroke-gray-600"
                         strokeWidth={stroke}
                         fill="transparent"
                         r={radius}
                         cx={34}
                         cy={34}
                     />
                     <circle
                         stroke="url(#progressGradient)"
                         strokeWidth={stroke}
                         strokeLinecap="round"
                         fill="transparent"
                         r={radius}
                         cx={34}
                         cy={34}
                         style={{ strokeDasharray: circumference, strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-out' }}
                     />
                     <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--brand-primary-light)" />
                            <stop offset="100%" stopColor="var(--brand-primary-dark)" />
                        </linearGradient>
                    </defs>
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-brand-primary">{progressPercentage.toFixed(1)}%</span>
                 </div>
             </div>
             <p className="text-xs text-brand-subtle leading-tight h-8 -mt-2">{message}</p>
        </div>
    );
};


interface HomeProps {
  setCurrentPage: (page: Page) => void;
}

const Home: React.FC<HomeProps> = ({ setCurrentPage }) => {
  const { data, getCurrentWeight, getFormattedWeightLog, getWeeklySummary, getLatestWeightEntries, getPreviousWeekSummary, calculateStreak, getRecentAchievements, getTodayWaterIntake, addWaterIntake, getWeeklyWaterIntake } = useUserData();
  const currentWeight = getCurrentWeight();
  const [isMilestoneVisible, setIsMilestoneVisible] = useState(false);
  const [weightTimeframe, setWeightTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [isLogWeightModalOpen, setIsLogWeightModalOpen] = useState(false);
  
  const todayWaterIntake = getTodayWaterIntake();
  const weeklyWaterData = getWeeklyWaterIntake();

  const kgToGoal = data.goalWeight - currentWeight;
  const goalIsToLose = data.initialWeight > data.goalWeight;
  const goalReached = (goalIsToLose && currentWeight <= data.goalWeight) || (!goalIsToLose && currentWeight >= data.goalWeight);
  const isCloseToGoal = !goalReached && Math.abs(kgToGoal) <= 1;

  useEffect(() => {
    const dismissed = sessionStorage.getItem('milestoneNotificationDismissed');
    if (isCloseToGoal && !dismissed) {
      setIsMilestoneVisible(true);
    } else {
      setIsMilestoneVisible(false);
    }
  }, [isCloseToGoal]);

  const handleDismissMilestone = () => {
    sessionStorage.setItem('milestoneNotificationDismissed', 'true');
    setIsMilestoneVisible(false);
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const workoutIdToday = data.calendarSchedule[todayStr];
  const workoutTodayInfo = workoutIdToday ? data.workouts.find(w => w.id === workoutIdToday) : null;
  const isWorkoutCompletedToday = data.attendance.includes(todayStr) && !!workoutTodayInfo;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  const workoutIdTomorrow = data.calendarSchedule[tomorrowStr];
  const workoutTomorrowInfo = workoutIdTomorrow ? data.workouts.find(w => w.id === workoutIdTomorrow) : null;

  let nextWorkoutInfo = workoutTodayInfo;
  let nextWorkoutDayLabel = 'Hoje';

  if (!nextWorkoutInfo && workoutTomorrowInfo) {
    nextWorkoutInfo = workoutTomorrowInfo;
    nextWorkoutDayLabel = 'Amanhã';
  }

  const dailyQuote = useMemo(() => {
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return motivationalQuotes[dayOfYear % motivationalQuotes.length];
  }, []);

  const dailyNutritionTip = useMemo(() => {
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return NUTRITION_TIPS[dayOfYear % NUTRITION_TIPS.length];
  }, []);

  const weeklySummary = getWeeklySummary();
  const latestWeights = getLatestWeightEntries(5);
  
  const latestWeightsForTrend = getLatestWeightEntries(2);
  const currentWeightTrend = useMemo(() => {
    if (latestWeightsForTrend.length < 2) return 'same';
    const [last, secondLast] = latestWeightsForTrend;
    if (last.weight > secondLast.weight) return 'up';
    if (last.weight < secondLast.weight) return 'down';
    return 'same';
  }, [latestWeightsForTrend]);
  
  const filteredWeightData = useMemo(() => {
    const allData = getFormattedWeightLog();
    if (weightTimeframe === '90d' && allData.length > 90/7 * 4) { // Heuristic
        // For 3 months, let's simplify to weekly averages if lots of data
    }
    const days = weightTimeframe === '7d' ? 7 : (weightTimeframe === '30d' ? 30 : 90);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return allData.filter(d => {
        const [day, month] = d.date.split('/');
        const entryDate = new Date(new Date().getFullYear(), parseInt(month) - 1, parseInt(day));
        return entryDate >= startDate;
    });
  }, [getFormattedWeightLog, weightTimeframe]);
  
  const weeklyActivityData = useMemo(() => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find Sunday of the current week
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const result = [];
    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(startOfWeek.getDate() + i);
        const dateStr = currentDay.toISOString().split('T')[0];

        const treinos = data.attendance.includes(dateStr) ? 1 : 0;
        
        result.push({
            day: days[i],
            treinos,
        });
    }

    return result;
  }, [data.attendance]);
  
  const weeklyComparison = useMemo(() => {
    const prevWeek = getPreviousWeekSummary();
    if (prevWeek.minutesTrained === 0) {
      if (weeklySummary.minutesTrained > 0) {
        return { diff: weeklySummary.minutesTrained, trend: 'up' as const};
      }
      return { diff: 0, trend: 'same' as const};
    }
    const diff = weeklySummary.minutesTrained - prevWeek.minutesTrained;
    const trend = diff > 0 ? 'up' : (diff < 0 ? 'down' : 'same');
    return { diff, trend };
  }, [weeklySummary, getPreviousWeekSummary]);
  
  const currentStreak = calculateStreak();
  const recentAchievements = getRecentAchievements(3);

  return (
    <div className="space-y-6">
       <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
      <header className="relative flex justify-center sm:justify-between items-center pt-14 sm:pt-0">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Logo className="w-16 h-16 text-brand-primary order-1 sm:order-none" />
          <div className="order-2 sm:order-none text-center sm:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-brand-text dark:text-brand-text-dark">Bem-vinda, {data.userName.split(' ')[0]}!</h1>
            <p className="text-md text-brand-subtle">{dailyQuote}</p>
          </div>
        </div>
        <div className="absolute top-0 right-0">
          <ThemeToggle />
        </div>
      </header>
      
      {isMilestoneVisible && (
        <div className="bg-brand-primary/10 dark:bg-brand-primary-dark/20 border-l-4 border-brand-primary text-brand-text dark:text-brand-text-dark p-4 rounded-lg shadow-md flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-4">
            <i className="fas fa-trophy text-brand-primary text-2xl"></i>
            <div>
              <p className="font-bold">Você está quase lá!</p>
              <p className="text-sm">Faltam apenas <strong>{Math.abs(kgToGoal).toFixed(1)} kg</strong> para atingir a sua meta. Continue assim!</p>
            </div>
          </div>
          <button onClick={handleDismissMilestone} className="text-brand-subtle hover:text-brand-primary text-xl" aria-label="Dispensar notificação">
            &times;
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard icon={<i className="fas fa-ruler-vertical"></i>} title="Altura" value={data.height} unit="m" />
        <StatCard icon={<i className="fas fa-shopping-bag"></i>} title="Peso Inicial" value={data.initialWeight.toFixed(1)} unit="kg" />
        <StatCard icon={<i className="fas fa-balance-scale-right"></i>} title="Peso Atual" value={currentWeight.toFixed(1)} unit="kg" trend={currentWeightTrend} />
        <StatCard icon={<i className="fas fa-bullseye"></i>} title="Meta" value={data.goalWeight.toFixed(1)} unit="kg" />
        <ProgressGauge initial={data.initialWeight} current={currentWeight} goal={data.goalWeight} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card title="Hidratação" icon={<i className="fas fa-tint"></i>}>
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-3xl font-bold text-brand-primary">{todayWaterIntake.amount.toFixed(2)}L <span className="text-lg text-brand-subtle">/ {data.waterGoal.toFixed(1)}L</span></p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                  <div className="bg-blue-400 h-2.5 rounded-full" style={{width: `${Math.min(100, (todayWaterIntake.amount / data.waterGoal) * 100)}%`}}></div>
              </div>
              <div className="flex gap-2 mt-4">
                  <button onClick={() => addWaterIntake(-0.25)} className="w-10 h-10 bg-brand-primary/10 rounded-full text-brand-primary font-bold">-</button>
                  <button onClick={() => addWaterIntake(0.25)} className="w-10 h-10 bg-brand-primary/10 rounded-full text-brand-primary font-bold">+</button>
              </div>
              <div className="w-full h-24 mt-4 -ml-4">
                <ResponsiveContainer>
                  <BarChart data={weeklyWaterData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} className="text-xs" stroke="currentColor" />
                    <Tooltip 
                      cursor={{ fill: 'rgba(124, 58, 237, 0.1)' }}
                      contentStyle={{ backgroundColor: 'var(--brand-surface)', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} 
                      wrapperClassName="rounded-md shadow-lg dark:!bg-brand-surface-dark dark:!border-gray-700"
                      formatter={(value: number) => [`${value.toFixed(2)} L`, null]}
                      labelFormatter={() => ''}
                    />
                    <ReferenceLine y={data.waterGoal} stroke="var(--brand-primary)" strokeDasharray="3 3" />
                    <Bar dataKey="consumed" fill="var(--brand-primary-light)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
        </Card>
        <Card title="Dica Nutricional do Dia" icon={<i className="fas fa-lightbulb"></i>}>
            <div className="flex items-start gap-4">
                <span className="text-3xl">{dailyNutritionTip.icon}</span>
                <div>
                  <p className="text-sm text-brand-text dark:text-brand-text-dark">{dailyNutritionTip.text}</p>
                  <button onClick={() => setCurrentPage('Guia Nutricional')} className="text-xs font-bold text-brand-primary hover:underline mt-2">Ver mais dicas</button>
                </div>
            </div>
        </Card>
         <Card title="Resumo da Semana" icon={<i className="fas fa-calendar-week"></i>}>
            <div className="space-y-3">
                 <div className="flex justify-between items-center">
                    <p><strong>Tempo:</strong> {weeklySummary.minutesTrained} min</p>
                    {weeklyComparison.trend !== 'same' && weeklySummary.minutesTrained > 0 && (
                        <span className={`text-xs font-bold flex items-center gap-1 ${weeklyComparison.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                           <i className={`fas fa-arrow-${weeklyComparison.trend}`}></i> {Math.abs(weeklyComparison.diff)} min
                        </span>
                    )}
                 </div>
                 {currentStreak > 1 && (
                     <p className="text-orange-500 font-bold"><i className="fas fa-fire"></i> Sequência de {currentStreak} treinos!</p>
                 )}
                 <div style={{width: '100%', height: '100px'}} className="-ml-4">
                    <ResponsiveContainer>
                        <BarChart data={weeklyActivityData}>
                            <XAxis dataKey="day" axisLine={false} tickLine={false} className="text-xs" stroke="currentColor"/>
                            <Tooltip cursor={{fill: 'rgba(124, 58, 237, 0.1)'}} contentStyle={{display: 'none'}} />
                            <Bar dataKey="treinos" fill="var(--brand-primary-light)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                 </div>
            </div>
        </Card>
        <Card title="Desafio Semanal" icon={<i className="fas fa-crosshairs"></i>}>
            <div className="text-center">
                <i className="fas fa-dumbbell text-3xl text-brand-primary mb-2"></i>
                <p className="font-bold">Complete 3 treinos esta semana!</p>
                <p className="text-sm text-brand-subtle">Recompensa: 100 XP</p>
                 <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-3">
                    <div className="bg-brand-primary h-2.5 rounded-full" style={{width: `${(weeklySummary.workoutsCompleted / 3) * 100}%`}}></div>
                </div>
            </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Evolução do Peso" icon={<i className="fas fa-chart-line"></i>} headerActions={
              <div className="flex space-x-1 border border-gray-300 dark:border-gray-600 rounded-md p-0.5">
                  {(['7d', '30d', '90d'] as const).map(tf => (
                      <button key={tf} onClick={() => setWeightTimeframe(tf)} className={`px-3 py-1 text-xs font-medium rounded ${weightTimeframe === tf ? 'bg-brand-primary text-white' : 'hover:bg-brand-primary/10'}`}>
                          {tf === '90d' ? '3M' : tf.toUpperCase()}
                      </button>
                  ))}
              </div>
          }>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={filteredWeightData} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="date" className="text-xs" stroke="currentColor" />
                  <YAxis domain={['dataMin - 2', 'dataMax + 2']} className="text-xs" stroke="currentColor" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--brand-surface)', border: '1px solid #e5e7eb' }} 
                    wrapperClassName="rounded-md shadow-lg dark:!bg-brand-surface-dark dark:!border-gray-700"
                     formatter={(value: number, name, props) => [`${value.toFixed(1)} kg`, `Peso em ${props.payload.date}`]}
                     labelFormatter={() => ''}
                  />
                  <Legend />
                  <ReferenceLine y={data.goalWeight} label={{ value: "Meta", position: "insideTopRight", fill: "var(--brand-subtle)" }} stroke="var(--brand-subtle)" strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="peso" stroke="var(--brand-primary)" strokeWidth={3} dot={{ r: 4, className: 'dark:stroke-brand-surface-dark' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        
        <div className="space-y-6">
            <Card title={nextWorkoutInfo ? "Próximo Treino" : "Treino do Dia"} icon={<i className="fas fa-dumbbell"></i>} className="h-full flex flex-col">
              <div className="flex-grow">
                {isWorkoutCompletedToday ? (
                     <div className="text-center flex flex-col items-center justify-center h-full">
                        <i className="fas fa-check-circle text-green-500 text-5xl mb-3"></i>
                        <p className="text-xl font-bold text-green-500">Treino Completo!</p>
                        <p className="text-brand-subtle">Bom trabalho hoje.</p>
                    </div>
                ) : nextWorkoutInfo ? (
                  <>
                    <p className="text-brand-subtle text-sm font-semibold">{nextWorkoutDayLabel}</p>
                    <p className="text-xl font-bold text-brand-primary">{nextWorkoutInfo.name}</p>
                    <p className="text-sm text-brand-subtle mt-2"><i className="far fa-clock mr-2"></i>Estimativa: {nextWorkoutInfo.exercises.length * 5} - {nextWorkoutInfo.exercises.length * 8} min</p>
                  </>
                ) : (
                  <>
                    <p className="text-xl font-bold text-brand-subtle">Descanso</p>
                    <p className="text-brand-subtle">Aproveite para recuperar.</p>
                  </>
                )}
              </div>
               {nextWorkoutInfo && !isWorkoutCompletedToday && (
                  <button onClick={() => setCurrentPage('Plano de Treino')} className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                      <i className="fas fa-play"></i>
                      Iniciar Treino
                  </button>
              )}
            </Card>
             <Card title="Conquistas Recentes" icon={<i className="fas fa-trophy"></i>}>
             {recentAchievements.length > 0 ? (
                <ul className="space-y-3">
                    {recentAchievements.map(ach => (
                        <li key={ach.id} className="flex items-center gap-3">
                            <i className={`${ach.icon} text-brand-primary w-5 text-center`}></i>
                            <span className="text-sm font-medium">{ach.name}</span>
                        </li>
                    ))}
                </ul>
             ) : (
                <p className="text-sm text-brand-subtle text-center py-4">Continue a treinar para desbloquear conquistas!</p>
             )}
        </Card>
        </div>
      </div>
       <FloatingActionButton 
        onLogWeight={() => setIsLogWeightModalOpen(true)}
        onStartWorkout={() => setCurrentPage('Plano de Treino')}
      />
      <LogWeightModal 
        isOpen={isLogWeightModalOpen}
        onClose={() => setIsLogWeightModalOpen(false)}
      />
    </div>
  );
};

export default Home;
