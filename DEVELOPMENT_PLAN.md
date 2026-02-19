# Development Plan: SonicVault

## 1. Current Status Overview
- **Core Features**: Local file playback, Directory import (Desktop), File Import (Mobile), Metadata parsing, IndexedDB storage.
- **Queue System**: "Up Next" queue fully implemented with UI support on Desktop and Mobile.
- **Settings & Theme**: Complete Dark/Light mode support and Settings page.
- **Tech Stack**: React, Vite, TypeScript, TailwindCSS, Zustand, Dexie.js.

## 2. Planned UI/UX Improvements

### A. Visual Polish & Animations
- **Micro-interactions**: Add subtle scale effects on button clicks (using `framer-motion`).
- **Page Transitions**: Smooth slide/fade when switching between Library, Favorites, and Settings.
- **Glassmorphism**: Enhance the `backdrop-blur` implementation on the Player and Sidebar.
- **Dynamic Background**: Extract dominant color from Album Art to tint the player background.

### B. Player Interface
- **Lyrics View**: Display synchronized lyrics (LRC) if available.
- **Audio Visualizer**: Real-time frequency bars in the expanded player.
- **Waveform Seek Bar**: Visual representation of the audio track.

### C. Mobile Experience
- **Gestures**: Swipe left/right on artwork to skip tracks.
- **Haptic Feedback**: Use `navigator.vibrate` for tactile feedback on controls.

## 3. Logic & Feature Enhancements

### A. Playlist Management (High Priority)
- **Custom Playlists**: Ability to create named playlists and add tracks to them.
- **Smart Playlists**: "Recently Added", "Most Played", "Never Played".
- **Playlist UI**: A dedicated view for managing and playing playlists.

### B. Advanced Audio Features
- **Equalizer (EQ)**: 5-band or 10-band equalizer with presets.
- **Crossfade**: Smooth transition between songs.
- **Gapless Playback**: Pre-load the next song buffer.

### C. Data & Library Management
- **Metadata Editing**: UI to fix incorrect tags (Title, Artist) and fetch cover art.
- **Sort & Filter**: Sort by Date Added, Duration, Artist, Album.
- **Fuzzy Search**: Improve search to handle typos.

### D. PWA & Offline
- **Background Audio**: Robust `mediaSession` integration.
- **Service Worker**: Ensure instant load for app shell.

## 4. Technical Debt & Refactoring
- **Optimization**: Verify `react-virtuoso` performance with 5000+ songs.
- **Error Handling**: Graceful "Permission Denied" handling for File System Access API on restart.

## 5. Next Immediate Steps
1. **Playlist Management**: Implement `createPlaylist`, `addToPlaylist` actions and a `Playlists` view.
2. **Search Improvements**: Add sorting options and better filtering.
3. **Audio Visualizer**: Implement a basic Web Audio API visualizer.
