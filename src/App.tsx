import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Keyboard, Trophy, Clock, Target, BarChart3, Home, Database } from 'lucide-react';
import LevelSelection from './components/LevelSelection';
import TypingPractice from './components/TypingPractice';
import Statistics from './components/Statistics';
import ProgressDashboard from './components/ProgressDashboard';
import AchievementNotification from './components/AchievementNotification';
import { useProgress } from './hooks/useProgress';
import { UserProgress } from './utils/storage';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const { progress, updateProgress, resetProgress, getLessonStatus, getNewAchievements } = useProgress();

  const getCurrentView = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/statistics') return 'stats';
    if (path === '/progress') return 'progress';
    if (path.startsWith('/practice')) return 'practice';
    return 'home';
  };

  const handleLevelSelect = (level: 'beginner' | 'intermediate' | 'advanced', lesson: number) => {
    navigate(`/practice/${level}/${lesson}`);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleStatsUpdate = (level: string, lesson: number, stats: { wpm: number; accuracy: number; time: number }) => {
    const oldProgress = { ...progress };
    updateProgress(level, lesson, stats);
    
    // Check for new achievements
    setTimeout(() => {
      // Reload progress to get the latest state
      const currentProgress = { ...progress };
      const achievements = getNewAchievements(oldProgress, currentProgress);
      if (achievements.length > 0) {
        setNewAchievements(achievements);
      }
    }, 200);
  };

  const handleCloseAchievements = () => {
    setNewAchievements([]);
  };

  const currentView = getCurrentView();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3 flex-1">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Keyboard className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TypeShala
                </h1>
                {currentView === 'practice' && (
                  <BreadcrumbNavigation />
                )}
              </div>
            </div>
            
            <nav className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  currentView === 'home'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </button>
              
              <button
                onClick={() => navigate('/statistics')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  currentView === 'stats'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Statistics</span>
              </button>
              
              <button
                onClick={() => navigate('/progress')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  currentView === 'progress'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <Database className="h-4 w-4" />
                <span>Progress</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<HomePage progress={progress} onLevelSelect={handleLevelSelect} />} />
          <Route path="/statistics" element={<Statistics stats={progress.stats} />} />
          <Route path="/progress" element={<ProgressDashboard progress={progress} />} />
          <Route 
            path="/practice/:level/:lesson" 
            element={
              <PracticeRoute 
                onBack={handleBackToHome}
                onStatsUpdate={handleStatsUpdate}
                getLessonStatus={getLessonStatus}
              />
            } 
          />
        </Routes>
      </main>
      
      {/* Achievement Notifications */}
      <AchievementNotification 
        achievements={newAchievements}
        onClose={handleCloseAchievements}
      />
    </div>
  );
}

// Home Page Component
const HomePage: React.FC<{
  progress: UserProgress;
  onLevelSelect: (level: 'beginner' | 'intermediate' | 'advanced', lesson: number) => void;
}> = ({ progress, onLevelSelect }) => (
  <div className="space-y-8">
    {/* Hero Section */}
    <div className="text-center space-y-4">
      <h2 className="text-4xl font-bold text-gray-900">
        Master Touch Typing
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Learn to type faster and more accurately with our interactive lessons. 
        Progress through different levels and track your improvement.
      </p>
    </div>

    {/* Quick Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Best WPM</p>
            <p className="text-2xl font-bold text-gray-900">{progress.stats.bestWpm}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <Target className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Best Accuracy</p>
            <p className="text-2xl font-bold text-gray-900">{progress.stats.bestAccuracy}%</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Trophy className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-gray-900">{progress.stats.completedLessons}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="flex items-center space-x-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Clock className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Time</p>
            <p className="text-2xl font-bold text-gray-900">{Math.round(progress.stats.totalTime / 60)}m</p>
          </div>
        </div>
      </div>
    </div>

    <LevelSelection onLevelSelect={onLevelSelect} progress={progress} />
  </div>
);

// Practice Route Component
const PracticeRoute: React.FC<{
  onBack: () => void;
  onStatsUpdate: (level: string, lesson: number, stats: { wpm: number; accuracy: number; time: number }) => void;
  getLessonStatus: (level: string, lesson: number) => any;
}> = ({ onBack, onStatsUpdate, getLessonStatus }) => {
  const { level, lesson } = useParams<{ level: string; lesson: string }>();
  const navigate = useNavigate();
  
  // Validate parameters
  if (!level || !lesson || !['beginner', 'intermediate', 'advanced'].includes(level)) {
    React.useEffect(() => {
      navigate('/');
    }, [navigate]);
    return null;
  }
  
  const lessonNumber = parseInt(lesson);
  if (isNaN(lessonNumber) || lessonNumber < 0 || lessonNumber > 4) {
    React.useEffect(() => {
      navigate('/');
    }, [navigate]);
    return null;
  }
  
  return (
    <TypingPractice
      level={level as 'beginner' | 'intermediate' | 'advanced'}
      lesson={lessonNumber}
      onBack={onBack}
      onStatsUpdate={onStatsUpdate}
      lessonStatus={getLessonStatus(level, lessonNumber)}
    />
  );
};

// Breadcrumb Navigation Component
const BreadcrumbNavigation: React.FC = () => {
  const { level, lesson } = useParams<{ level: string; lesson: string }>();
  
  if (!level || !lesson) return null;
  
  const capitalizedLevel = level.charAt(0).toUpperCase() + level.slice(1);
  const lessonNumber = parseInt(lesson) + 1;
  
  return (
    <div className="flex items-center space-x-2 text-gray-600">
      <span className="text-gray-400">></span>
      <span className="text-sm font-medium">
        {capitalizedLevel} - Lesson {lessonNumber}
      </span>
    </div>
  );
};

export default App;