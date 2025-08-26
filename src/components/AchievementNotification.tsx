import React, { useEffect, useState } from 'react';
import { Trophy, X } from 'lucide-react';
import { getAchievementName } from '../utils/storage';

interface AchievementNotificationProps {
  achievements: string[];
  onClose: () => void;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({ 
  achievements, 
  onClose 
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (achievements.length > 0) {
      setVisible(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [achievements, onClose]);

  if (achievements.length === 0) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg">Achievement Unlocked!</h4>
              <div className="space-y-1">
                {achievements.map((achievement, index) => (
                  <p key={index} className="text-sm opacity-90">
                    🏆 {getAchievementName(achievement)}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementNotification;