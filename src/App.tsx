import React, { useState } from 'react';
import { Keyboard, Trophy, Clock, Target, BarChart3, Home } from 'lucide-react';
import LevelSelection from './components/LevelSelection';
import TypingPractice from './components/TypingPractice';
import Statistics from './components/Statistics';

export interface TypingStats {
  wpm: number;
  accuracy: number;
  completedLessons: number;
  totalTime: number;
  bestWpm: number;
  bestAccuracy: number;
}

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'practice' | 'stats'>('home');
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced' | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<number>(0);
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 0,
    completedLessons: 0,
    totalTime: 0,
    bestWpm: 0,
    bestAccuracy: 0,
  });

  const handleLevelSelect = (level: 'beginner' | 'intermediate' | 'advanced', lesson: number) => {
    setSelectedLevel(level);
    setSelectedLesson(lesson);
    setCurrentView('practice');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedLevel(null);
  };

  const updateStats = (newStats: Partial<TypingStats>) => {
    setStats(prev => ({
      ...prev,
      ...newStats,
      bestWpm: Math.max(prev.bestWpm, newStats.wpm || 0),
      bestAccuracy: Math.max(prev.bestAccuracy, newStats.accuracy || 0),
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Keyboard className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TypeShala
              </h1>
            </div>
            
            <nav className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('home')}
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
                onClick={() => setCurrentView('stats')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  currentView === 'stats'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Statistics</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && (
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
                    <p className="text-2xl font-bold text-gray-900">{stats.bestWpm}</p>
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
                    <p className="text-2xl font-bold text-gray-900">{stats.bestAccuracy}%</p>
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
                    <p className="text-2xl font-bold text-gray-900">{stats.completedLessons}</p>
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
                    <p className="text-2xl font-bold text-gray-900">{Math.round(stats.totalTime / 60)}m</p>
                  </div>
                </div>
              </div>
            </div>

            <LevelSelection onLevelSelect={handleLevelSelect} />
          </div>
        )}

        {currentView === 'practice' && selectedLevel && (
          <TypingPractice
            level={selectedLevel}
            lesson={selectedLesson}
            onBack={handleBackToHome}
            onStatsUpdate={updateStats}
          />
        )}

        {currentView === 'stats' && (
          <Statistics stats={stats} />
        )}
      </main>
    </div>
  );
}

export default App;