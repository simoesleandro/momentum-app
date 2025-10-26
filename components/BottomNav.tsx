import React, { useState } from 'react';
import type { Page } from '../types';
import { HomeIcon, DumbbellIcon, CalendarIcon, ProgressIcon, BookOpenIcon, LibraryIcon, CalendarCheckIcon, TrophyIcon, ChartBarIcon, SettingsIcon, MenuIcon } from './icons';

interface BottomNavProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentPage, setCurrentPage }) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const mainNavItems = [
    { name: 'Início', icon: <HomeIcon /> },
    { name: 'Plano de Treino', icon: <DumbbellIcon /> },
    { name: 'Agenda', icon: <CalendarIcon /> },
    { name: 'Progresso', icon: <ProgressIcon /> },
  ] as const;

  const moreNavItems = [
    { name: 'Guia Nutricional', icon: <BookOpenIcon /> },
    { name: 'Biblioteca de Exercícios', icon: <LibraryIcon /> },
    { name: 'Assiduidade', icon: <CalendarCheckIcon /> },
    { name: 'Conquistas', icon: <TrophyIcon /> },
    { name: 'Relatórios', icon: <ChartBarIcon /> },
    { name: 'Configurações', icon: <SettingsIcon /> },
  ] as const;

  const handleMoreItemClick = (page: Page) => {
    setCurrentPage(page);
    setIsMoreMenuOpen(false);
  };

  const isMorePageActive = moreNavItems.some(item => item.name === currentPage);

  return (
    <>
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-surface dark:bg-brand-surface-dark border-t border-brand-primary/20 dark:border-brand-primary-dark/30 flex justify-around items-center h-16 z-50">
        {mainNavItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setCurrentPage(item.name)}
            className={`flex flex-col items-center justify-center w-full p-2 rounded-md transition-all duration-300 ease-in-out transform ${
              currentPage === item.name
                ? 'text-brand-primary scale-110'
                : 'text-brand-subtle dark:text-brand-subtle-dark scale-95 opacity-70 hover:opacity-100 hover:scale-100 hover:text-brand-primary'
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.name}</span>
          </button>
        ))}
        <button
          onClick={() => setIsMoreMenuOpen(true)}
          className={`flex flex-col items-center justify-center w-full p-2 rounded-md transition-all duration-300 ease-in-out transform ${
            isMorePageActive
              ? 'text-brand-primary scale-110'
              : 'text-brand-subtle dark:text-brand-subtle-dark scale-95 opacity-70 hover:opacity-100 hover:scale-100 hover:text-brand-primary'
          }`}
        >
          <MenuIcon />
          <span className="text-xs mt-1">Mais</span>
        </button>
      </nav>
      {isMoreMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[60] md:hidden"
          onClick={() => setIsMoreMenuOpen(false)}
        >
          <div 
            className="fixed bottom-16 left-0 right-0 bg-brand-surface dark:bg-brand-surface-dark p-4 rounded-t-2xl shadow-lg animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
             <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4"></div>
            <div className="grid grid-cols-3 gap-4">
              {moreNavItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleMoreItemClick(item.name)}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg gap-1 ${
                    currentPage === item.name
                      ? 'text-brand-primary'
                      : 'text-brand-subtle dark:text-brand-subtle-dark'
                  }`}
                >
                  {item.icon}
                  <span className="text-xs text-center">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BottomNav;