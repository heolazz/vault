import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ListMusic, Heart, Plus, Settings } from 'lucide-react';
import { handleFileSelect, isFileSystemSupported, handleDirectorySelect } from '../services/fileSystem';
import { useAppStore } from '../store/useAppStore';
import InstallButton from './InstallButton';

const MobileNav: React.FC = () => {
  const { addTracks, activeView, setActiveView } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const onImport = async () => {
    if (!isMobile && isFileSystemSupported()) {
      try {
        const tracks = await handleDirectorySelect();
        if (tracks.length) addTracks(tracks);
      } catch { fileInputRef.current?.click(); }
    } else {
      fileInputRef.current?.click();
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const tracks = await handleFileSelect(e.target.files);
      addTracks(tracks);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Helper untuk Item Navigasi Biasa
  const NavItem = ({ icon: Icon, label, view, onClick }: any) => {
    const isActive = activeView === view;
    // Jika tidak ada view (misal Settings), anggap tidak aktif
    const colorClass = isActive ? 'text-[#fa2d48]' : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300';

    return (
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onClick || (() => setActiveView(view))}
        className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${colorClass}`}
      >
        <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : 'stroke-[1.5px]'}`} />
        <span className="text-[10px] font-medium tracking-wide">{label}</span>
      </motion.button>
    );
  };

  return (
    <>
      {/* Input File Hidden */}
      <input type="file" multiple accept="audio/*" ref={fileInputRef} className="hidden" onChange={onFileChange} />

      {/* CONTAINER UTAMA */}
      <div className="
        md:hidden fixed bottom-0 left-0 right-0 
        h-[84px] pb-4 px-2
        bg-white/95 dark:bg-[#1c1c1e]/90 backdrop-blur-xl 
        border-t border-black/5 dark:border-white/5 
        z-40 flex items-center justify-between transition-colors duration-300
      ">

        {/* GRUP KIRI (Library & Favorites) */}
        <div className="flex-1 flex justify-around">
          <NavItem icon={ListMusic} label="Library" view="library" />
          <NavItem icon={Heart} label="Favorites" view="favorites" />
        </div>

        {/* GRUP TENGAH (Tombol Import Floating) */}
        <div className="relative -top-6 mx-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onImport}
            className="
                    w-14 h-14 rounded-full 
                    bg-gradient-to-tr from-[#fa2d48] to-[#ff4757]
                    flex items-center justify-center 
                    text-white shadow-[0_8px_16px_rgba(250,45,72,0.4)]
                    border-4 border-white dark:border-[#1c1c1e]
                    transition-opacity duration-200
                "
          >
            <Plus className="w-7 h-7 stroke-[3px]" />
          </motion.button>
        </div>

        {/* GRUP KANAN (Install & Settings) */}
        <div className="flex-1 flex justify-around items-center">
          {/* Install Button (Component ini sudah punya styling sendiri untuk mobile) */}
          <div className="flex-1 flex justify-center">
            <InstallButton mobile />
          </div>

          {/* Settings */}
          <NavItem icon={Settings} label="Settings" view="settings" />
        </div>

      </div>
    </>
  );
};

export default MobileNav;