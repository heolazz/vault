import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Trash2, XCircle, Play } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Track } from '../types';

const TrackList: React.FC = () => {
  const { filteredTracks, playTrack, deleteTrack, clearLibrary, currentTrack, isLoading } = useAppStore();

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); 
    if (window.confirm('Delete this song?')) {
        deleteTrack(id);
    }
  };

  const handleClearAll = () => {
      if (window.confirm('WARNING: This will remove ALL songs from your library. Are you sure?')) {
          clearLibrary();
      }
  };

  const renderRow = (index: number, track: Track) => {
    const isCurrent = currentTrack?.id === track.id;
    const trackId = track.id || 0; 

    return (
      <div className="px-4 md:px-6 py-1"> 
        <div 
          onClick={() => playTrack(track)}
          className={`
            group flex items-center h-[64px] md:h-[50px] rounded-xl cursor-pointer transition-colors border-b border-white/5 md:border-none
            ${isCurrent ? 'bg-white/10' : 'active:bg-white/5 md:hover:bg-white/5'}
          `}
        >
          {/* COL 1: INDEX / INITIALS */}
          <div className="w-10 flex items-center justify-center shrink-0">
             <div className="md:hidden w-9 h-9 bg-zinc-800 rounded-md flex items-center justify-center text-zinc-500 font-bold text-[10px] overflow-hidden">
                {track.title.charAt(0)}
             </div>
             <span className="hidden md:block group-hover:hidden text-xs font-medium text-zinc-500">
                {isCurrent ? <span className="text-[#fa2d48] animate-pulse">♫</span> : index + 1}
             </span>
             <Play className="hidden md:hidden group-hover:block w-3.5 h-3.5 text-[#fa2d48] fill-current" />
          </div>

          <div className="flex-1 min-w-0 px-3 md:px-4 flex flex-col justify-center">
            <div className={`text-[15px] md:text-[14px] font-medium truncate ${isCurrent ? 'text-[#fa2d48]' : 'text-zinc-100'}`}>
              {track.title}
            </div>
            <div className="text-[13px] text-zinc-400 truncate md:hidden mt-0.5">{track.artist}</div>
          </div>

          <div className="w-[20%] hidden md:flex items-center text-[13px] text-zinc-400 px-2">
            <span className="truncate">{track.artist}</span>
          </div>
          <div className="w-[20%] hidden lg:flex items-center text-[13px] text-zinc-500 px-2">
            <span className="truncate">{track.album}</span>
          </div>
          
          <div className="w-12 text-right text-xs text-zinc-500 font-mono hidden sm:block">
             {Math.floor(track.duration / 60)}:{(Math.floor(track.duration % 60)).toString().padStart(2, '0')}
          </div>

          <div className="w-10 md:w-16 flex items-center justify-end md:justify-center pl-2">
             <button
                onClick={(e) => handleDelete(e, trackId)}
                className="p-2 rounded-full text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-all duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                title="Delete Song"
             >
                <Trash2 className="w-5 h-5 md:w-4 md:h-4" />
             </button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) return <div className="flex-1 flex items-center justify-center text-zinc-500 bg-[#1c1c1e] h-full">Loading...</div>;
  if (!filteredTracks.length) return <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 h-full bg-[#1c1c1e] pb-32"><p className="mb-2">Library Empty</p></div>;

  return (
    // PERUBAHAN 1: Hapus 'pb-48 md:pb-40' dari sini. Biarkan container full height.
    <div className="flex-1 flex flex-col bg-[#1c1c1e] min-h-0">
      
      <div className="flex items-center px-4 md:px-6 h-10 border-b border-white/5 bg-[#1c1c1e] sticky top-0 z-10 shrink-0">
         <div className="w-10 text-center hidden md:block text-xs font-semibold text-zinc-500 uppercase tracking-wide">#</div>
         <div className="flex-1 px-3 md:px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Title</div>
         <div className="w-[20%] px-2 hidden md:block text-xs font-semibold text-zinc-500 uppercase tracking-wide">Artist</div>
         <div className="w-[20%] px-2 hidden lg:block text-xs font-semibold text-zinc-500 uppercase tracking-wide">Album</div>
         <div className="w-12 text-right hidden sm:block text-xs font-semibold text-zinc-500 uppercase tracking-wide">Time</div>
         <div className="w-10 md:w-16 flex justify-end md:justify-center pl-2">
            <button onClick={handleClearAll} className="flex items-center justify-center text-zinc-500 hover:text-red-500 transition-colors" title="Clear All">
                <XCircle className="w-4 h-4 md:w-4 md:h-4" />
            </button>
         </div>
      </div>
      
      <div className="flex-1 min-h-0">
        <Virtuoso 
            style={{ height: '100%' }} 
            data={filteredTracks} 
            itemContent={renderRow}
            // PERUBAHAN 2: Tambahkan Spacer/Footer di dalam list
            // Mobile: h-48 (192px) cukup untuk melewati Nav & Mini Player
            // Desktop: h-24 (96px) cukup untuk melewati Player Bar
            components={{
                Footer: () => <div className="h-48 md:h-24" />
            }}
        />
      </div>
    </div>
  );
};

export default TrackList;