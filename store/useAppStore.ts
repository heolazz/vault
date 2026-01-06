import { create } from 'zustand';
import { Track, PlayerState, LibraryState } from '../types';
import { db } from '../services/db';

interface AppStore extends PlayerState, LibraryState {
  activeView: 'library' | 'favorites'; 
  setActiveView: (view: 'library' | 'favorites') => void;

  loadLibrary: () => Promise<void>;
  addTracks: (tracks: Track[]) => void;
  deleteTrack: (id: number) => Promise<void>;
  clearLibrary: () => Promise<void>;
  toggleFavorite: (track: Track) => Promise<void>;
  
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
  activeView: 'library',
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

  setActiveView: (view) => {
      set((state) => {
          let newFiltered = state.tracks;
          if (view === 'favorites') {
              newFiltered = state.tracks.filter(t => t.isFavorite);
          }
          return { activeView: view, filteredTracks: newFiltered, searchQuery: '' };
      });
  },

  toggleFavorite: async (track) => {
      const newStatus = !track.isFavorite;
      await db.tracks.update(track.id, { isFavorite: newStatus });
      set((state) => {
          const updatedTracks = state.tracks.map((t) => t.id === track.id ? { ...t, isFavorite: newStatus } : t);
          let updatedFiltered = state.filteredTracks.map((t) => t.id === track.id ? { ...t, isFavorite: newStatus } : t);
          if (state.activeView === 'favorites' && !newStatus) {
              updatedFiltered = updatedFiltered.filter(t => t.id !== track.id);
          }
          const updatedCurrent = state.currentTrack?.id === track.id ? { ...state.currentTrack, isFavorite: newStatus } : state.currentTrack;
          return { tracks: updatedTracks, filteredTracks: updatedFiltered, currentTrack: updatedCurrent };
      });
  },

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

  // --- REVISI: ANTI-DUPLICATE LOGIC ---
  addTracks: async (newTracks) => {
    // 1. Ambil daftar lagu yang SUDAH ada di memory
    const { tracks } = get();

    // 2. Buat daftar Judul Lagu yang sudah ada agar pencarian cepat (menggunakan Set)
    //    Kita gunakan 'title' (nama file) sebagai patokan duplikasi.
    const existingTitles = new Set(tracks.map(t => t.title));

    // 3. Filter track baru: Hanya ambil yang judulnya BELUM ada di Set
    const uniqueTracks = newTracks.filter(t => !existingTitles.has(t.title));

    // 4. Jika hasilnya kosong (semua lagu sudah ada), hentikan proses.
    if (uniqueTracks.length === 0) {
        console.log("No new unique tracks found.");
        return;
    }

    // 5. Masukkan HANYA lagu yang unik ke Database
    await db.tracks.bulkAdd(uniqueTracks);

    // 6. Update State UI
    set((state) => {
        const updated = [...state.tracks, ...uniqueTracks];
        return { 
            tracks: updated, 
            filteredTracks: updated,
            activeView: 'library' 
        };
    });
  },
  // ------------------------------------

  deleteTrack: async (id) => {
    await db.tracks.delete(id);
    set((state) => {
        const isCurrentTrack = state.currentTrack?.id === id;
        const newTracks = state.tracks.filter((t) => t.id !== id);
        const newFiltered = state.filteredTracks.filter((t) => t.id !== id);
        return {
            tracks: newTracks,
            filteredTracks: newFiltered,
            currentTrack: isCurrentTrack ? undefined : state.currentTrack,
            isPlaying: isCurrentTrack ? false : state.isPlaying
        };
    });
  },

  clearLibrary: async () => {
    await db.tracks.clear();
    set({ tracks: [], filteredTracks: [], currentTrack: undefined, isPlaying: false, currentTime: 0, duration: 0 });
  },

  verifyPermission: async (fileHandle) => {
    if (!fileHandle) return true; 
    const options = { mode: 'read' as const };
    try {
        if ((await fileHandle.queryPermission(options)) === 'granted') return true;
        if ((await fileHandle.requestPermission(options)) === 'granted') return true;
    } catch (e) { return true; }
    return false;
  },

  setSearchQuery: (query) => {
      set((state) => {
          let baseList = state.tracks;
          if (state.activeView === 'favorites') baseList = state.tracks.filter(t => t.isFavorite);
          return {
              searchQuery: query,
              filteredTracks: baseList.filter(t => 
                  t.title.toLowerCase().includes(query.toLowerCase()) || 
                  t.artist.toLowerCase().includes(query.toLowerCase())
              )
          };
      });
  },

  playTrack: (track) => set({ currentTrack: track, isPlaying: true }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (volume) => set({ volume }),
  toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),
  toggleLoop: () => set((state) => ({ isLoop: !state.isLoop })),

  nextTrack: () => {
    const { filteredTracks, currentTrack, isShuffle } = get();
    if (!currentTrack || filteredTracks.length === 0) return;
    let nextIndex;
    if (isShuffle) {
        nextIndex = Math.floor(Math.random() * filteredTracks.length);
    } else {
        const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id);
        nextIndex = (currentIndex + 1) % filteredTracks.length;
    }
    set({ currentTrack: filteredTracks[nextIndex], isPlaying: true });
  },

  prevTrack: () => {
      const { filteredTracks, currentTrack } = get();
      if (!currentTrack) return;
      const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id);
      const prevIndex = (currentIndex - 1 + filteredTracks.length) % filteredTracks.length;
      set({ currentTrack: filteredTracks[prevIndex], isPlaying: true });
  }
}));