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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isCompleted) return;
      
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
  }, [userInput, text.length, isCompleted]);
  useEffect(() => {
    if (userInput.length === 1 && !startTime) {
      setStartTime(Date.now());
    }

    if (userInput.length <= text.length && !isCompleted) {
      const newErrors: number[] = [];
      for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] !== text[i]) {
          newErrors.push(i);
        }
      }
      setErrors(newErrors);

      // Calculate real-time stats
      if (startTime && userInput.length > 0 && !isCompleted) {
        const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
        const wordsTyped = userInput.length / 5; // assuming 5 characters per word
        const currentWpm = Math.round(wordsTyped / timeElapsed);
        const currentAccuracy = Math.round(((userInput.length - newErrors.length) / userInput.length) * 100);
        
        setWpm(isNaN(currentWpm) ? 0 : currentWpm);
        setAccuracy(isNaN(currentAccuracy) ? 100 : currentAccuracy);
      }

      if (userInput === text) {
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
  }, [userInput, text, startTime, errors.length, isCompleted, onStatsUpdate, level, lesson]);


  const resetPractice = () => {
    setUserInput('');
    setCurrentIndex(0);
    setErrors([]);
    setStartTime(null);
    setIsCompleted(false);
    setFinalTime(null);
    setWpm(0);
    setAccuracy(100);
    if (containerRef.current) {
      containerRef.current.focus();
    }
  };

  const getCurrentChar = () => {
    return currentIndex < text.length ? text[currentIndex] : '';
  };

  return (
    <div ref={containerRef} className="space-y-6 outline-none" tabIndex={0}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Levels</span>
        </button>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-6 bg-white/60 backdrop-blur-sm rounded-lg px-4 py-2">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">{wpm} WPM</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{Math.round((userInput.length / text.length) * 100)}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">{accuracy}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">
                {isCompleted && finalTime ? Math.round(finalTime) : 
                 startTime && !isCompleted ? Math.round((Date.now() - startTime) / 1000) : 0}s
              </span>
            </div>
          </div>

          <button
            onClick={resetPractice}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Typing Area */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 capitalize">
            {level} - Lesson {lesson + 1}
          </h3>
          {lessonStatus.attempts > 0 && (
            <div className="text-sm text-gray-600 space-x-4">
              <span>Previous Best: {lessonStatus.bestWpm} WPM</span>
              <span>{lessonStatus.bestAccuracy}% Accuracy</span>
              <span>{lessonStatus.attempts} attempts</span>
            </div>
          )}
        </div>

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

        {/* Typed Text Display */}
        {isCompleted && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">🎉 Lesson Completed!</h4>
            <p className="text-green-700">
              Great job! You typed at {wpm} WPM with {accuracy}% accuracy.
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