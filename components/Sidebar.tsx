import React, { useState } from 'react';
import type { Page } from '../types';
import { HomeIcon, DumbbellIcon, CalendarIcon, CalendarCheckIcon, ProgressIcon, BookOpenIcon, LibraryIcon, ChartBarIcon, SettingsIcon, TrophyIcon, LogoutIcon } from './icons';
import { useUserData } from '../hooks/useUserData';
import EditProfileModal from './EditProfileModal';
import { getXPForNextLevel } from '../data/gamification';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isStreakAtRisk: boolean;
}

const navItems = [
  { name: 'Início', icon: <HomeIcon /> },
  { name: 'Plano de Treino', icon: <DumbbellIcon /> },
  { name: 'Agenda', icon: <CalendarIcon /> },
  { name: 'Biblioteca de Exercícios', icon: <LibraryIcon /> },
  { name: 'Assiduidade', icon: <CalendarCheckIcon /> },
  { name: 'Progresso', icon: <ProgressIcon /> },
  { name: 'Conquistas', icon: <TrophyIcon /> },
  { name: 'Relatórios', icon: <ChartBarIcon /> },
  { name: 'Guia Nutricional', icon: <BookOpenIcon /> },
  { name: 'Configurações', icon: <SettingsIcon /> },
] as const;


const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isStreakAtRisk }) => {
  const { data } = useUserData();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  const xpForNextLevel = getXPForNextLevel(data.level);
  const xpProgressPercentage = (data.xp / xpForNextLevel) * 100;

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 bg-brand-surface dark:bg-brand-surface-dark text-brand-text dark:text-brand-text-dark p-4 border-r border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center p-4 my-6 text-center">
          <div className="relative">
            <img
              src={data.profilePictureUrl}
              alt="Foto de Perfil"
              className="w-24 h-24 rounded-full border-4 border-brand-primary object-cover shadow-lg mb-4"
            />
            <span className="absolute bottom-2 -right-1 bg-brand-primary text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-brand-surface dark:border-brand-surface-dark shadow-md">
              LVL {data.level}
            </span>
          </div>
           <div className="flex items-center gap-2 justify-center">
              <h2 className="text-xl font-bold text-brand-text dark:text-brand-text-dark">{data.userName}</h2>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="text-brand-subtle hover:text-brand-primary transition-colors text-sm"
                aria-label="Editar perfil"
              >
                <i className="fas fa-pencil-alt"></i>
              </button>
          </div>
          <div className="w-full mt-4">
              <div className="flex justify-between items-center text-xs text-brand-subtle mb-1">
                <span>XP</span>
                <span>{data.xp} / {xpForNextLevel}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div className="bg-brand-primary h-1.5 rounded-full" style={{ width: `${xpProgressPercentage}%` }}></div>
              </div>
          </div>
        </div>
        <nav className="flex-grow flex flex-col space-y-2">
          {navItems.map((item) => {
            const isAttendance = item.name === 'Assiduidade';
            return (
              <button
                key={item.name}
                onClick={() => setCurrentPage(item.name)}
                className={`relative w-full flex items-center justify-start space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                  currentPage === item.name
                    ? 'bg-brand-primary text-white shadow-lg'
                    : 'hover:bg-brand-primary/10 dark:hover:bg-white/10'
                }`}
              >
                {item.icon}
                <span className="font-medium text-left">{item.name}</span>
                {isAttendance && isStreakAtRisk && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-brand-surface dark:border-brand-surface-dark animate-pulse">
                     <span className="sr-only">Notificação de treino pendente</span>
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </aside>
      <EditProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </>
  );
};

export default Sidebar;