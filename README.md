# VaultMusic

**VaultMusic** is a modern, local-first web music player designed to bring a premium desktop experience to the browser. It allows users to play their local music files with a clean, Apple Music-inspired interface, completely offline.

![VaultMusic Preview](/public/images/preview.png)

## Key Features

* **Local-First Architecture:** Plays files directly from your device. No server uploads required.
* **Offline Support (PWA):** Installable as a standalone app on Desktop and Mobile. Works without an internet connection.
* **Modern UI/UX:** Dark mode aesthetics inspired by premium music apps with glassmorphism effects.
* **Smart Library Management:**
    * **Anti-Duplication:** Automatically filters out duplicate songs during import.
    * **Persistent Storage:** Uses IndexedDB via Dexie.js to save your library and favorites.
* **Audio Features:**
    * Shuffle, Loop, and Volume control.
    * Mini Player & Full Screen Player (Mobile).
    * Favorites system (Like/Unlike songs).
* **Cross-Platform:** Responsive design that adapts perfectly from Desktop monitors to Mobile screens.

## Tech Stack

* **Framework:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **State Management:** [Zustand](https://github.com/pmndrs/zustand)
* **Database:** [Dexie.js](https://dexie.org/) (IndexedDB Wrapper)
* **Virtualization:** [React Virtuoso](https://virtuoso.dev/) (For handling large lists efficiently)
* **PWA:** [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
* **Icons:** [Lucide React](https://lucide.dev/)

## Getting Started

Follow these steps to run the project locally.

### Prerequisites
* Node.js (v16 or higher)
* npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/vault-music.git](https://github.com/yourusername/vault-music.git)
    cd vault-music
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open in Browser**
    Visit `http://localhost:3000` to see the app.

## How to Use

1.  **Import Music:** Click the **"Import Music"** button in the sidebar (Desktop) or the **+** button (Mobile). Select a folder or multiple MP3 files.
2.  **Install App:**
    * **Desktop:** Click the "Install App" banner at the bottom of the sidebar.
    * **Mobile:** Tap "Share" > "Add to Home Screen" (iOS) or the Install prompt (Android).
3.  **Manage Library:**
    * Click the **Trash** icon to delete a song.
    * Use **Clear All** in settings to reset the database.
    * Click the **Heart** icon to add songs to your "Favorites" tab.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

**Built with ❤️ by [Harits Taqiy]**