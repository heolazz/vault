import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, ChevronDown, Shuffle, Repeat, Heart } from 'lucide-react'; // Tambah Heart
import { useAppStore } from '../store/useAppStore';

const Player: React.FC = () => {
  // Ambil toggleFavorite
  const { 
    currentTrack, isPlaying, volume, isShuffle, isLoop,
    togglePlay, nextTrack, prevTrack, toggleShuffle, toggleLoop, setPlaying, setVolume, toggleFavorite 
  } = useAppStore();

  // ... (Sisa logic audio engine, ref, dan useEffect TETAP SAMA, JANGAN DIUBAH) ...
  // HANYA COPY BAGIAN RETURN DI BAWAH INI UNTUK MEMASTIKAN TOMBOL HEART MUNCUL

  const audioRef = useRef<HTMLAudioElement>(null);
  const activeUrlRef = useRef<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // -- COPY PASTE AUDIO ENGINE LOGIC DARI FILE SEBELUMNYA DISINI --
  // (Agar hemat tempat saya langsung ke bagian Return)
  useEffect(() => {
    const setupAudio = async () => {
      if (!currentTrack || !audioRef.current) return;
      try {
        if (activeUrlRef.current) { URL.revokeObjectURL(activeUrlRef.current); activeUrlRef.current = null; }
        let fileBlob: File;
        if (currentTrack.file) { fileBlob = currentTrack.file; } 
        else if (currentTrack.fileHandle) {
            const permission = await currentTrack.fileHandle.queryPermission({ mode: 'read' });
            if (permission !== 'granted') { if (await currentTrack.fileHandle.requestPermission({ mode: 'read' }) !== 'granted') return; }
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

  useEffect(() => { if (audioRef.current) isPlaying ? audioRef.current.play().catch(()=>{}) : audioRef.current.pause(); }, [isPlaying]);
  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);

  const onTimeUpdate = () => { if (audioRef.current) { setCurrentTime(audioRef.current.currentTime); setDuration(audioRef.current.duration || 0); } };
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => { const time = Number(e.target.value); if (audioRef.current) { audioRef.current.currentTime = time; setCurrentTime(time); } };
  const formatTime = (s: number) => { const m = Math.floor(s / 60); const sec = Math.floor(s % 60); return `${m}:${sec < 10 ? '0' : ''}${sec}`; };

  if (!currentTrack) return null;
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  // --- RENDER UI ---
  return (
    <>
      <audio ref={audioRef} onTimeUpdate={onTimeUpdate} onEnded={nextTrack} />

      {/* MOBILE FULL SCREEN & MINI PLAYER (Tidak Berubah) */}
      {/* ... (Biarkan kode mobile seperti sebelumnya) ... */}
      
      {/* ================= DESKTOP VERSION (YANG DIUBAH) ================= */}
      <div className="
          hidden md:flex 
          fixed 
          right-0 bottom-0 z-50 
          md:left-[260px]  /* <--- KUNCI PERUBAHAN: Geser start player ke kanan sidebar */
          bg-[#1c1c1e]/95 backdrop-blur-xl 
          border-t border-white/10 
          h-[90px] items-center px-6 shadow-2xl
      ">
          <div className="w-14 h-14 bg-zinc-800 rounded-md shrink-0 overflow-hidden relative shadow-lg">
              <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-zinc-500 font-bold text-lg">
                  {currentTrack.title.charAt(0)}
              </div>
          </div>
          <div className="flex-1 min-w-0 px-4 flex flex-col justify-center">
              <span className="text-white font-medium text-sm truncate">{currentTrack.title}</span>
              <span className="text-zinc-400 text-xs truncate">{currentTrack.artist}</span>
          </div>

          {/* FAVORITE BUTTON */}
          <button 
            onClick={() => toggleFavorite(currentTrack)}
            className={`mr-6 ${currentTrack.isFavorite ? 'text-[#fa2d48]' : 'text-zinc-500 hover:text-white'} transition-colors`}
          >
              <Heart className={`w-5 h-5 ${currentTrack.isFavorite ? 'fill-current' : ''}`} />
          </button>

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