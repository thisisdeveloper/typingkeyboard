import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RotateCcw, Clock, Target, Zap } from 'lucide-react';
import VirtualKeyboard from './VirtualKeyboard';

interface TypingPracticeProps {
  level: 'beginner' | 'intermediate' | 'advanced';
  lesson: number;
  onBack: () => void;
  onStatsUpdate: (level: string, lesson: number, stats: { wpm: number; accuracy: number; time: number }) => void;
  lessonStatus: {
    completed: boolean;
    bestWpm: number;
    bestAccuracy: number;
    attempts: number;
    totalTime: number;
    lastAttempt: string;
  };
}

const lessonTexts = {
  beginner: [
    'asdf jkl; asdf jkl; asdf jkl; add ask dad sad fad lad',
    'qwer tyui qwer tyui qwer tyui wet try quo poi tea',
    'zxcv bnm, zxcv bnm, zxcv bnm, zip box can vim man',
    'the quick brown fox jumps over the lazy dog near the river',
    'She sells sea shells by the sea shore. The shells are beautiful.',
  ],
  intermediate: [
    '1234 5678 90 1234 5678 90 The year 2025 is almost here',
    '!@#$ %^&* () !@#$ %^&* () Email: user@example.com (password)',
    'Hello, world! How are you today? I hope you\'re doing well.',
    'The Quick Brown Fox Jumps Over The Lazy Dog Every Day.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  ],
  advanced: [
    'function calculateSum(a: number, b: number): number { return a + b; }',
    'The advanced user interface provides comprehensive functionality for data analysis and visualization.',
    'Achieve maximum efficiency through consistent practice and dedicated focus on accuracy over speed.',
    'Professional development requires continuous learning, adaptation, and improvement.',
    'Technology evolves rapidly; therefore, maintaining current knowledge and skills becomes increasingly important.',
  ]
};

const playBeepSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (error) {
    // Fallback for browsers that don't support Web Audio API
    console.log('Beep sound not supported');
  }
};

const TypingPractice: React.FC<TypingPracticeProps> = ({ 
  level, 
  lesson, 
  onBack, 
  onStatsUpdate, 
  lessonStatus 
}) => {
  const [text] = useState(lessonTexts[level][lesson]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [errors, setErrors] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [finalTime, setFinalTime] = useState<number | null>(null);
  const [selectedTimeout, setSelectedTimeout] = useState<number | null>(null);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  // Timeout effect
  useEffect(() => {
    if (selectedTimeout && startTime && !isCompleted && !timeoutReached) {
      const timeoutId = setTimeout(() => {
        setTimeoutReached(true);
        setIsCompleted(true);
        const completionTime = selectedTimeout;
        setFinalTime(completionTime);
        const finalWpm = Math.round((userInput.length / 5) / (completionTime / 60));
        const finalAccuracy = Math.round(((userInput.length - errors.length) / userInput.length) * 100) || 0;
        
        setWpm(finalWpm);
        setAccuracy(finalAccuracy);
        
        onStatsUpdate(level, lesson, {
          wpm: finalWpm,
          accuracy: finalAccuracy,
          time: completionTime,
        });
      }, selectedTimeout * 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedTimeout, startTime, isCompleted, timeoutReached, userInput.length, errors.length, onStatsUpdate, level, lesson]);
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isCompleted || timeoutReached) return;
      
      // Prevent default behavior for certain keys
      if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Tab') {
        e.preventDefault();
      }
      
      // Handle backspace
      if (e.key === 'Backspace') {
        if (userInput.length > 0) {
          const newInput = userInput.slice(0, -1);
          setUserInput(newInput);
          setCurrentIndex(newInput.length);
        }
        return;
      }
      
      // Handle regular character input
      if (e.key.length === 1 && userInput.length < text.length) {
        // Check if the typed character is incorrect and play beep sound
        if (e.key !== text[userInput.length]) {
          playBeepSound();
        }
        
        const newInput = userInput + e.key;
        setUserInput(newInput);
        setCurrentIndex(newInput.length);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [userInput, text.length, isCompleted, timeoutReached]);
  useEffect(() => {
    if (userInput.length === 1 && !startTime) {
      setStartTime(Date.now());
    }

    if (userInput.length <= text.length && !isCompleted && !timeoutReached) {
      const newErrors: number[] = [];
      for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] !== text[i]) {
          newErrors.push(i);
        }
      }
      setErrors(newErrors);

      // Calculate real-time stats
      if (startTime && userInput.length > 0 && !isCompleted && !timeoutReached) {
        const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
        const wordsTyped = userInput.length / 5; // assuming 5 characters per word
        const currentWpm = Math.round(wordsTyped / timeElapsed);
        const currentAccuracy = Math.round(((userInput.length - newErrors.length) / userInput.length) * 100);
        
        setWpm(isNaN(currentWpm) ? 0 : currentWpm);
        setAccuracy(isNaN(currentAccuracy) ? 100 : currentAccuracy);
      }

      if (userInput === text && !timeoutReached) {
        setIsCompleted(true);
        const completionTime = startTime ? (Date.now() - startTime) / 1000 : 0;
        setFinalTime(completionTime);
        const finalWpm = Math.round((text.length / 5) / (completionTime / 60));
        const finalAccuracy = Math.round(((text.length - errors.length) / text.length) * 100);
        
        setWpm(finalWpm);
        setAccuracy(finalAccuracy);
        
        onStatsUpdate(level, lesson, {
          wpm: finalWpm,
          accuracy: finalAccuracy,
          time: completionTime,
        });
      }
    }
  }, [userInput, text, startTime, errors.length, isCompleted, timeoutReached, onStatsUpdate, level, lesson]);


  const resetPractice = () => {
    setUserInput('');
    setCurrentIndex(0);
    setErrors([]);
    setStartTime(null);
    setIsCompleted(false);
    setTimeoutReached(false);
    setFinalTime(null);
    setWpm(0);
    setAccuracy(100);
    setSelectedTimeout(null);
    if (containerRef.current) {
      containerRef.current.focus();
    }
  };

  const handleTimeoutSelect = (minutes: number) => {
    const seconds = minutes * 60;
    setSelectedTimeout(seconds);
    setTimeoutReached(false);
  };

  const getCurrentChar = () => {
    return currentIndex < text.length ? text[currentIndex] : '';
  };

  const getRemainingTime = () => {
    if (!selectedTimeout || !startTime || isCompleted || timeoutReached) return null;
    const elapsed = (Date.now() - startTime) / 1000;
    const remaining = Math.max(0, selectedTimeout - elapsed);
    return Math.ceil(remaining);
  };

  const remainingTime = getRemainingTime();

  const getRecommendedPracticeTime = () => {
    switch (level) {
      case 'beginner':
        return '5-10 minutes recommended for beginners';
      case 'intermediate':
        return '10-15 minutes recommended for intermediate';
      case 'advanced':
        return '15-40 minutes recommended for advanced';
      default:
        return '';
    }
  };

  return (
    <div ref={containerRef} className="space-y-6 outline-none" tabIndex={0}>
      {/* Typing Area */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
        {lessonStatus.attempts > 0 && (
          <div className={`mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200 transition-all duration-500 ${
            startTime ? 'opacity-0 max-h-0 overflow-hidden mb-0 p-0' : 'opacity-100 max-h-20'
          }`}>
            <div className="text-sm text-blue-800 font-medium mb-2">Previous Best Performance</div>
            <div className="flex items-center space-x-6 text-sm text-blue-700">
              <span className="flex items-center space-x-1">
                <Zap className="h-4 w-4" />
                <span>{lessonStatus.bestWpm} WPM</span>
              </span>
              <span className="flex items-center space-x-1">
                <Target className="h-4 w-4" />
                <span>{lessonStatus.bestAccuracy}% Accuracy</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{lessonStatus.attempts} attempts</span>
              </span>
            </div>
          </div>
        )}

        <div className="text-2xl leading-relaxed font-mono bg-gray-50 p-6 rounded-xl mb-4 border">
          {text.split('').map((char, index) => (
            <span
              key={index}
              className={`${
                index < userInput.length
                  ? errors.includes(index)
                    ? 'bg-red-200 text-red-700'
                    : 'bg-green-200 text-green-700'
                  : index === currentIndex
                  ? 'bg-blue-400 text-white animate-pulse border-2 border-blue-600'
                  : 'text-gray-700'
              }`}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Stats Display - Split into two parts */}
        <div className="flex bg-gray-50 rounded-lg mb-4 overflow-hidden">
          {/* Left side - 75% width - Stats */}
          <div className="flex-1 px-6 py-3" style={{ width: '75%' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-gray-500">Speed:</span>
                <span className="text-xs font-medium">{wpm} WPM</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Progress:</span>
                <span className="text-xs font-medium">{Math.round((userInput.length / text.length) * 100)}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="text-xs text-gray-500">Accuracy:</span>
                <span className="text-xs font-medium">{accuracy}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-gray-500">Time:</span>
                <span className="text-xs font-medium">
                  {isCompleted && finalTime ? Math.round(finalTime) : 
                   startTime && !isCompleted ? Math.round((Date.now() - startTime) / 1000) : 0}s
                </span>
              </div>
            </div>
          </div>
          
          {/* Right side - 25% width - Timeout controls */}
          <div className="border-l border-gray-200 px-4 py-3" style={{ width: '25%' }}>
            <div className="flex items-center justify-between space-x-2">
              {/* Timeout buttons */}
              <div className="flex space-x-1">
                {[5, 10, 15, 40, 60].map((minutes) => (
                  <button
                    key={minutes}
                    onClick={() => handleTimeoutSelect(minutes)}
                    disabled={startTime !== null}
                    className={`px-2 py-1 text-xs rounded transition-all ${
                      selectedTimeout === minutes * 60
                        ? 'bg-orange-500 text-white'
                        : startTime
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    }`}
                  >
                    {minutes >= 60 ? `${minutes/60}H` : `${minutes}M`}
                  </button>
                ))}
              </div>
              
              {/* Reset button */}
              <button
                onClick={resetPractice}
                className="flex items-center space-x-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-all text-xs"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            </div>
            
            {/* Remaining time display */}
            {selectedTimeout && remainingTime !== null && (
              <div className="mt-2 text-center">
                <div className={`text-xs font-medium ${
                  remainingTime <= 30 ? 'text-red-600' : 
                  remainingTime <= 60 ? 'text-orange-600' : 'text-gray-600'
                }`}>
                  {remainingTime >= 3600 
                    ? `${Math.floor(remainingTime / 3600)}:${Math.floor((remainingTime % 3600) / 60).toString().padStart(2, '0')}:${(remainingTime % 60).toString().padStart(2, '0')} left`
                    : `${Math.floor(remainingTime / 60)}:${(remainingTime % 60).toString().padStart(2, '0')} left`
                  }
                </div>
              </div>
            )}
            
            {/* Level-based practice time recommendation */}
            {!startTime && (
              <div className="mt-2 text-center">
                <div className="text-xs text-gray-500">
                  {getRecommendedPracticeTime()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Typed Text Display */}
        {(isCompleted || timeoutReached) && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">
              {timeoutReached ? '⏰ Time\'s Up!' : '🎉 Lesson Completed!'}
            </h4>
            <p className="text-green-700">
              {timeoutReached 
                ? `Time's up! You typed at ${wpm} WPM with ${accuracy}% accuracy in ${
                    selectedTimeout && selectedTimeout >= 3600 
                      ? `${selectedTimeout / 3600} hour${selectedTimeout > 3600 ? 's' : ''}`
                      : `${selectedTimeout ? selectedTimeout / 60 : 0} minutes`
                  }.`
                : `Great job! You typed at ${wpm} WPM with ${accuracy}% accuracy.`
              }
              {lessonStatus.bestWpm > 0 && wpm > lessonStatus.bestWpm && (
                <span className="block mt-1 font-medium">🚀 New personal best WPM!</span>
              )}
              {lessonStatus.bestAccuracy > 0 && accuracy > lessonStatus.bestAccuracy && (
                <span className="block mt-1 font-medium">🎯 New personal best accuracy!</span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Virtual Keyboard */}
      <VirtualKeyboard currentChar={getCurrentChar()} />
    </div>
  );
};

export default TypingPractice;