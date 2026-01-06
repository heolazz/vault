import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useAppStore } from '../store/useAppStore';
import { Track } from '../types';

const TrackList: React.FC = () => {
  const { filteredTracks, playTrack, currentTrack, isLoading } = useAppStore();

  const renderRow = (index: number, track: Track) => {
    const isCurrent = currentTrack?.id === track.id;

    return (
      <div className="px-4 md:px-6 py-1"> 
        <div 
          onClick={() => playTrack(track)}
          className={`
            group flex items-center h-[60px] md:h-[44px] rounded-lg px-2 cursor-pointer transition-colors border-b border-white/5 md:border-none
            ${isCurrent ? 'bg-white/10' : 'active:bg-white/10 md:hover:bg-white/5'}
          `}
        >
          {/* Mobile Cover Art */}
          <div className="md:hidden w-10 h-10 bg-zinc-800 rounded mr-3 flex items-center justify-center text-zinc-500 font-bold text-xs shrink-0">
             {track.title.charAt(0)}
          </div>
          
          {/* Index Desktop */}
          <div className="w-8 text-center text-xs font-medium text-zinc-500 hidden md:block group-hover:hidden">
            {isCurrent ? <span className="text-[#fa2d48] animate-pulse">♫</span> : index + 1}
          </div>

          <div className="flex-1 min-w-0 pr-4 flex flex-col justify-center">
            <div className={`text-[15px] md:text-[14px] font-medium truncate ${isCurrent ? 'text-[#fa2d48]' : 'text-zinc-100'}`}>
              {track.title}
            </div>
            <div className="text-[13px] text-zinc-400 truncate md:hidden">
              {track.artist}
            </div>
          </div>

          <div className="w-1/4 hidden md:block px-2">
            <div className="text-[13px] text-zinc-400 truncate">{track.artist}</div>
          </div>
          <div className="w-1/4 hidden lg:block px-2">
            <div className="text-[13px] text-zinc-500 truncate">{track.album}</div>
          </div>
          <div className="w-12 text-right text-xs text-zinc-500 font-mono hidden sm:block">
             {Math.floor(track.duration / 60)}:{(Math.floor(track.duration % 60)).toString().padStart(2, '0')}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) return <div className="flex-1 flex items-center justify-center text-zinc-500 bg-[#1c1c1e] h-full">Loading...</div>;
  if (!filteredTracks.length) return <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 h-full bg-[#1c1c1e]"><p>Library Empty</p></div>;

  return (
    <div className="flex-1 flex flex-col bg-[#1c1c1e] min-h-0 pb-48 md:pb-28">
      
      <div className="hidden md:flex items-center px-8 h-10 border-b border-white/5 text-xs font-semibold text-zinc-500 uppercase tracking-wide bg-[#1c1c1e] sticky top-0 z-10 shrink-0">
        <div className="w-8 text-center">#</div>
        <div className="flex-1 px-4">Title</div>
        <div className="w-1/4 px-2">Artist</div>
        <div className="w-1/4 hidden lg:block px-2">Album</div>
        <div className="w-12 text-right">Time</div>
      </div>
      
      <div className="flex-1 min-h-0">
        <Virtuoso 
          style={{ height: '100%' }} 
          data={filteredTracks} 
          itemContent={renderRow} 
        />
      </div>
    </div>
  );
};

export default TrackList;