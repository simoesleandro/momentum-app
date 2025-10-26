import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import WorkoutPlan from './pages/WorkoutPlan';
import Attendance from './pages/Attendance';
import History from './pages/History';
import NutritionGuide from './pages/NutritionGuide';
import ExerciseLibrary from './pages/ExerciseLibrary';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Schedule from './pages/Schedule';
import Achievements from './pages/Achievements';
import AchievementUnlockedModal from './components/AchievementUnlockedModal';
import LevelUpModal from './components/LevelUpModal';
import { UserDataProvider, useUserData } from './hooks/useUserData';
import type { Page } from './types';
import { ThemeProvider } from './hooks/useTheme';

const PageRenderer: React.FC<{ currentPage: Page, setCurrentPage: (page: Page) => void }> = ({ currentPage, setCurrentPage }) => {
  switch (currentPage) {
    case 'Início':
      return <Home setCurrentPage={setCurrentPage} />;
    case 'Plano de Treino':
      return <WorkoutPlan />;
    case 'Agenda':
      return <Schedule />;
    case 'Assiduidade':
      return <Attendance />;
    case 'Progresso':
      return <History />;
    case 'Conquistas':
      return <Achievements />;
    case 'Guia Nutricional':
      return <NutritionGuide />;
    case 'Biblioteca de Exercícios':
      return <ExerciseLibrary />;
    case 'Relatórios':
      return <Reports />;
    case 'Configurações':
      return <Settings />;
    default:
      return <Home setCurrentPage={setCurrentPage} />;
  }
};

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('Início');
  const { 
    newlyUnlockedAchievement, 
    clearNewlyUnlockedAchievement,
    newlyLeveledUp,
    clearNewlyLeveledUp,
    isStreakAtRisk
  } = useUserData();

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen font-sans bg-brand-background dark:bg-brand-background-dark text-brand-text dark:text-brand-text-dark">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} isStreakAtRisk={isStreakAtRisk()} />
        <main className="flex-1 overflow-y-auto bg-brand-background dark:bg-brand-background-dark p-4 md:p-8 pb-20 md:pb-8">
          <PageRenderer currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </main>
        <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
      <AchievementUnlockedModal 
        achievement={newlyUnlockedAchievement}
        onClose={clearNewlyUnlockedAchievement}
      />
      <LevelUpModal
        level={newlyLeveledUp}
        onClose={clearNewlyLeveledUp}
      />
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <UserDataProvider>
        <AppContent />
      </UserDataProvider>
    </ThemeProvider>
  );
};

export default App;