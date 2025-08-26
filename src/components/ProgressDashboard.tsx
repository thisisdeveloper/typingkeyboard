import React from 'react';
import { Calendar, Clock, Target, Trophy, Flame, Award } from 'lucide-react';
import { UserProgress, getAchievementName } from '../utils/storage';

interface ProgressDashboardProps {
  progress: UserProgress;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ progress }) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-600 bg-purple-100';
    if (streak >= 7) return 'text-orange-600 bg-orange-100';
    if (streak >= 3) return 'text-blue-600 bg-blue-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="space-y-6">
      {/* Session Info */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`inline-flex p-3 rounded-full ${getStreakColor(progress.sessionData.currentStreak)} mb-2`}>
              <Flame className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{progress.sessionData.currentStreak}</p>
            <p className="text-sm text-gray-600">Day Streak</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 p-3 rounded-full inline-flex mb-2">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{progress.sessionData.totalSessions}</p>
            <p className="text-sm text-gray-600">Total Sessions</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 p-3 rounded-full inline-flex mb-2">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatTime(progress.sessionData.averageSessionTime)}
            </p>
            <p className="text-sm text-gray-600">Avg Session</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 p-3 rounded-full inline-flex mb-2">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatTime(progress.stats.totalTime)}</p>
            <p className="text-sm text-gray-600">Total Time</p>
          </div>
        </div>
      </div>

      {/* Lesson Progress */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lesson Progress</h3>
        <div className="space-y-4">
          {Object.entries(progress.lessonProgress).map(([level, lessons]) => {
            const completedLessons = Object.values(lessons).filter(lesson => lesson.completed).length;
            const totalLessons = 5; // Each level has 5 lessons
            const progressPercentage = (completedLessons / totalLessons) * 100;
            
            return (
              <div key={level} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 capitalize">{level}</span>
                  <span className="text-sm text-gray-500">{completedLessons}/{totalLessons}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      level === 'beginner' ? 'bg-green-600' :
                      level === 'intermediate' ? 'bg-blue-600' : 'bg-purple-600'
                    }`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="flex items-center space-x-2 mb-4">
          <Trophy className="h-5 w-5 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
            {progress.achievements.length}
          </span>
        </div>
        
        {progress.achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {progress.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <Award className="h-5 w-5 text-yellow-600" fill="currentColor" />
                <span className="text-sm font-medium text-yellow-800">
                  {getAchievementName(achievement)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No achievements yet. Keep practicing to unlock them!</p>
        )}
      </div>

      {/* Detailed Lesson Stats */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Progress</h3>
        <div className="space-y-4">
          {Object.entries(progress.lessonProgress).map(([level, lessons]) => (
            <div key={level} className="space-y-2">
              <h4 className="font-medium text-gray-800 capitalize">{level} Level</h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                {Array.from({ length: 5 }, (_, index) => {
                  const lessonData = lessons[index];
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border text-center ${
                        lessonData?.completed
                          ? 'bg-green-50 border-green-200'
                          : lessonData?.attempts > 0
                          ? 'bg-yellow-50 border-yellow-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="text-sm font-medium">Lesson {index + 1}</div>
                      {lessonData ? (
                        <div className="text-xs text-gray-600 mt-1">
                          <div>Best: {lessonData.bestWpm} WPM</div>
                          <div>{lessonData.bestAccuracy}% Acc</div>
                          <div>{lessonData.attempts} attempts</div>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 mt-1">Not started</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;