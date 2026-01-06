import * as musicMetadata from 'music-metadata-browser';
import { Track } from '../types';

export const isFileSystemSupported = () => 'showDirectoryPicker' in window;

// --- DESKTOP: FOLDER PICKER ---
export const handleDirectorySelect = async (): Promise<Track[]> => {
  if (!isFileSystemSupported()) return [];
  
  try {
    const dirHandle = await window.showDirectoryPicker();
    const tracks: Track[] = [];
    
    console.log("Scanning folder:", dirHandle.name);

    const processEntry = async (handle: any, pathStr: string) => {
      if (handle.kind === 'file') {
        const file = await handle.getFile();
        if (isAudioFile(file)) {
          const track = await parseMetadata(file, handle, pathStr);
          tracks.push(track);
        }
      } else if (handle.kind === 'directory') {
        for await (const entry of handle.values()) {
          await processEntry(entry, `${pathStr}/${entry.name}`);
        }
      }
    };

    await processEntry(dirHandle, dirHandle.name);
    return tracks;
  } catch (error: any) {
    if (error.name !== 'AbortError') console.error("Error directory scan:", error);
    return [];
  }
};

// --- MOBILE: FILE INPUT (Fallback) ---
export const handleFileSelect = async (files: FileList | null): Promise<Track[]> => {
  if (!files || files.length === 0) return [];

  const tracks: Track[] = [];
  console.log(`Processing ${files.length} files from mobile input...`);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (isAudioFile(file)) {
      // Pass 'undefined' as handle, but store 'file' blob directly
      const track = await parseMetadata(file, undefined, `Mobile/${file.name}`);
      track.file = file; // PENTING: Simpan blob agar bisa diputar di HP
      tracks.push(track);
    }
  }

  return tracks;
};

const isAudioFile = (file: File) => {
  return /\.(mp3|flac|wav|m4a|ogg)$/i.test(file.name);
};

const parseMetadata = async (file: File, handle: any, path: string): Promise<Track> => {
  let title = file.name;
  let artist = 'Unknown Artist';
  let album = 'Unknown Album';
  let duration = 0;

  try {
    // Parsing metadata (Cover art, Artist, etc)
    const metadata = await musicMetadata.parseBlob(file);
    title = metadata.common.title || file.name;
    artist = metadata.common.artist || 'Unknown Artist';
    album = metadata.common.album || 'Unknown Album';
    duration = metadata.format.duration || 0;
  } catch (e) {
    console.warn(`Metadata parse fail: ${file.name}`, e);
  }

  return {
    id: Date.now() + Math.random(),
    fileHandle: handle,
    file: undefined, // Akan diisi manual oleh caller jika mobile
    title,
    artist,
    album,
    duration,
    format: file.type,
    path
  };
};