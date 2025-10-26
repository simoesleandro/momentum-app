import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AppData, UserDataContextType, BodyMeasurement, ReportsData, Workout, Exercise, WeightLog, AppSettings, ChatMessage, WeeklySummary, WaterIntakeLog } from '../types';
import { INITIAL_USER_DATA } from '../constants';
import { ACHIEVEMENTS, Achievement, getXPForNextLevel } from '../data/gamification';

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(INITIAL_USER_DATA);
  const [loading, setLoading] = useState(true);
  const [newlyUnlockedAchievement, setNewlyUnlockedAchievement] = useState<Achievement | null>(null);
  const [newlyLeveledUp, setNewlyLeveledUp] = useState<number | null>(null);

  const checkAndUnlockAchievements = useCallback((currentData: AppData): AppData => {
    let updatedData = { ...currentData };
    let xpGainedFromAchievements = 0;

    for (const achievement of ACHIEVEMENTS) {
        if (!updatedData.unlockedAchievements.includes(achievement.id) && achievement.isUnlocked(updatedData)) {
            updatedData.unlockedAchievements = [...updatedData.unlockedAchievements, achievement.id];
            setNewlyUnlockedAchievement(achievement);
            xpGainedFromAchievements += achievement.xpReward || 0;
        }
    }

    if (xpGainedFromAchievements > 0) {
        let newXP = updatedData.xp + xpGainedFromAchievements;
        let newLevel = updatedData.level;
        let xpForNextLevel = getXPForNextLevel(newLevel);

        while (newXP >= xpForNextLevel) {
            newXP -= xpForNextLevel;
            newLevel++;
            setNewlyLeveledUp(newLevel);
            xpForNextLevel = getXPForNextLevel(newLevel);
        }
        updatedData = { ...updatedData, xp: newXP, level: newLevel };
    }
    
    return updatedData;
  }, []);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('fitnessDashboardData');
      if (storedData) {
        let parsedData = JSON.parse(storedData);
        
        if (!parsedData.calendarSchedule) {
          parsedData.calendarSchedule = INITIAL_USER_DATA.calendarSchedule;
        }
        if (!parsedData.unlockedAchievements) {
          parsedData.unlockedAchievements = [];
        }
        if (!parsedData.settings) {
            parsedData.settings = INITIAL_USER_DATA.settings;
        }
        if (typeof parsedData.level !== 'number') {
            parsedData.level = 1;
        }
        if (typeof parsedData.xp !== 'number') {
            parsedData.xp = 0;
        }
        if (!Array.isArray(parsedData.nutritionChatHistory)) {
            parsedData.nutritionChatHistory = [];
        }
         if (!parsedData.waterIntakeLog) {
          parsedData.waterIntakeLog = [];
        }
        if (!parsedData.waterGoal) {
          parsedData.waterGoal = 2.5;
        }

        setData(checkAndUnlockAchievements(parsedData));
      } else {
        setData(checkAndUnlockAchievements(INITIAL_USER_DATA));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setData(INITIAL_USER_DATA);
    } finally {
      setLoading(false);
    }
  }, [checkAndUnlockAchievements]);

  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('fitnessDashboardData', JSON.stringify(data));
      } catch (error) {
        console.error("Failed to save data to localStorage", error);
      }
    }
  }, [data, loading]);
  
  const addXP = useCallback((amount: number) => {
    setData(prevData => {
        let newXP = prevData.xp + amount;
        let newLevel = prevData.level;
        let xpForNextLevel = getXPForNextLevel(newLevel);

        while(newXP >= xpForNextLevel) {
            newXP -= xpForNextLevel;
            newLevel++;
            setNewlyLeveledUp(newLevel);
            xpForNextLevel = getXPForNextLevel(newLevel);
        }

        const updatedData = { ...prevData, xp: newXP, level: newLevel };
        return checkAndUnlockAchievements(updatedData);
    });
  }, [checkAndUnlockAchievements]);

  const addWeightEntry = useCallback((weight: number) => {
    const today = new Date().toISOString().split('T')[0];
    setData(prevData => {
      const newLog = [...prevData.weightLog];
      const todayEntryIndex = newLog.findIndex(entry => entry.date === today);
      if (todayEntryIndex !== -1) {
        newLog[todayEntryIndex] = { date: today, weight };
      } else {
        newLog.push({ date: today, weight });
        addXP(10);
      }
      const updatedData = { ...prevData, weightLog: newLog };
      return checkAndUnlockAchievements(updatedData);
    });
  }, [checkAndUnlockAchievements, addXP]);
  
  const addWaterIntake = useCallback((amount: number) => {
    const today = new Date().toISOString().split('T')[0];
    setData(prevData => {
      const newLog = [...prevData.waterIntakeLog];
      const todayEntryIndex = newLog.findIndex(entry => entry.date === today);

      if (todayEntryIndex !== -1) {
        const newAmount = Math.max(0, newLog[todayEntryIndex].amount + amount);
        newLog[todayEntryIndex] = { ...newLog[todayEntryIndex], amount: newAmount };
      } else {
        newLog.push({ date: today, amount: Math.max(0, amount) });
      }
      return { ...prevData, waterIntakeLog: newLog };
    });
  }, []);

  const getTodayWaterIntake = useCallback((): WaterIntakeLog => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = data.waterIntakeLog.find(entry => entry.date === today);
    return todayEntry || { date: today, amount: 0 };
  }, [data.waterIntakeLog]);

  const isStreakAtRisk = useCallback((): boolean => {
    const todayStr = new Date().toISOString().split('T')[0];
    const isScheduledToday = !!data.calendarSchedule[todayStr];
    const hasAttendedToday = data.attendance.includes(todayStr);
    return isScheduledToday && !hasAttendedToday;
  }, [data.calendarSchedule, data.attendance]);

  const updateExerciseLoad = useCallback((workoutId: string, exerciseId: string, newLoad: number) => {
    const today = new Date().toISOString().split('T')[0];
    setData(prevData => {
      const newWorkouts = prevData.workouts.map(w => {
        if (w.id === workoutId) {
          const newExercises = w.exercises.map(ex => {
            if (ex.id === exerciseId) {
              const newHistory = [...ex.loadHistory, { date: today, load: newLoad }];
              return { ...ex, currentLoad: newLoad, loadHistory: newHistory };
            }
            return ex;
          });
          return { ...w, exercises: newExercises };
        }
        return w;
      });
      return { ...prevData, workouts: newWorkouts };
    });
  }, []);
  
  const updateExercise = useCallback((workoutId: string, exerciseId: string, newExerciseName: string) => {
    setData(prevData => {
      const newWorkouts = prevData.workouts.map(w => {
        if (w.id === workoutId) {
          const newExercises = w.exercises.map(ex => {
            if (ex.id === exerciseId) {
              return { ...ex, name: newExerciseName };
            }
            return ex;
          });
          return { ...w, exercises: newExercises };
        }
        return w;
      });
      return { ...prevData, workouts: newWorkouts };
    });
  }, []);

  const addAttendance = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    setData(prevData => {
      if (prevData.attendance.includes(today)) {
        return prevData;
      }
      addXP(25);
      const updatedData = { ...prevData, attendance: [...prevData.attendance, today] };
      return checkAndUnlockAchievements(updatedData);
    });
  }, [checkAndUnlockAchievements, addXP]);

  const addBodyMeasurement = useCallback((measurement: Omit<BodyMeasurement, 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    setData(prevData => {
        const newMeasurements = [...prevData.bodyMeasurements];
        const todayEntryIndex = newMeasurements.findIndex(entry => entry.date === today);

        const filteredMeasurement = Object.entries(measurement).reduce((acc, [key, value]) => {
            if (value && value > 0) {
                acc[key as keyof typeof measurement] = value;
            }
            return acc;
        }, {} as Omit<BodyMeasurement, 'date'>);

        if (Object.keys(filteredMeasurement).length === 0) return prevData;

        if (todayEntryIndex !== -1) {
            newMeasurements[todayEntryIndex] = { ...newMeasurements[todayEntryIndex], ...filteredMeasurement };
        } else {
            newMeasurements.push({ date: today, ...filteredMeasurement });
        }
        return { ...prevData, bodyMeasurements: newMeasurements };
    });
  }, []);

  const addProgressPhoto = useCallback((photoData: { photoUrl: string; notes?: string }) => {
      const today = new Date().toISOString().split('T')[0];
      const newPhoto = {
          id: `photo-${Date.now()}`,
          date: today,
          ...photoData
      };
      setData(prevData => {
        addXP(50);
        const updatedData = {
          ...prevData,
          progressPhotos: [...prevData.progressPhotos, newPhoto]
        };
        return checkAndUnlockAchievements(updatedData);
      });
  }, [checkAndUnlockAchievements, addXP]);

  const updateProgressPhoto = useCallback((photoId: string, updatedData: { photoUrl?: string; notes?: string }) => {
    setData(prevData => ({
      ...prevData,
      progressPhotos: prevData.progressPhotos.map(photo =>
        photo.id === photoId ? { ...photo, ...updatedData, notes: updatedData.notes || '' } : photo
      )
    }));
  }, []);
  
  const deleteProgressPhoto = useCallback((photoId: string) => {
    setData(prevData => {
      const photoToDelete = prevData.progressPhotos.find(photo => photo.id === photoId);
      
      if (photoToDelete?.photoUrl?.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(photoToDelete.photoUrl);
        } catch (e) {
          console.warn('Error revoking blob URL:', e);
        }
      }
      
      return {
        ...prevData,
        progressPhotos: prevData.progressPhotos.filter(photo => photo.id !== photoId)
      };
    });
  }, []);
  
  const addWorkout = useCallback((workoutData: { name: string; intensity: number; exercises: { name: string; group: string; setsReps: string }[] }) => {
    setData(prevData => {
      const existingIds = prevData.workouts.map(w => w.id);
      const lastId = existingIds.length > 0 ? existingIds.sort().pop()! : '@';
      const newId = String.fromCharCode(lastId.charCodeAt(0) + 1);

      const newWorkout: Workout = {
        id: newId,
        name: workoutData.name,
        intensity: workoutData.intensity,
        exercises: workoutData.exercises.map((ex, index): Exercise => ({
          ...ex,
          id: `${newId.toLowerCase()}${index + 1}`,
          currentLoad: 0,
          loadHistory: [],
        })),
      };
      
      addXP(100);
      const updatedData = { 
        ...prevData, 
        workouts: [...prevData.workouts, newWorkout],
      };
      return checkAndUnlockAchievements(updatedData);
    });
  }, [checkAndUnlockAchievements, addXP]);

  const updateWorkout = useCallback((workoutData: { id: string; name: string; intensity: number; exercises: { id?: string; name: string; group: string; setsReps: string; currentLoad: number }[] }) => {
    const today = new Date().toISOString().split('T')[0];
    setData(prevData => {
      const workoutIndex = prevData.workouts.findIndex(w => w.id === workoutData.id);
      if (workoutIndex === -1) return prevData;

      const originalWorkout = prevData.workouts[workoutIndex];
      
      const updatedExercises = workoutData.exercises.map((exData, index) => {
        const originalExercise = exData.id ? originalWorkout.exercises.find(ex => ex.id === exData.id) : undefined;
        
        if (originalExercise) {
          const loadChanged = originalExercise.currentLoad !== exData.currentLoad;
          const newHistory = loadChanged 
            ? [...originalExercise.loadHistory, { date: today, load: exData.currentLoad }] 
            : originalExercise.loadHistory;
          
          return {
            ...originalExercise,
            name: exData.name,
            group: exData.group,
            setsReps: exData.setsReps,
            currentLoad: exData.currentLoad,
            loadHistory: newHistory,
          };
        } else {
          return {
            id: `${workoutData.id.toLowerCase()}${Date.now()}${index}`,
            name: exData.name,
            group: exData.group,
            setsReps: exData.setsReps,
            currentLoad: exData.currentLoad,
            loadHistory: exData.currentLoad > 0 ? [{ date: today, load: exData.currentLoad }] : [],
          };
        }
      });

      const updatedWorkout: Workout = {
        ...originalWorkout,
        name: workoutData.name,
        intensity: workoutData.intensity,
        exercises: updatedExercises,
      };

      const newWorkouts = [...prevData.workouts];
      newWorkouts[workoutIndex] = updatedWorkout;
      
      return {
        ...prevData,
        workouts: newWorkouts,
      };
    });
  }, []);

  const deleteWorkout = useCallback((workoutId: string) => {
    setData(prevData => {
      const newWorkouts = prevData.workouts.filter(w => w.id !== workoutId);
      const newSchedule = { ...prevData.calendarSchedule };
      Object.entries(newSchedule).forEach(([date, id]) => {
        if (id === workoutId) {
          delete newSchedule[date];
        }
      });
      return { ...prevData, workouts: newWorkouts, calendarSchedule: newSchedule };
    });
  }, []);

  const updateCalendarDate = useCallback((date: string, workoutId: string | null) => {
    setData(prevData => {
        const newSchedule = { ...prevData.calendarSchedule };
        if (workoutId === null) {
            delete newSchedule[date];
        } else {
            newSchedule[date] = workoutId;
        }
        return {
            ...prevData,
            calendarSchedule: newSchedule,
        };
    });
  }, []);

  const updateProfilePicture = useCallback((newUrl: string) => {
    setData(prevData => ({
      ...prevData,
      profilePictureUrl: newUrl,
    }));
  }, []);

  const updateProfile = useCallback((profileData: { userName: string; height: number; }) => {
    setData(prevData => ({
      ...prevData,
      userName: profileData.userName,
      height: profileData.height,
    }));
  }, []);

  const updateSettings = useCallback((settings: AppSettings) => {
    setData(prevData => ({
      ...prevData,
      settings: settings,
    }));
  }, []);

  const exportData = useCallback(() => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `martas_dashboard_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }, [data]);

  const importData = useCallback((jsonString: string) => {
    try {
      const importedData = JSON.parse(jsonString);
      if (importedData.userName && Array.isArray(importedData.workouts)) {
        setData(importedData);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (error) {
      console.error("Failed to import data:", error);
      throw error;
    }
  }, []);

  const resetData = useCallback(() => {
    setData(INITIAL_USER_DATA);
  }, []);

  const getCurrentWeight = useCallback(() => {
    if (data.weightLog.length === 0) return data.initialWeight;
    return [...data.weightLog].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].weight;
  }, [data.weightLog, data.initialWeight]);
  
  const getFormattedWeightLog = useCallback(() => {
      return data.weightLog.map(entry => ({
          date: new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          peso: entry.weight
      })).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data.weightLog]);
  
  const getExerciseLoadHistory = useCallback((workoutId: string, exerciseId: string) => {
    const workout = data.workouts.find(w => w.id === workoutId);
    if (!workout) return [];
    const exercise = workout.exercises.find(e => e.id === exerciseId);
    if (!exercise) return [];
    
    return exercise.loadHistory.map(h => ({
      date: new Date(h.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      carga: h.load,
    })).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data.workouts]);

  const getFormattedBodyMeasurements = useCallback(() => {
    return data.bodyMeasurements
      .map(entry => {
        const formattedEntry: { date: string; [key: string]: number | string } = {
          date: new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        };
        if (entry.waist) formattedEntry['Cintura'] = entry.waist;
        if (entry.hips) formattedEntry['Quadril'] = entry.hips;
        if (entry.chest) formattedEntry['Peito'] = entry.chest;
        if (entry.arms) formattedEntry['Braços'] = entry.arms;
        if (entry.legs) formattedEntry['Pernas'] = entry.legs;
        return formattedEntry;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data.bodyMeasurements]);

  const getReportsData = useCallback((timeframe: '30d' | '90d' | 'all'): ReportsData => {
    const now = new Date();
    let startDate = new Date('2000-01-01');

    if (timeframe === '30d') {
      startDate = new Date(new Date().setDate(now.getDate() - 30));
    } else if (timeframe === '90d') {
      startDate = new Date(new Date().setDate(now.getDate() - 90));
    }

    const filterByDate = <T extends { date: string }>(arr: T[]): T[] => arr.filter(item => new Date(item.date) >= startDate);
    
    const filteredAttendance = filterByDate(data.attendance.map(date => ({ date })));
    const filteredWeightLog: WeightLog[] = filterByDate(data.weightLog);
    const filteredMeasurements: BodyMeasurement[] = filterByDate(data.bodyMeasurements);

    let scheduledDays = 0;
    const today = new Date();
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        if (data.calendarSchedule[dateStr]) {
            scheduledDays++;
        }
    }
    const attendanceRate = scheduledDays > 0 ? (filteredAttendance.length / scheduledDays) * 100 : 0;

    const firstWeight = filteredWeightLog[0]?.weight ?? data.initialWeight;
    const lastWeight = filteredWeightLog[filteredWeightLog.length - 1]?.weight ?? getCurrentWeight();
    const weightChange = lastWeight - firstWeight;

    const measurementChanges: { [key: string]: number } = {};
    const measurementKeys: (keyof Omit<BodyMeasurement, 'date'>)[] = ['waist', 'hips', 'chest', 'arms', 'legs'];
    measurementKeys.forEach(key => {
        const startValue = filteredMeasurements.find(m => m[key])?.[key];
        const endValue = [...filteredMeasurements].reverse().find(m => m[key])?.[key];
        if (startValue && endValue) {
            measurementChanges[key] = endValue - startValue;
        }
    });

    const exerciseProgress = data.workouts.flatMap(w => w.exercises.map(ex => {
        const historyInFrame = ex.loadHistory.filter(h => new Date(h.date) >= startDate);
        const startLoad = historyInFrame[0]?.load ?? ex.currentLoad;
        const currentLoad = ex.currentLoad;
        const increase = startLoad > 0 ? ((currentLoad - startLoad) / startLoad) * 100 : 0;
        return { name: ex.name, startLoad, currentLoad, increase };
    }));

    return {
        totalWorkouts: filteredAttendance.length,
        attendanceRate,
        weightChange,
        measurementChanges,
        exerciseProgress,
    };
  }, [data, getCurrentWeight]);
  
  const getWeeklySummary = useCallback((): WeeklySummary => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    startDate.setHours(0, 0, 0, 0);

    const weekAttendance = data.attendance.filter(dateStr => new Date(dateStr) >= startDate);
    
    let scheduledWorkoutsThisWeek = 0;
    for (let i=0; i<7; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        if (data.calendarSchedule[dateStr]) {
            scheduledWorkoutsThisWeek++;
        }
    }

    const minutesTrained = weekAttendance.length * 60;
    const caloriesBurned = weekAttendance.length * 400;
    
    return {
        workoutsCompleted: weekAttendance.length,
        workoutsScheduled: scheduledWorkoutsThisWeek,
        minutesTrained,
        caloriesBurned
    };
  }, [data.attendance, data.calendarSchedule]);
  
  const getPreviousWeekSummary = useCallback((): WeeklySummary => {
      const today = new Date();
      const dayOfWeek = today.getDay();

      const endDate = new Date(today);
      endDate.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -7 : 0));
      endDate.setHours(23, 59, 59, 999);

      const startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);

      const weekAttendance = data.attendance.filter(dateStr => {
          const d = new Date(dateStr);
          return d >= startDate && d <= endDate;
      });

      let scheduledWorkouts = 0;
      for (let i = 0; i < 7; i++) {
          const d = new Date(startDate);
          d.setDate(startDate.getDate() + i);
          const dateStr = d.toISOString().split('T')[0];
          if (data.calendarSchedule[dateStr]) {
              scheduledWorkouts++;
          }
      }

      const minutesTrained = weekAttendance.length * 60;
      const caloriesBurned = weekAttendance.length * 400;

      return {
          workoutsCompleted: weekAttendance.length,
          workoutsScheduled: scheduledWorkouts,
          minutesTrained,
          caloriesBurned
      };
  }, [data.attendance, data.calendarSchedule]);

  const getLatestWeightEntries = useCallback((count = 5) => {
    return [...data.weightLog]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, count);
  }, [data.weightLog]);
  
  const calculateStreak = useCallback(() => {
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
  }, [data.attendance, data.calendarSchedule]);
  
  const getRecentAchievements = useCallback((count: number) => {
      const unlocked = data.unlockedAchievements
          .map(id => ACHIEVEMENTS.find(ach => ach.id === id))
          .filter((ach): ach is Achievement => !!ach);
      return unlocked.slice(-count).reverse();
  }, [data.unlockedAchievements]);

  const logNutritionChat = useCallback((chat: ChatMessage[]) => {
      setData(prevData => {
        const updatedData = { ...prevData, nutritionChatHistory: chat };
        return checkAndUnlockAchievements(updatedData);
      });
  }, [checkAndUnlockAchievements]);

  const clearNewlyUnlockedAchievement = useCallback(() => setNewlyUnlockedAchievement(null), []);
  const clearNewlyLeveledUp = useCallback(() => setNewlyLeveledUp(null), []);

  const value = { 
    data, 
    loading, 
    addXP, 
    addWeightEntry, 
    updateExerciseLoad, 
    updateExercise, 
    addAttendance, 
    addBodyMeasurement, 
    addProgressPhoto, 
    updateProgressPhoto, 
    deleteProgressPhoto, 
    addWorkout, 
    updateWorkout, 
    deleteWorkout, 
    updateCalendarDate, 
    getCurrentWeight, 
    getFormattedWeightLog, 
    getExerciseLoadHistory, 
    getFormattedBodyMeasurements, 
    getReportsData, 
    updateProfilePicture, 
    updateProfile, 
    getWeeklySummary, 
    getPreviousWeekSummary, 
    getLatestWeightEntries, 
    updateSettings, 
    exportData, 
    importData, 
    resetData, 
    logNutritionChat, 
    calculateStreak, 
    getRecentAchievements, 
    addWaterIntake, 
    getTodayWaterIntake, 
    isStreakAtRisk, 
    newlyUnlockedAchievement, 
    clearNewlyUnlockedAchievement, 
    newlyLeveledUp, 
    clearNewlyLeveledUp 
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = (): UserDataContextType => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};