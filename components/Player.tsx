import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ChevronDown, Shuffle, Repeat } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const Player: React.FC = () => {
  const { 
    currentTrack, isPlaying, volume, isShuffle, isLoop,
    togglePlay, nextTrack, prevTrack, toggleShuffle, toggleLoop, setPlaying, setVolume 
  } = useAppStore();

  const audioRef = useRef<HTMLAudioElement>(null);
  const activeUrlRef = useRef<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // STATE BARU: Untuk mengontrol tampilan Full Screen
  const [isExpanded, setIsExpanded] = useState(false);

  // --- AUDIO ENGINE ---
  useEffect(() => {
    const setupAudio = async () => {
      if (!currentTrack || !audioRef.current) return;
      try {
        if (activeUrlRef.current) {
             URL.revokeObjectURL(activeUrlRef.current);
             activeUrlRef.current = null;
        }
        let fileBlob: File;
        if (currentTrack.file) {
            fileBlob = currentTrack.file;
        } else if (currentTrack.fileHandle) {
            const permission = await currentTrack.fileHandle.queryPermission({ mode: 'read' });
            if (permission !== 'granted') {
                if (await currentTrack.fileHandle.requestPermission({ mode: 'read' }) !== 'granted') return;
            }
            fileBlob = await currentTrack.fileHandle.getFile();
        } else { return; }
        
        const url = URL.createObjectURL(fileBlob);
        activeUrlRef.current = url;
        audioRef.current.src = url;
        audioRef.current.load();
        audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
      } catch (err) { console.error(err); }
    };
    setupAudio();
    return () => { if (activeUrlRef.current) URL.revokeObjectURL(activeUrlRef.current); };
  }, [currentTrack?.id]);

  useEffect(() => {
    if (audioRef.current) isPlaying ? audioRef.current.play().catch(()=>{}) : audioRef.current.pause();
  }, [isPlaying]);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);

  const onTimeUpdate = () => {
      if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
          setDuration(audioRef.current.duration || 0);
      }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      const time = Number(e.target.value);
      if (audioRef.current) { audioRef.current.currentTime = time; setCurrentTime(time); }
  };
  
  const formatTime = (s: number) => { 
      const m = Math.floor(s / 60); 
      const sec = Math.floor(s % 60); 
      return `${m}:${sec < 10 ? '0' : ''}${sec}`; 
  };

  if (!currentTrack) return null;

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <audio ref={audioRef} onTimeUpdate={onTimeUpdate} onEnded={nextTrack} />

      {/* ============================================================== */}
      {/* 1. EXPANDED FULL SCREEN PLAYER (MOBILE ONLY)                   */}
      {/* ============================================================== */}
      <div className={`
        md:hidden fixed inset-0 z-[60] bg-[#1c1c1e] flex flex-col 
        transition-transform duration-500 ease-out
        ${isExpanded ? 'translate-y-0' : 'translate-y-[100%]'}
      `}>
        {/* Background Blur Effect (Optional aesthetic) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2c2c2e] to-[#000000] opacity-50 z-0 pointer-events-none" />

        {/* Header: Close Button */}
        <div className="relative z-10 flex items-center justify-center pt-12 pb-4">
             <button 
                onClick={() => setIsExpanded(false)}
                className="w-12 h-1 bg-zinc-600 rounded-full opacity-50 absolute top-4"
             />
             <button 
                onClick={() => setIsExpanded(false)} 
                className="absolute left-6 top-10 text-zinc-400 hover:text-white"
             >
                <ChevronDown className="w-8 h-8" />
             </button>
             <span className="text-zinc-400 text-xs font-semibold tracking-widest uppercase mt-2">Now Playing</span>
        </div>

        {/* Body: Big Cover Art */}
        <div className="relative z-10 flex-1 flex items-center justify-center p-8">
            <div className="w-full aspect-square bg-zinc-800 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden relative">
                 <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-zinc-500 font-bold text-6xl">
                    {currentTrack.title.charAt(0)}
                </div>
            </div>
        </div>

        {/* Footer: Controls & Info */}
        <div className="relative z-10 px-8 pb-12 flex flex-col gap-6">
            
            {/* Title & Artist */}
            <div className="flex flex-col">
                <h2 className="text-white text-2xl font-bold truncate leading-tight">{currentTrack.title}</h2>
                <p className="text-zinc-400 text-lg truncate mt-1">{currentTrack.artist}</p>
            </div>

            {/* Scrubber (Progress Bar) */}
            <div className="w-full">
                <div className="group relative w-full h-1 bg-zinc-700 rounded-full mb-2">
                    <input 
                        type="range" min={0} max={duration || 100} value={currentTime} onChange={handleSeek} 
                        className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer" 
                    />
                    <div className="absolute inset-0 h-full bg-[#fa2d48] rounded-full z-10" style={{ width: `${progressPercent}%` }} />
                    <div 
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md z-10 pointer-events-none" 
                        style={{ left: `${progressPercent}%`, transform: `translate(-50%, -50%)` }} 
                    />
                </div>
                <div className="flex justify-between text-xs text-zinc-500 font-medium font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* Main Controls */}
            <div className="flex items-center justify-between mt-2">
                <button onClick={toggleShuffle} className={`${isShuffle ? 'text-[#fa2d48]' : 'text-zinc-500'} transition-colors`}>
                    <Shuffle className="w-6 h-6" />
                </button>

                <button onClick={prevTrack} className="text-white active:scale-90 transition-transform">
                    <SkipBack className="w-10 h-10 fill-current" />
                </button>

                <button onClick={togglePlay} className="w-20 h-20 bg-[#fa2d48] rounded-full flex items-center justify-center shadow-lg shadow-red-900/40 active:scale-95 transition-transform">
                    {isPlaying ? <Pause className="w-10 h-10 fill-white" /> : <Play className="w-10 h-10 fill-white ml-1" />}
                </button>

                <button onClick={nextTrack} className="text-white active:scale-90 transition-transform">
                    <SkipForward className="w-10 h-10 fill-current" />
                </button>

                <button onClick={toggleLoop} className={`${isLoop ? 'text-[#fa2d48]' : 'text-zinc-500'} transition-colors`}>
                    <Repeat className="w-6 h-6" />
                </button>
            </div>

            {/* Volume Slider (Optional) */}
            <div className="flex items-center gap-3 mt-4 px-2">
                <Volume2 className="w-5 h-5 text-zinc-500" />
                <input 
                    type="range" min="0" max="1" step="0.01" value={volume} 
                    onChange={(e) => setVolume(parseFloat(e.target.value))} 
                    className="flex-1 h-1 bg-zinc-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
            </div>
        </div>
      </div>


      {/* ============================================================== */}
      {/* 2. MINI PLAYER (FLOATING PILL)                                 */}
      {/* ============================================================== */}
      <div className="md:hidden fixed left-2 right-2 bottom-[112px] z-50">
        <div 
            // KLIK UNTUK MEMBUKA FULL SCREEN
            onClick={() => setIsExpanded(true)} 
            className="
                bg-[#252525]/95 backdrop-blur-xl 
                border border-white/10 
                rounded-2xl shadow-xl shadow-black/40
                h-[64px] flex items-center pr-4 pl-2 relative overflow-hidden
                cursor-pointer active:scale-[0.98] transition-transform
            "
        >
            {/* Background Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
                <div className="h-full bg-[#fa2d48] shadow-[0_0_8px_rgba(250,45,72,0.8)]" style={{ width: `${progressPercent}%` }} />
            </div>

            {/* Cover Art */}
            <div className="w-12 h-12 rounded-xl bg-zinc-800 shrink-0 overflow-hidden relative shadow-md ml-1 z-10">
                <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-zinc-500 font-bold text-lg">
                    {currentTrack.title.charAt(0)}
                </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 px-3 flex flex-col justify-center z-10">
                <span className="text-white font-semibold text-[14px] truncate leading-tight">
                    {currentTrack.title}
                </span>
                <span className="text-zinc-400 text-xs truncate mt-0.5">
                    {currentTrack.artist}
                </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 z-10">
                <button 
                    onClick={(e) => {
                        e.stopPropagation(); // MENCEGAH FULL SCREEN TERBUKA SAAT KLIK PLAY
                        togglePlay();
                    }} 
                    className="text-white w-10 h-10 flex items-center justify-center active:scale-90 transition-transform"
                >
                    {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
                </button>
                <button 
                    onClick={(e) => {
                        e.stopPropagation(); // MENCEGAH FULL SCREEN TERBUKA
                        nextTrack();
                    }}
                    className="text-zinc-400 hover:text-white active:scale-90 transition-transform"
                >
                    <SkipForward className="w-6 h-6 fill-current" />
                </button>
            </div>
        </div>
      </div>


      {/* ============================================================== */}
      {/* 3. DESKTOP PLAYER (FULL BAR) - TIDAK BERUBAH                   */}
      {/* ============================================================== */}
      <div className="hidden md:flex fixed left-0 right-0 z-50 bottom-0 bg-[#1c1c1e]/95 backdrop-blur-xl border-t border-white/10 h-[90px] items-center px-6 shadow-2xl">
          <div className="w-14 h-14 bg-zinc-800 rounded-md shrink-0 overflow-hidden relative shadow-lg">
              <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-zinc-500 font-bold text-lg">
                  {currentTrack.title.charAt(0)}
              </div>
          </div>
          <div className="flex-1 min-w-0 px-4 flex flex-col justify-center">
              <span className="text-white font-medium text-sm truncate">{currentTrack.title}</span>
              <span className="text-zinc-400 text-xs truncate">{currentTrack.artist}</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-[2] max-w-2xl gap-1">
            <div className="flex items-center gap-6">
                <button onClick={prevTrack} className="text-zinc-300 hover:text-white transition-colors"><SkipBack className="w-5 h-5 fill-current" /></button>
                <button onClick={togglePlay} className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-black hover:scale-105 transition-transform">
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
                <button onClick={nextTrack} className="text-zinc-300 hover:text-white transition-colors"><SkipForward className="w-5 h-5 fill-current" /></button>
            </div>
            <div className="w-full flex items-center gap-3 text-[10px] font-medium text-zinc-500 font-mono mt-1">
               <span className="w-8 text-right">{formatTime(currentTime)}</span>
               <div className="group relative flex-1 h-1 bg-zinc-600/30 rounded-full cursor-pointer flex items-center">
                    <input type="range" min={0} max={duration || 100} value={currentTime} onChange={handleSeek} className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" />
                    <div className="h-full bg-zinc-400 rounded-full group-hover:bg-[#fa2d48]" style={{ width: `${progressPercent}%` }} />
               </div>
               <span className="w-8">{formatTime(duration)}</span>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 flex-1">
             <Volume2 className="w-4 h-4 text-zinc-400" />
             <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-20 h-1 bg-zinc-600/30 rounded-lg appearance-none cursor-pointer" />
          </div>
      </div>
    </>
  );
};

export default Player;