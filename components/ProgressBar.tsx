import React from 'react';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ currentTime, duration, onSeek }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSeek(Number(e.target.value));
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3 text-xs font-medium text-zinc-400 w-full max-w-xl">
      <span className="w-10 text-right">{formatTime(currentTime)}</span>
      
      <div className="relative flex-1 h-1 bg-zinc-700 rounded-full group cursor-pointer">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div 
          className="absolute h-full bg-indigo-500 rounded-full" 
          style={{ width: `${progress}%` }}
        />
        <div 
          className="absolute h-3 w-3 bg-white rounded-full -top-1 shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
        />
      </div>

      <span className="w-10">{formatTime(duration)}</span>
    </div>
  );
};

export default ProgressBar;