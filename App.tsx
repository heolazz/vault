import React, { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TrackList from './components/TrackList';
import Player from './components/Player';
import MobileNav from './components/MobileNav';
import { Search } from 'lucide-react';
import Settings from './components/Settings';
import { useAppStore } from './store/useAppStore';

const App: React.FC = () => {
  const { loadLibrary, setSearchQuery, searchQuery, togglePlay, nextTrack, prevTrack, activeView, theme } = useAppStore();

  // Apply Theme Class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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
    <div className="h-screen w-screen flex flex-col md:flex-row bg-white dark:bg-black text-zinc-900 dark:text-zinc-200 overflow-hidden font-sans select-none transition-colors duration-300">

      {/* Sidebar (Desktop) */}
      <div className="hidden md:flex h-full shrink-0"><Sidebar /></div>

      {/* Main Content */}
      {/* PERUBAHAN: Hapus class 'pb-24' disini agar full height */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#1c1c1e] relative transition-colors duration-300">

        {/* Header */}
        <div className="h-20 md:h-16 flex items-end md:items-center px-6 md:px-8 shrink-0 bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-md z-20 sticky top-0 border-b border-black/5 dark:border-white/5 justify-between pb-3 md:pb-0 transition-colors duration-300">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
            {activeView === 'settings' ? 'Settings' : (activeView === 'favorites' ? 'Favorites' : 'Songs')}
          </h2>

          {activeView !== 'settings' && (
            <div className="relative w-full md:w-64 group ml-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
              <input
                type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-[#2c2c2e] hover:bg-zinc-200 dark:hover:bg-[#3a3a3c] focus:bg-zinc-200 dark:focus:bg-[#3a3a3c] text-[13px] text-zinc-900 dark:text-white rounded-lg pl-9 pr-4 py-1.5 focus:outline-none transition-all placeholder-zinc-500 dark:placeholder-zinc-500"
              />
            </div>
          )}
        </div>

        {activeView === 'settings' ? <Settings /> : <TrackList />}
      </div>

      <MobileNav />
      <Player />
    </div>
  );
};
export default App;