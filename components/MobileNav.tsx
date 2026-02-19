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
        h-[84px] pb-4 px-6
        bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-xl 
        border-t border-black/5 dark:border-white/5 
        z-40 flex items-center justify-between transition-colors duration-300
      ">
        <NavItem icon={ListMusic} label="Library" view="library" />
        <NavItem icon={Heart} label="Favorites" view="favorites" />

        {/* Import Item */}
        <NavItem
          icon={Plus}
          label="Import"
          view="import" // Dummy view name, onClick handles it
          onClick={onImport}
        />

        <NavItem icon={Settings} label="Settings" view="settings" />
      </div>
    </>
  );
};

export default MobileNav;