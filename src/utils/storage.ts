export interface UserProgress {
  userId: string;
  stats: {
    wpm: number;
    accuracy: number;
    completedLessons: number;
    totalTime: number;
    bestWpm: number;
    bestAccuracy: number;
  };
  lessonProgress: {
    [level: string]: {
      [lesson: number]: {
        completed: boolean;
        bestWpm: number;
        bestAccuracy: number;
        attempts: number;
        totalTime: number;
        lastAttempt: string;
      };
    };
  };
  sessionData: {
    currentStreak: number;
    lastPracticeDate: string;
    totalSessions: number;
    averageSessionTime: number;
  };
  achievements: string[];
  createdAt: string;
  lastUpdated: string;
}

const STORAGE_KEY = 'typeshala_progress';
const SESSION_KEY = 'typeshala_session';

// Generate a unique user ID
const generateUserId = (): string => {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Get current session ID
export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

// Initialize default progress
const createDefaultProgress = (): UserProgress => {
  return {
    userId: generateUserId(),
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
};

// Load progress from localStorage
export const loadProgress = (): UserProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const progress = JSON.parse(stored) as UserProgress;
      // Ensure all required fields exist (for backward compatibility)
      const defaultProgress = createDefaultProgress();
      const mergedProgress = {
        ...defaultProgress,
        ...progress,
        stats: {
          ...defaultProgress.stats,
          ...progress.stats,
        },
        lessonProgress: {
          beginner: {},
          intermediate: {},
          advanced: {},
          ...progress.lessonProgress,
        },
        sessionData: {
          ...defaultProgress.sessionData,
          ...progress.sessionData,
        },
      };
      return mergedProgress;
    }
  } catch (error) {
    console.error('Error loading progress:', error);
    // Clear corrupted data
    localStorage.removeItem(STORAGE_KEY);
  }
  return createDefaultProgress();
};

// Save progress to localStorage
export const saveProgress = (progress: UserProgress): void => {
  try {
    progress.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

// Update lesson progress
export const updateLessonProgress = (
  progress: UserProgress,
  level: string,
  lesson: number,
  stats: { wpm: number; accuracy: number; time: number }
): UserProgress => {
  const updatedProgress = { ...progress };
  
  if (!updatedProgress.lessonProgress[level]) {
    updatedProgress.lessonProgress[level] = {};
  }
  
  const currentLesson = updatedProgress.lessonProgress[level][lesson] || {
    completed: false,
    bestWpm: 0,
    bestAccuracy: 0,
    attempts: 0,
    totalTime: 0,
    lastAttempt: '',
  };
  
  // Update lesson-specific progress
  updatedProgress.lessonProgress[level][lesson] = {
    completed: stats.accuracy >= 80, // Consider completed if accuracy >= 80%
    bestWpm: Math.max(currentLesson.bestWpm, stats.wpm),
    bestAccuracy: Math.max(currentLesson.bestAccuracy, stats.accuracy),
    attempts: currentLesson.attempts + 1,
    totalTime: currentLesson.totalTime + stats.time,
    lastAttempt: new Date().toISOString(),
  };
  
  // Update overall stats
  updatedProgress.stats.bestWpm = Math.max(updatedProgress.stats.bestWpm, stats.wpm);
  updatedProgress.stats.bestAccuracy = Math.max(updatedProgress.stats.bestAccuracy, stats.accuracy);
  updatedProgress.stats.totalTime += stats.time;
  
  // Count completed lessons
  let completedCount = 0;
  Object.values(updatedProgress.lessonProgress).forEach(levelProgress => {
    Object.values(levelProgress).forEach(lessonData => {
      if (lessonData.completed) completedCount++;
    });
  });
  updatedProgress.stats.completedLessons = completedCount;
  
  // Update session data
  const today = new Date().toDateString();
  const lastPracticeDate = updatedProgress.sessionData.lastPracticeDate;
  
  if (lastPracticeDate !== today) {
    updatedProgress.sessionData.totalSessions += 1;
    updatedProgress.sessionData.lastPracticeDate = today;
    
    // Update streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastPracticeDate === yesterday.toDateString()) {
      updatedProgress.sessionData.currentStreak += 1;
    } else if (lastPracticeDate !== today) {
      updatedProgress.sessionData.currentStreak = 1;
    }
  }
  
  // Calculate average session time
  if (updatedProgress.sessionData.totalSessions > 0) {
    updatedProgress.sessionData.averageSessionTime = 
      updatedProgress.stats.totalTime / updatedProgress.sessionData.totalSessions;
  }
  
  // Check for new achievements
  updatedProgress.achievements = checkAchievements(updatedProgress);
  
  return updatedProgress;
};

// Check for achievements
const checkAchievements = (progress: UserProgress): string[] => {
  const achievements = [...progress.achievements];
  
  const achievementChecks = [
    { id: 'first_lesson', condition: progress.stats.completedLessons >= 1, name: 'First Steps' },
    { id: 'speed_demon_25', condition: progress.stats.bestWpm >= 25, name: 'Speed Demon (25 WPM)' },
    { id: 'speed_demon_40', condition: progress.stats.bestWpm >= 40, name: 'Speed Demon (40 WPM)' },
    { id: 'speed_demon_60', condition: progress.stats.bestWpm >= 60, name: 'Speed Demon (60 WPM)' },
    { id: 'accuracy_master', condition: progress.stats.bestAccuracy >= 95, name: 'Accuracy Master' },
    { id: 'dedicated_learner', condition: progress.stats.completedLessons >= 5, name: 'Dedicated Learner' },
    { id: 'typing_expert', condition: progress.stats.completedLessons >= 10, name: 'Typing Expert' },
    { id: 'practice_streak_7', condition: progress.sessionData.currentStreak >= 7, name: '7-Day Streak' },
    { id: 'practice_streak_30', condition: progress.sessionData.currentStreak >= 30, name: '30-Day Streak' },
    { id: 'marathon_typist', condition: progress.stats.totalTime >= 3600, name: 'Marathon Typist (1 hour)' },
  ];
  
  achievementChecks.forEach(achievement => {
    if (achievement.condition && !achievements.includes(achievement.id)) {
      achievements.push(achievement.id);
    }
  });
  
  return achievements;
};

// Get achievement display name
export const getAchievementName = (achievementId: string): string => {
  const achievementNames: { [key: string]: string } = {
    'first_lesson': 'First Steps',
    'speed_demon_25': 'Speed Demon (25 WPM)',
    'speed_demon_40': 'Speed Demon (40 WPM)',
    'speed_demon_60': 'Speed Demon (60 WPM)',
    'accuracy_master': 'Accuracy Master',
    'dedicated_learner': 'Dedicated Learner',
    'typing_expert': 'Typing Expert',
    'practice_streak_7': '7-Day Streak',
    'practice_streak_30': '30-Day Streak',
    'marathon_typist': 'Marathon Typist (1 hour)',
  };
  
  return achievementNames[achievementId] || achievementId;
};

// Export progress data
export const exportProgress = (): string => {
  const progress = loadProgress();
  return JSON.stringify(progress, null, 2);
};

// Import progress data
export const importProgress = (data: string): boolean => {
  try {
    const progress = JSON.parse(data) as UserProgress;
    saveProgress(progress);
    return true;
  } catch (error) {
    console.error('Error importing progress:', error);
    return false;
  }
};

// Clear all progress
export const clearProgress = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(SESSION_KEY);
};