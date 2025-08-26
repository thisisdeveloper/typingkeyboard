import { useState, useEffect } from 'react';
import { 
  UserProgress, 
  loadProgress, 
  saveProgress, 
  updateLessonProgress,
  getSessionId 
} from '../utils/storage';

export const useProgress = () => {
  const [progress, setProgress] = useState<UserProgress>(loadProgress());
  const [sessionId] = useState(getSessionId());

  // Save progress whenever it changes
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // Load progress on mount and listen for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setProgress(loadProgress());
    };

    // Listen for storage changes from other tabs
    window.addEventListener('storage', handleStorageChange);
    
    // Also check for updates periodically
    const interval = setInterval(() => {
      const currentProgress = loadProgress();
      setProgress(prev => {
        // Only update if the data has actually changed
        if (JSON.stringify(prev) !== JSON.stringify(currentProgress)) {
          return currentProgress;
        }
        return prev;
      });
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);
  const updateProgress = (
    level: string,
    lesson: number,
    stats: { wpm: number; accuracy: number; time: number }
  ) => {
    setProgress(prevProgress => {
      const updatedProgress = updateLessonProgress(prevProgress, level, lesson, stats);
      // Immediately save to localStorage
      saveProgress(updatedProgress);
      return updatedProgress;
    });
  };

  const resetProgress = () => {
    const newProgress = {
      userId: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      stats: {
        wpm: 0,
        accuracy: 0,
        completedLessons: 0,
        totalTime: 0,
        bestWpm: 0,
        bestAccuracy: 0,
      },
      lessonProgress: {
        beginner: {},
        intermediate: {},
        advanced: {},
      },
      sessionData: {
        currentStreak: 0,
        lastPracticeDate: '',
        totalSessions: 0,
        averageSessionTime: 0,
      },
      achievements: [],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    setProgress(newProgress);
    saveProgress(newProgress);
  };

  const getLessonStatus = (level: string, lesson: number) => {
    return progress.lessonProgress[level]?.[lesson] || {
      completed: false,
      bestWpm: 0,
      bestAccuracy: 0,
      attempts: 0,
      totalTime: 0,
      lastAttempt: '',
    };
  };

  const getNewAchievements = (oldProgress: UserProgress, newProgress: UserProgress) => {
    return newProgress.achievements.filter(achievement => 
      !oldProgress.achievements.includes(achievement)
    );
  };

  return {
    progress,
    sessionId,
    updateProgress,
    resetProgress,
    getLessonStatus,
    getNewAchievements,
  };
};