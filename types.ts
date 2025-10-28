import type { Achievement } from "./data/gamification";

export type Page = 'Início' | 'Plano de Treino' | 'Agenda' | 'Assiduidade' | 'Progresso' | 'Guia Nutricional' | 'Biblioteca de Exercícios' | 'Relatórios' | 'Configurações' | 'Conquistas';

export interface Exercise {
  id: string;
  name: string;
  group: string;
  sets: number;
  reps: string;
  currentLoad: number;
  loadHistory: { date: string; load: number }[];
}

export interface Workout {
  id:string;
  name: string;
  intensity: number;
  exercises: Exercise[];
}

export interface WeightLog {
  date: string;
  weight: number;
}

export interface WaterIntakeLog {
  date: string;
  amount: number; // in Liters
}

export interface BodyMeasurement {
  date: string;
  waist?: number;
  hips?: number;
  chest?: number;
  arms?: number;
  legs?: number;
}

export interface ProgressPhoto {
  id: string;
  date: string;
  photoUrl: string;
  notes?: string;
}

export interface ExerciseDetail {
  name: string;
  description: string;
  gifUrl: string;
}

export interface AppSettings {
  units: 'kg' | 'lbs';
  notifications: {
    workoutReminders: boolean;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface AppData {
  userName: string;
  profilePictureUrl: string;
  height: number;
  goalWeight: number;
  initialWeight: number;
  level: number;
  xp: number;
  workouts: Workout[];
  weightLog: WeightLog[];
  waterIntakeLog: WaterIntakeLog[];
  waterGoal: number; // in Liters
  attendance: string[];
  bodyMeasurements: BodyMeasurement[];
  progressPhotos: ProgressPhoto[];
  calendarSchedule: { [date: string]: string | null }; // YYYY-MM-DD -> workoutId
  unlockedAchievements: string[];
  nutritionChatHistory: ChatMessage[];
  settings: AppSettings;
}

export interface ExerciseProgressReport {
    name: string;
    startLoad: number;
    currentLoad: number;
    increase: number;
}

export interface ReportsData {
    totalWorkouts: number;
    attendanceRate: number;
    weightChange: number;
    measurementChanges: { [key: string]: number };
    exerciseProgress: ExerciseProgressReport[];
}

export interface WeeklySummary {
    workoutsCompleted: number;
    workoutsScheduled: number;
    minutesTrained: number;
    caloriesBurned: number;
}

export interface UserDataContextType {
  data: AppData;
  loading: boolean;
  initializeUser: (details: { userName: string; height: number; initialWeight: number; goalWeight: number }) => void;
  addXP: (amount: number) => void;
  addWeightEntry: (weight: number) => void;
  updateExerciseLoad: (workoutId: string, exerciseId: string, newLoad: number) => void;
  updateExercise: (workoutId: string, exerciseId: string, newExerciseName: string) => void;
  addAttendance: () => void;
  addBodyMeasurement: (measurement: Omit<BodyMeasurement, 'date'>) => void;
  addProgressPhoto: (photoData: { photoUrl: string; notes?: string }) => void;
  updateProgressPhoto: (photoId: string, updatedData: { photoUrl?: string; notes?: string }) => void;
  deleteProgressPhoto: (photoId: string) => void;
  addWorkout: (workout: { name: string; intensity: number; exercises: { name: string; group: string; sets: number; reps: string }[] }) => void;
  updateWorkout: (workout: { id: string; name: string; intensity: number; exercises: { id?: string; name: string; group: string; sets: number; reps: string; currentLoad: number }[] }) => void;
  deleteWorkout: (workoutId: string) => void;
  updateCalendarDate: (date: string, workoutId: string | null) => void;
  getCurrentWeight: () => number;
  getFormattedWeightLog: () => { date: string, peso: number }[];
  getExerciseLoadHistory: (workoutId: string, exerciseId: string) => { date: string; carga: number }[];
  getFormattedBodyMeasurements: () => { date: string; [key: string]: number | string }[];
  getReportsData: (timeframe: '30d' | '90d' | 'all') => ReportsData;
  updateProfilePicture: (newUrl: string) => void;
  updateProfile: (profileData: { userName: string; height: number; }) => void;
  getWeeklySummary: () => WeeklySummary;
  getPreviousWeekSummary: () => WeeklySummary;
  getLatestWeightEntries: (count?: number) => WeightLog[];
  updateSettings: (settings: AppSettings) => void;
  exportData: () => void;
  importData: (jsonString: string) => void;
  resetData: () => void;
  logNutritionChat: (chat: ChatMessage[]) => void;
  calculateStreak: () => number;
  getRecentAchievements: (count: number) => Achievement[];
  addWaterIntake: (amount: number) => void;
  getTodayWaterIntake: () => WaterIntakeLog;
  getWeeklyWaterIntake: () => { day: string; consumed: number }[];
  isStreakAtRisk: () => boolean;
  newlyUnlockedAchievement: Achievement | null;
  clearNewlyUnlockedAchievement: () => void;
  newlyLeveledUp: number | null;
  clearNewlyLeveledUp: () => void;
}