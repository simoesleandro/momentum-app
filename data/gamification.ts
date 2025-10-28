import type { AppData } from '../types';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // Font Awesome class
  xpReward?: number;
  isUnlocked: (data: AppData, streak?: number) => boolean;
  progress?: (data: AppData, streak?: number) => { current: number; goal: number };
}

export const getXPForNextLevel = (level: number): number => {
    return 100 + (level - 1) * 50;
};

const calculateStreak = (data: AppData): number => {
    let streak = 0;
    const sortedAttendance = [...data.attendance].sort((a,b) => new Date(b).getTime() - new Date(a).getTime());

    if (sortedAttendance.length === 0) return 0;
    
    const todayDate = new Date();
    todayDate.setHours(0,0,0,0);
    
    const mostRecentDate = new Date(sortedAttendance[0]);
    mostRecentDate.setHours(0,0,0,0);

    const diffTime = todayDate.getTime() - mostRecentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 1) return 0;

    for (let i = 0; i < sortedAttendance.length; i++) {
        const attendanceDate = new Date(sortedAttendance[i]);
        const attendanceDateStr = attendanceDate.toISOString().split('T')[0];
        
        if (i > 0) {
            const prevDate = new Date(sortedAttendance[i-1]);
            const dateDiff = Math.round((prevDate.getTime() - attendanceDate.getTime()) / (1000 * 3600 * 24));
            
            let gapIsExcused = true;
            for (let j = 1; j < dateDiff; j++) {
                const gapDate = new Date(attendanceDate);
                gapDate.setDate(attendanceDate.getDate() + j);
                const gapDateStr = gapDate.toISOString().split('T')[0];
                if (data.calendarSchedule[gapDateStr]) {
                    gapIsExcused = false;
                    break;
                }
            }
            if (!gapIsExcused) break;
        }

        if (data.calendarSchedule[attendanceDateStr]) {
            streak++;
        }
    }
    return streak;
}


export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'welcome',
        name: 'Bem-vindo(a)!',
        description: 'Começou a sua jornada para uma vida mais saudável.',
        icon: 'fas fa-door-open',
        xpReward: 10,
        isUnlocked: () => true,
    },
    {
        id: 'first_checkin',
        name: 'Primeiro Check-in',
        description: 'Registou o seu primeiro treino. O primeiro passo está dado!',
        icon: 'fas fa-check',
        xpReward: 25,
        isUnlocked: (data) => data.attendance.length >= 1,
        progress: (data) => ({ current: Math.min(data.attendance.length, 1), goal: 1 }),
    },
    {
        id: 'initiation_week',
        name: 'Semana de Iniciação',
        description: 'Completou 3 treinos. A consistência é a chave!',
        icon: 'fas fa-calendar-week',
        xpReward: 50,
        isUnlocked: (data) => data.attendance.length >= 3,
        progress: (data) => ({ current: Math.min(data.attendance.length, 3), goal: 3 }),
    },
     {
        id: 'fire_streak',
        name: 'Sequência de Fogo!',
        description: 'Manteve uma sequência de 5 treinos consecutivos.',
        icon: 'fas fa-fire',
        xpReward: 75,
        isUnlocked: (data) => calculateStreak(data) >= 5,
        progress: (data) => ({ current: Math.min(calculateStreak(data), 5), goal: 5 }),
    },
    {
        id: 'super_streak',
        name: 'Super Sequência',
        description: 'Manteve uma sequência de 10 treinos. Nada o para!',
        icon: 'fas fa-rocket',
        xpReward: 150,
        isUnlocked: (data) => calculateStreak(data) >= 10,
        progress: (data) => ({ current: Math.min(calculateStreak(data), 10), goal: 10 }),
    },
    {
        id: 'steel_month',
        name: 'Mês de Aço',
        description: 'Completou 12 treinos num mês. Você é imparável!',
        icon: 'fas fa-calendar-alt',
        xpReward: 100,
        isUnlocked: (data) => data.attendance.length >= 12,
        progress: (data) => ({ current: Math.min(data.attendance.length, 12), goal: 12 }),
    },
    {
        id: 'veteran',
        name: 'Veterano(a) de Treinos',
        description: 'Completou 50 treinos no total. Um marco incrível!',
        icon: 'fas fa-shield-halved',
        xpReward: 200,
        isUnlocked: (data) => data.attendance.length >= 50,
        progress: (data) => ({ current: Math.min(data.attendance.length, 50), goal: 50 }),
    },
    {
        id: 'centurion',
        name: 'Centurião',
        description: 'Completou 100 treinos. Verdadeira lenda do fitness!',
        icon: 'fas fa-crown',
        xpReward: 500,
        isUnlocked: (data) => data.attendance.length >= 100,
        progress: (data) => ({ current: Math.min(data.attendance.length, 100), goal: 100 }),
    },
    {
        id: 'goal_achiever',
        name: 'Meta Atingida!',
        description: 'Alcançou o seu peso-alvo. Parabéns pela sua dedicação!',
        icon: 'fas fa-bullseye',
        xpReward: 300,
        isUnlocked: (data) => {
            // This achievement should only be unlocked after the user has started their journey,
            // so we require at least one weight entry after the initial one.
            if (data.weightLog.length < 2) {
                return false;
            }

            const currentWeight = [...data.weightLog].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].weight;
            const goalIsToLose = data.initialWeight > data.goalWeight;

            if (goalIsToLose) {
                return currentWeight <= data.goalWeight;
            } else {
                return currentWeight >= data.goalWeight;
            }
        }
    },
    {
        id: 'on_the_right_track',
        name: 'No Caminho Certo',
        description: 'Registou o seu peso 5 vezes. Acompanhar é evoluir!',
        icon: 'fas fa-chart-line',
        xpReward: 50,
        isUnlocked: (data) => data.weightLog.length >= 5,
        progress: (data) => ({ current: Math.min(data.weightLog.length, 5), goal: 5 }),
    },
    {
        id: 'progress_photographer',
        name: 'Fotógrafo(a) de Progresso',
        description: 'Adicionou a sua primeira foto de progresso.',
        icon: 'fas fa-camera-retro',
        xpReward: 40,
        isUnlocked: (data) => data.progressPhotos.length >= 1,
        progress: (data) => ({ current: Math.min(data.progressPhotos.length, 1), goal: 1 }),
    },
    {
        id: 'photo_journalist',
        name: 'Fotojornalista',
        description: 'Documentou a sua jornada com 5 fotos de progresso.',
        icon: 'fas fa-book-open',
        xpReward: 80,
        isUnlocked: (data) => data.progressPhotos.length >= 5,
        progress: (data) => ({ current: Math.min(data.progressPhotos.length, 5), goal: 5 }),
    },
    {
        id: 'workout_architect',
        name: 'Arquiteto(a) de Treinos',
        description: 'Criou o seu próprio plano de treino personalizado.',
        icon: 'fas fa-pencil-ruler',
        xpReward: 100,
        isUnlocked: (data) => data.workouts.length > 3,
        progress: (data) => ({ current: Math.min(data.workouts.length - 3, 1), goal: 1 }),
    },
    {
        id: 'nutrition_nerd',
        name: 'Nerd da Nutrição',
        description: 'Consultou o assistente nutricional 5 vezes.',
        icon: 'fas fa-brain',
        xpReward: 60,
        isUnlocked: (data) => (data.nutritionChatHistory?.filter(m => m.role === 'user').length || 0) >= 5,
        progress: (data) => ({ current: Math.min((data.nutritionChatHistory?.filter(m => m.role === 'user').length || 0), 5), goal: 5 }),
    },
    {
        id: 'level_5_club',
        name: 'Clube Nível 5',
        description: 'Alcançou o nível 5. A sua jornada está a progredir!',
        icon: 'fas fa-star',
        xpReward: 100,
        isUnlocked: (data) => data.level >= 5,
        progress: (data) => ({ current: Math.min(data.level, 5), goal: 5 }),
    },
];