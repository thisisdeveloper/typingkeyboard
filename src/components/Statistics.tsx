import React from 'react';
import { TrendingUp, Target, Clock, Trophy, BarChart3, Award } from 'lucide-react';
import { TypingStats } from '../App';

interface StatisticsProps {
  stats: TypingStats;
}

const Statistics: React.FC<StatisticsProps> = ({ stats }) => {
  const getWpmRating = (wpm: number) => {
    if (wpm >= 60) return { label: 'Expert', color: 'purple', description: 'Outstanding typing speed!' };
    if (wpm >= 40) return { label: 'Advanced', color: 'blue', description: 'Great typing speed!' };
    if (wpm >= 25) return { label: 'Intermediate', color: 'green', description: 'Good progress!' };
    if (wpm >= 10) return { label: 'Beginner', color: 'yellow', description: 'Keep practicing!' };
    return { label: 'Learning', color: 'gray', description: 'Just getting started!' };
  };

  const getAccuracyRating = (accuracy: number) => {
    if (accuracy >= 95) return { label: 'Excellent', color: 'green' };
    if (accuracy >= 85) return { label: 'Good', color: 'blue' };
    if (accuracy >= 75) return { label: 'Fair', color: 'yellow' };
    return { label: 'Needs Work', color: 'red' };
  };

  const wpmRating = getWpmRating(stats.bestWpm);
  const accuracyRating = getAccuracyRating(stats.bestAccuracy);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Progress</h2>
        <p className="text-gray-600">Track your typing improvement over time</p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium bg-${wpmRating.color}-100 text-${wpmRating.color}-700`}>
              {wpmRating.label}
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.bestWpm}</h3>
          <p className="text-gray-600 text-sm">Best WPM</p>
          <p className="text-xs text-gray-500 mt-1">{wpmRating.description}</p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium bg-${accuracyRating.color}-100 text-${accuracyRating.color}-700`}>
              {accuracyRating.label}
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.bestAccuracy}%</h3>
          <p className="text-gray-600 text-sm">Best Accuracy</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${stats.bestAccuracy}%` }}
            />
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Trophy className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.completedLessons}</h3>
          <p className="text-gray-600 text-sm">Lessons Completed</p>
          <div className="flex items-center mt-2 space-x-1">
            {[...Array(5)].map((_, i) => (
              <Award
                key={i}
                className={`h-3 w-3 ${
                  i < stats.completedLessons ? 'text-yellow-500' : 'text-gray-300'
                }`}
                fill="currentColor"
              />
            ))}
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {Math.round(stats.totalTime / 60)}
          </h3>
          <p className="text-gray-600 text-sm">Minutes Practiced</p>
          <p className="text-xs text-gray-500 mt-1">
            {Math.round(stats.totalTime)} seconds total
          </p>
        </div>
      </div>

      {/* Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-6">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Speed (WPM)</span>
                <span className="text-sm font-medium">{stats.bestWpm}/60</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${Math.min((stats.bestWpm / 60) * 100, 100)}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Accuracy</span>
                <span className="text-sm font-medium">{stats.bestAccuracy}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all"
                  style={{ width: `${stats.bestAccuracy}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Lessons Progress</span>
                <span className="text-sm font-medium">{stats.completedLessons}/15</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-purple-600 h-3 rounded-full transition-all"
                  style={{ width: `${(stats.completedLessons / 15) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-6">
            <Target className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Goals & Achievements</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${stats.bestWpm >= 25 ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm">Reach 25 WPM</span>
              </div>
              {stats.bestWpm >= 25 && <Award className="h-4 w-4 text-yellow-500" fill="currentColor" />}
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${stats.bestAccuracy >= 90 ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm">Achieve 90% Accuracy</span>
              </div>
              {stats.bestAccuracy >= 90 && <Award className="h-4 w-4 text-yellow-500" fill="currentColor" />}
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${stats.completedLessons >= 5 ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm">Complete 5 Lessons</span>
              </div>
              {stats.completedLessons >= 5 && <Award className="h-4 w-4 text-yellow-500" fill="currentColor" />}
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${stats.totalTime >= 1800 ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm">Practice for 30 Minutes</span>
              </div>
              {stats.totalTime >= 1800 && <Award className="h-4 w-4 text-yellow-500" fill="currentColor" />}
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Tips to Improve</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="space-y-2">
            <p>• <strong>Focus on accuracy first</strong> - Speed will come naturally</p>
            <p>• <strong>Use proper finger placement</strong> - Follow the color-coded keyboard</p>
            <p>• <strong>Don't look at the keyboard</strong> - Trust your muscle memory</p>
          </div>
          <div className="space-y-2">
            <p>• <strong>Practice regularly</strong> - Even 10 minutes daily helps</p>
            <p>• <strong>Maintain good posture</strong> - Sit straight and relax</p>
            <p>• <strong>Be patient</strong> - Progress takes time and practice</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;