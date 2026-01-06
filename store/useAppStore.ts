import { create } from 'zustand';
import { Track, PlayerState, LibraryState } from '../types';
import { db } from '../services/db';

interface AppStore extends PlayerState, LibraryState {
  loadLibrary: () => Promise<void>;
  addTracks: (tracks: Track[]) => void;
  playTrack: (track: Track) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  togglePlay: () => void;
  toggleShuffle: () => void;
  toggleLoop: () => void;
  setVolume: (vol: number) => void;
  setPlaying: (state: boolean) => void;
  setSearchQuery: (query: string) => void;
  verifyPermission: (fileHandle: FileSystemFileHandle | undefined) => Promise<boolean>;
  filteredTracks: Track[];
}

export const useAppStore = create<AppStore>((set, get) => ({
  tracks: [],
  filteredTracks: [],
  currentTrack: undefined,
  isLoading: true,
  searchQuery: '',
  isPlaying: false,
  volume: 1,
  isShuffle: false,
  isLoop: false,
  currentTime: 0,
  duration: 0,

  loadLibrary: async () => {
    set({ isLoading: true });
    try {
      const savedTracks = await db.tracks.toArray();
      set({ tracks: savedTracks, filteredTracks: savedTracks, isLoading: false });
    } catch (error) {
      console.error("DB Load Error:", error);
      set({ isLoading: false });
    }
  },

  addTracks: async (newTracks) => {
    await db.tracks.bulkAdd(newTracks);
    set((state) => {
        const updated = [...state.tracks, ...newTracks];
        return { tracks: updated, filteredTracks: updated };
    });
  },

  // FIX: Handle undefined handle (Mobile case)
  verifyPermission: async (fileHandle: FileSystemFileHandle | undefined) => {
    if (!fileHandle) return true; // Mobile files don't need permission re-check

    const options = { mode: 'read' as const };
    try {
        if ((await fileHandle.queryPermission(options)) === 'granted') return true;
        if ((await fileHandle.requestPermission(options)) === 'granted') return true;
    } catch (e) {
        console.warn("Permission check skipped:", e);
        return true; 
    }
    return false;
  },

  setSearchQuery: (query) => {
      set((state) => ({
          searchQuery: query,
          filteredTracks: state.tracks.filter(t => 
              t.title.toLowerCase().includes(query.toLowerCase()) || 
              t.artist.toLowerCase().includes(query.toLowerCase())
          )
      }));
  },

  playTrack: (track) => set({ currentTrack: track, isPlaying: true }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (volume) => set({ volume }),
  toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),
  toggleLoop: () => set((state) => ({ isLoop: !state.isLoop })),

  nextTrack: () => {
    const { tracks, currentTrack, isShuffle } = get();
    if (!currentTrack || tracks.length === 0) return;
    let nextIndex;
    if (isShuffle) {
        nextIndex = Math.floor(Math.random() * tracks.length);
    } else {
        const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
        nextIndex = (currentIndex + 1) % tracks.length;
    }
    set({ currentTrack: tracks[nextIndex], isPlaying: true });
  },

  prevTrack: () => {
      const { tracks, currentTrack } = get();
      if (!currentTrack) return;
      const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
      const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
      set({ currentTrack: tracks[prevIndex], isPlaying: true });
  }
}));