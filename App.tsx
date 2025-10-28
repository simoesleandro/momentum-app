import React, { useState, useRef, useEffect } from 'react';
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
import OnboardingPage from './pages/OnboardingPage';
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

  // --- Pull to Refresh Logic ---
  const [pullStart, setPullStart] = useState<number | null>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const PULL_THRESHOLD = 80;

  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl || currentPage !== 'Início' || isRefreshing) return;

    const handleTouchStart = (e: TouchEvent) => {
        if (mainEl.scrollTop === 0) {
            setIsDragging(true);
            setPullStart(e.touches[0].clientY);
        }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
        if (pullStart === null) return;
        const currentY = e.touches[0].clientY;
        const distance = currentY - pullStart;
        if (distance > 0) {
            e.preventDefault();
            setPullDistance(Math.pow(distance, 0.85));
        } else {
            setPullStart(null);
        }
    };

    const handleTouchEnd = () => {
        if (pullStart === null) return;
        
        setIsDragging(false);
        setPullStart(null);

        if (pullDistance > PULL_THRESHOLD) {
            setIsRefreshing(true);
            setTimeout(() => window.location.reload(), 1500);
        } else {
            setPullDistance(0);
        }
    };

    mainEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    mainEl.addEventListener('touchmove', handleTouchMove, { passive: false });
    mainEl.addEventListener('touchend', handleTouchEnd);
    mainEl.addEventListener('touchcancel', handleTouchEnd);

    return () => {
        mainEl.removeEventListener('touchstart', handleTouchStart);
        mainEl.removeEventListener('touchmove', handleTouchMove);
        mainEl.removeEventListener('touchend', handleTouchEnd);
        mainEl.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [currentPage, pullStart, pullDistance, isRefreshing]);
  // --- End Pull to Refresh Logic ---

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen font-sans bg-brand-background dark:bg-brand-background-dark text-brand-text dark:text-brand-text-dark">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} isStreakAtRisk={isStreakAtRisk()} />
        <main ref={mainRef} className="flex-1 overflow-y-auto bg-brand-background dark:bg-brand-background-dark p-4 md:p-8 pb-20 md:pb-8 relative">
          {currentPage === 'Início' && (
            <div 
                className={`
                    md:hidden absolute top-0 left-0 right-0 h-16 flex justify-center items-end text-brand-primary pointer-events-none
                    ${!isDragging ? 'transition-transform duration-300 ease-out' : ''}
                `}
                style={{ 
                    transform: `translateY(${isRefreshing ? 0 : pullDistance - 64}px)`,
                }}
            >
                <div 
                    className="bg-brand-surface dark:bg-brand-surface-dark w-10 h-10 rounded-full shadow-lg flex items-center justify-center"
                    style={{ opacity: isRefreshing ? 1 : Math.min(pullDistance / PULL_THRESHOLD, 1) }}
                >
                    {isRefreshing ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-primary"></div>
                    ) : (
                        <i 
                            className="fas fa-arrow-down transition-transform duration-200"
                            style={{ transform: `rotate(${pullDistance > PULL_THRESHOLD ? 180 : 0}deg)` }}
                        ></i>
                    )}
                </div>
            </div>
          )}
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
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(() => {
    return localStorage.getItem('hasCompletedOnboarding') === 'true';
  });

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    setIsOnboardingComplete(true);
  };

  return (
    <ThemeProvider>
      <UserDataProvider username="defaultUser">
        {isOnboardingComplete ? (
          <AppContent />
        ) : (
          <OnboardingPage onComplete={handleOnboardingComplete} />
        )}
      </UserDataProvider>
    </ThemeProvider>
  );
};

export default App;