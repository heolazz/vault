export interface Track {
  id?: number;
  // Desktop pakai fileHandle, Mobile pakai file langsung
  fileHandle?: FileSystemFileHandle; 
  file?: File; 
  title: string;
  artist: string;
  album: string;
  isFavorite: boolean;
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

declare global {
  interface FileSystemFileHandle {
    queryPermission(descriptor?: { mode: 'read' | 'readwrite' }): Promise<PermissionState>;
    requestPermission(descriptor?: { mode: 'read' | 'readwrite' }): Promise<PermissionState>;
  }
}

export type TrackMetadata = Omit<Track, 'fileHandle' | 'file'>;