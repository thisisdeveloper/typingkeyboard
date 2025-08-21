import React from 'react';

interface VirtualKeyboardProps {
  currentChar: string;
}

const getFingerForKey = (key: string): string => {
  const fingerMap: { [key: string]: string } = {
    // Left hand
    'A': 'left-pinky', 'S': 'left-ring', 'D': 'left-middle', 'F': 'left-index', 'G': 'left-index',
    'Q': 'left-pinky', 'W': 'left-ring', 'E': 'left-middle', 'R': 'left-index', 'T': 'left-index',
    'Z': 'left-pinky', 'X': 'left-ring', 'C': 'left-middle', 'V': 'left-index', 'B': 'left-index',
    '1': 'left-pinky', '2': 'left-ring', '3': 'left-middle', '4': 'left-index', '5': 'left-index',
    '`': 'left-pinky',
    
    // Right hand
    'H': 'right-index', 'J': 'right-index', 'K': 'right-middle', 'L': 'right-ring', ';': 'right-pinky',
    'Y': 'right-index', 'U': 'right-index', 'I': 'right-middle', 'O': 'right-ring', 'P': 'right-pinky',
    'N': 'right-index', 'M': 'right-index', ',': 'right-middle', '.': 'right-ring', '/': 'right-pinky',
    '6': 'right-index', '7': 'right-index', '8': 'right-middle', '9': 'right-ring', '0': 'right-pinky',
    '-': 'right-pinky', '=': 'right-pinky', '[': 'right-pinky', ']': 'right-pinky', '\\': 'right-pinky', "'": 'right-pinky',
    
    // Space bar - both thumbs
    ' ': 'both-thumbs'
  };
  
  return fingerMap[key.toUpperCase()] || '';
};

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ currentChar }) => {
  const [capsLockOn, setCapsLockOn] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'CapsLock') {
        setCapsLockOn(e.getModifierState('CapsLock'));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'CapsLock') {
        setCapsLockOn(e.getModifierState('CapsLock'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const currentFinger = getFingerForKey(currentChar);

  const getKeyClassName = (key: string) => {
    const isCurrentKey = key.toUpperCase() === currentChar.toUpperCase() || 
                        (currentChar === ' ' && key === 'Space');
    const fingerColor = fingerColors[key.toUpperCase() as keyof typeof fingerColors];
    
    let className = `
      inline-flex items-center justify-center text-sm font-medium rounded border-2 transition-all duration-200
      ${fingerColor || 'bg-gray-100 border-gray-300'}
      ${isCurrentKey ? 'ring-2 ring-blue-500 bg-blue-300 border-blue-400 scale-110 shadow-lg' : 'hover:bg-opacity-80'}
    `;

    // Special key sizes
    if (key === 'Space') {
      className += ' w-80 h-12';
    } else if (key === 'Enter') {
      className += ' w-20 h-12';
    } else if (key === 'Shift') {
      className += ' w-24 h-12';
    } else if (key === 'Tab') {
      className += ' w-24 h-12';
    } else if (key === 'Caps') {
      className += ' w-28 h-12';
    } else if (key === 'Backspace') {
      className += ' w-24 h-12';
    } else {
      className += ' h-12 w-12';
    }

    return className;
  };

const keyboardLayout = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Alt', 'Space', 'Alt', 'Ctrl']
];

const fingerColors = {
  // Left hand
  'A': 'bg-red-200 border-red-300', // Left pinky
  'S': 'bg-orange-200 border-orange-300', // Left ring
  'D': 'bg-yellow-200 border-yellow-300', // Left middle
  'F': 'bg-green-200 border-green-300', // Left index
  'G': 'bg-green-200 border-green-300', // Left index
  
  // Right hand
  'H': 'bg-green-200 border-green-300', // Right index
  'J': 'bg-blue-200 border-blue-300', // Right index
  'K': 'bg-indigo-200 border-indigo-300', // Right middle
  'L': 'bg-purple-200 border-purple-300', // Right ring
  ';': 'bg-pink-200 border-pink-300', // Right pinky
  
  // Top row left
  'Q': 'bg-red-200 border-red-300', // Left pinky
  'W': 'bg-orange-200 border-orange-300', // Left ring
  'E': 'bg-yellow-200 border-yellow-300', // Left middle
  'R': 'bg-green-200 border-green-300', // Left index
  'T': 'bg-green-200 border-green-300', // Left index
  
  // Top row right
  'Y': 'bg-blue-200 border-blue-300', // Right index
  'U': 'bg-blue-200 border-blue-300', // Right index
  'I': 'bg-indigo-200 border-indigo-300', // Right middle
  'O': 'bg-purple-200 border-purple-300', // Right ring
  'P': 'bg-pink-200 border-pink-300', // Right pinky
  
  // Bottom row left
  'Z': 'bg-red-200 border-red-300', // Left pinky
  'X': 'bg-orange-200 border-orange-300', // Left ring
  'C': 'bg-yellow-200 border-yellow-300', // Left middle
  'V': 'bg-green-200 border-green-300', // Left index
  'B': 'bg-green-200 border-green-300', // Left index
  
  // Bottom row right
  'N': 'bg-blue-200 border-blue-300', // Right index
  'M': 'bg-blue-200 border-blue-300', // Right index
  ',': 'bg-indigo-200 border-indigo-300', // Right middle
  '.': 'bg-purple-200 border-purple-300', // Right ring
  '/': 'bg-pink-200 border-pink-300', // Right pinky
  
  // Numbers and symbols
  '1': 'bg-red-200 border-red-300', // Left pinky
  '2': 'bg-orange-200 border-orange-300', // Left ring
  '3': 'bg-yellow-200 border-yellow-300', // Left middle
  '4': 'bg-green-200 border-green-300', // Left index
  '5': 'bg-green-200 border-green-300', // Left index
  '6': 'bg-blue-200 border-blue-300', // Right index
  '7': 'bg-blue-200 border-blue-300', // Right index
  '8': 'bg-indigo-200 border-indigo-300', // Right middle
  '9': 'bg-purple-200 border-purple-300', // Right ring
  '0': 'bg-pink-200 border-pink-300', // Right pinky
  
  // Special characters
  '`': 'bg-red-200 border-red-300', // Left pinky
  '-': 'bg-pink-200 border-pink-300', // Right pinky
  '=': 'bg-pink-200 border-pink-300', // Right pinky
  '[': 'bg-pink-200 border-pink-300', // Right pinky
  ']': 'bg-pink-200 border-pink-300', // Right pinky
  '\\': 'bg-pink-200 border-pink-300', // Right pinky
  "'": 'bg-pink-200 border-pink-300', // Right pinky
  
  // Space bar - thumbs
  'SPACE': 'bg-gray-200 border-gray-300', // Both thumbs
};

  const renderKey = (key: string, index: number) => {
    let displayKey = key;
    if (key === 'Space') displayKey = '';
    if (key === 'Backspace') displayKey = '⌫';
    if (key === 'Enter') displayKey = '⏎';
    if (key === 'Shift') displayKey = 'Shift';
    if (key === 'Tab') displayKey = 'Tab';
    if (key === 'Caps') displayKey = 'Caps Lock';

    return (
      <button
        key={`${key}-${index}`}
        className={`${getKeyClassName(key)} ${key === 'Caps' && capsLockOn ? 'bg-green-300 border-green-400' : ''}`}
        type="button"
      >
        <div className="flex items-center justify-center space-x-1">
          <span>{displayKey}</span>
          {key === 'Caps' && (
            <div className={`w-2 h-2 rounded-full ${capsLockOn ? 'bg-green-600' : 'bg-gray-400'}`} />
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-center space-x-8">
        {/* Left Hand */}
        <div className="flex flex-col items-center space-y-2">
          <div className={`border-2 rounded-lg p-2 w-20 h-24 flex items-center justify-center transition-all ${
            currentFinger.startsWith('left') ? 'bg-green-200 border-green-400' : 'bg-red-50 border-red-200'
          }`}>
            <img 
              src="/src/assets/left.png" 
              alt="Left Hand" 
              className={`w-16 h-20 object-contain transition-all ${
                currentFinger.startsWith('left') ? 'brightness-110 saturate-150' : 'opacity-80'
              }`}
            />
          </div>
          <div className="text-xs text-gray-600">Left Hand</div>
        </div>

        {/* Keyboard */}
        <div className="space-y-2">
          {keyboardLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center space-x-1">
              {row.map((key, keyIndex) => renderKey(key, keyIndex))}
            </div>
          ))}
        </div>

        {/* Right Hand */}
        <div className="flex flex-col items-center space-y-2">
          <div className={`border-2 rounded-lg p-2 w-20 h-24 flex items-center justify-center transition-all ${
            currentFinger.startsWith('right') ? 'bg-green-200 border-green-400' : 'bg-blue-50 border-blue-200'
          }`}>
            <img 
              src="/src/assets/right.png" 
              alt="Right Hand" 
              className={`w-16 h-20 object-contain transition-all ${
                currentFinger.startsWith('right') ? 'brightness-110 saturate-150' : 'opacity-80'
              }`}
            />
          </div>
          <div className="text-xs text-gray-600">Right Hand</div>
        </div>
      </div>

      {/* Finger Guide */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-6 gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-200 border border-red-300 rounded"></div>
          <span>Left Pinky</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-200 border border-orange-300 rounded"></div>
          <span>Left Ring</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-200 border border-yellow-300 rounded"></div>
          <span>Left Middle</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-200 border border-green-300 rounded"></div>
          <span>Left Index</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-200 border border-blue-300 rounded"></div>
          <span>Right Index</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-indigo-200 border border-indigo-300 rounded"></div>
          <span>Right Middle</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-200 border border-purple-300 rounded"></div>
          <span>Right Ring</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-pink-200 border border-pink-300 rounded"></div>
          <span>Right Pinky</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-200 border border-gray-300 rounded"></div>
          <span>Thumbs</span>
        </div>
      </div>
    </div>
  );
};

export default VirtualKeyboard;