import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Star, Award, Zap, CheckCircle, Clock } from 'lucide-react';
import { UserProgress } from '../utils/storage';

interface LevelSelectionProps {
  onLevelSelect: (level: 'beginner' | 'intermediate' | 'advanced', lesson: number) => void;
  progress: UserProgress;
}

const levels = {
  beginner: {
    title: 'Beginner',
    description: 'Learn basic finger positioning and simple words',
    icon: Star,
    color: 'green',
    lessons: [
      'Home row keys (A S D F J K L ;)',
      'Top row keys (Q W E R T Y U I O P)',
      'Bottom row keys (Z X C V B N M)',
      'Common words practice',
      'Simple sentences',
    ]
  },
  intermediate: {
    title: 'Intermediate',
    description: 'Practice with numbers, punctuation, and longer texts',
    icon: Award,
    color: 'blue',
    lessons: [
      'Number row (1 2 3 4 5 6 7 8 9 0)',
      'Special characters (! @ # $ % ^ & * ( ))',
      'Punctuation and symbols',
      'Capitalization practice',
      'Paragraph typing',
    ]
  },
  advanced: {
    title: 'Advanced',
    description: 'Master complex texts and achieve high speed',
    icon: Zap,
    color: 'purple',
    lessons: [
      'Programming code snippets',
      'Technical documentation',
      'Speed challenges',
      'Advanced punctuation',
      'Professional texts',
    ]
  }
};

const LevelSelection: React.FC<LevelSelectionProps> = ({ onLevelSelect, progress }) => {
  const navigate = useNavigate();
  
  const getLessonStatus = (level: string, lessonIndex: number) => {
    return progress.lessonProgress[level]?.[lessonIndex];
  };

  const handleLessonClick = (level: 'beginner' | 'intermediate' | 'advanced', lesson: number) => {
    onLevelSelect(level, lesson);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Level</h3>
        <p className="text-gray-600">Select a difficulty level and start practicing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {Object.entries(levels).map(([key, level]) => {
          const Icon = level.icon;
          const levelKey = key as 'beginner' | 'intermediate' | 'advanced';
          
          return (
            <div
              key={key}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-center mb-6">
                <div className={`inline-flex p-3 rounded-full bg-${level.color}-100 mb-4`}>
                  <Icon className={`h-8 w-8 text-${level.color}-600`} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{level.title}</h4>
                <p className="text-gray-600">{level.description}</p>
              </div>

              <div className="space-y-3">
                {level.lessons.map((lesson, index) => {
                  const lessonStatus = getLessonStatus(levelKey, index);
                  const isCompleted = lessonStatus?.completed || false;
                  const hasAttempts = lessonStatus?.attempts > 0;
                  
                  return (
                    <button
                    key={index}
                    onClick={() => handleLessonClick(levelKey, index)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all group ${
                      isCompleted 
                        ? `border-green-300 bg-green-50 hover:bg-green-100`
                        : hasAttempts
                        ? `border-yellow-300 bg-yellow-50 hover:bg-yellow-100`
                        : `border-${level.color}-200 hover:bg-${level.color}-50`
                    }`}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        isCompleted 
                          ? 'bg-green-100 text-green-600'
                          : hasAttempts
                          ? 'bg-yellow-100 text-yellow-600'
                          : `bg-${level.color}-100 text-${level.color}-600`
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <span className="text-sm text-gray-700">{lesson}</span>
                        {lessonStatus && (
                          <div className="text-xs text-gray-500 mt-1 flex items-center space-x-3">
                            <span>Best: {lessonStatus.bestWpm} WPM</span>
                            <span>{lessonStatus.bestAccuracy}% Acc</span>
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{lessonStatus.attempts} attempts</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Play className={`h-4 w-4 transition-colors ${
                      isCompleted 
                        ? 'text-green-400 group-hover:text-green-600'
                        : hasAttempts
                        ? 'text-yellow-400 group-hover:text-yellow-600'
                        : `text-${level.color}-400 group-hover:text-${level.color}-600`
                    }`} />
                  </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LevelSelection;