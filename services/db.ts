import Dexie, { Table } from 'dexie';
import { Track } from '../types';

class SonicVaultDB extends Dexie {
  tracks!: Table<Track, number>;

  constructor() {
    super('SonicVaultDB');
    // Schema: field yang mau di-query/index ditaruh sini.
    // fileHandle tidak perlu di-index, tapi akan tersimpan otomatis.
    this.version(1).stores({
      tracks: '++id, title, artist, album' 
    });
  }
}

export const db = new SonicVaultDB();

// Schema declaration moved outside constructor to avoid type inference issues
db.version(1).stores({
  tracks: '++id, title, artist, album, path' // Indexes
});

export const clearLibrary = async () => {
  await db.tracks.clear();
};

export const saveTracks = async (tracks: Track[]) => {
  await db.tracks.bulkAdd(tracks);
};

export const getAllTracks = async (): Promise<Track[]> => {
  return await db.tracks.toArray();
};