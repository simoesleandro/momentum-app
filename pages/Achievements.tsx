import React from 'react';
import { useUserData } from '../hooks/useUserData';
import { ACHIEVEMENTS } from '../data/gamification';
import Card from '../components/Card';

const Achievements: React.FC = () => {
  const { data } = useUserData();
  
  const unlockedCount = data.unlockedAchievements.length;
  const totalCount = ACHIEVEMENTS.length;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-brand-text dark:text-brand-text-dark">Minhas Conquistas</h1>
        <p className="text-brand-subtle dark:text-brand-subtle-dark mt-1">
          Você desbloqueou <span className="font-bold text-brand-primary">{unlockedCount}</span> de <span className="font-bold text-brand-text dark:text-brand-text-dark">{totalCount}</span> conquistas.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ACHIEVEMENTS.map(ach => {
          const isUnlocked = data.unlockedAchievements.includes(ach.id);
          const progress = ach.progress ? ach.progress(data) : null;
          const progressPercent = progress ? Math.min(100, (progress.current / progress.goal) * 100) : 0;

          return (
            <Card key={ach.id} title="" className={`transition-all duration-300 group ${isUnlocked ? 'border-brand-primary/50' : ''}`}>
              <div className={`flex flex-col items-center text-center transition-all duration-300 ${!isUnlocked ? 'opacity-50 grayscale blur-[1px] group-hover:opacity-100 group-hover:grayscale-0 group-hover:blur-0' : ''}`}>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isUnlocked ? 'bg-brand-primary/10' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    <i className={`${ach.icon} text-4xl ${isUnlocked ? 'text-brand-primary' : 'text-gray-400'}`}></i>
                </div>
                
                <h3 className="font-bold text-lg text-brand-text dark:text-brand-text-dark">{ach.name}</h3>
                <p className="text-sm text-brand-subtle dark:text-brand-subtle-dark h-10">{ach.description}</p>

                {progress && !isUnlocked && (
                  <div className="w-full mt-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-brand-primary h-2 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <p className="text-xs text-right text-brand-subtle dark:text-brand-subtle-dark mt-1">{progress.current} / {progress.goal}</p>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
