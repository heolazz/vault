export interface Track {
  id?: number;
  // Desktop pakai fileHandle, Mobile pakai file langsung
  fileHandle?: FileSystemFileHandle; 
  file?: File; 
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  format: string;
  path: string;
}

export interface PlayerState {
  isPlaying: boolean;
  volume: number;
  isShuffle: boolean;
  isLoop: boolean;
  currentTime: number;
  duration: number;
  currentTrack?: Track;
}

export interface LibraryState {
  tracks: Track[];
  isLoading: boolean;
  searchQuery: string;
}

export type TrackMetadata = Omit<Track, 'fileHandle' | 'file'>;