import React from 'react';
import { Play, Star, Award, Zap } from 'lucide-react';

interface LevelSelectionProps {
  onLevelSelect: (level: 'beginner' | 'intermediate' | 'advanced', lesson: number) => void;
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

const LevelSelection: React.FC<LevelSelectionProps> = ({ onLevelSelect }) => {
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
                {level.lessons.map((lesson, index) => (
                  <button
                    key={index}
                    onClick={() => onLevelSelect(levelKey, index)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border border-${level.color}-200 hover:bg-${level.color}-50 transition-all group`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full bg-${level.color}-100 flex items-center justify-center text-xs font-medium text-${level.color}-600`}>
                        {index + 1}
                      </div>
                      <span className="text-sm text-gray-700 text-left">{lesson}</span>
                    </div>
                    <Play className={`h-4 w-4 text-${level.color}-400 group-hover:text-${level.color}-600 transition-colors`} />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LevelSelection;