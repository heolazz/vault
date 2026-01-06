import React, { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TrackList from './components/TrackList';
import Player from './components/Player';
import MobileNav from './components/MobileNav';
import { Search } from 'lucide-react';
import { useAppStore } from './store/useAppStore';

const App: React.FC = () => {
  const { loadLibrary, setSearchQuery, searchQuery, togglePlay, nextTrack, prevTrack } = useAppStore();

  useEffect(() => { loadLibrary(); }, [loadLibrary]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
      if (e.code === 'ArrowRight' && e.ctrlKey) nextTrack();
      if (e.code === 'ArrowLeft' && e.ctrlKey) prevTrack();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, nextTrack, prevTrack]);

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-black text-zinc-200 overflow-hidden font-sans select-none">
      
      {/* Sidebar (Desktop) */}
      <div className="hidden md:flex h-full shrink-0"><Sidebar /></div>

      {/* Main Content */}
      {/* PERUBAHAN: Hapus class 'pb-24' disini agar full height */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#1c1c1e] relative">
        
        {/* Header */}
        <div className="h-20 md:h-16 flex items-end md:items-center px-6 md:px-8 shrink-0 bg-[#1c1c1e]/80 backdrop-blur-md z-20 sticky top-0 border-b border-white/5 justify-between pb-3 md:pb-0">
            <h2 className="text-2xl font-bold text-white tracking-tight">Songs</h2>
            
            <div className="relative w-full md:w-64 group ml-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#2c2c2e] hover:bg-[#3a3a3c] focus:bg-[#3a3a3c] text-[13px] text-white rounded-lg pl-9 pr-4 py-1.5 focus:outline-none transition-all placeholder-zinc-500"
              />
            </div>
        </div>

        <TrackList />
      </div>

      <MobileNav />
      <Player />
    </div>
  );
};
export default App;