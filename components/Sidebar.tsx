import React, { useRef } from 'react';
import { FolderOpen, Music, Home, Heart, Settings, ListMusic } from 'lucide-react';
import { handleDirectorySelect, handleFileSelect, isFileSystemSupported } from '../services/fileSystem';
import { useAppStore } from '../store/useAppStore';

const Sidebar: React.FC = () => {
  const { addTracks } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSelectFolder = async () => {
    if (isFileSystemSupported()) {
       try {
         const newTracks = await handleDirectorySelect();
         if (newTracks.length > 0) addTracks(newTracks);
       } catch (e) {
         // Fallback manual if cancelled or failed
       }
    } else {
       fileInputRef.current?.click();
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
          const newTracks = await handleFileSelect(files);
          addTracks(newTracks);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const NavItem = ({ icon: Icon, label, active = false }: any) => (
    <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[15px] font-medium transition-all ${active ? 'bg-[#fa2d48]/10 text-[#fa2d48]' : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'}`}>
      <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5px]' : 'stroke-2'}`} />
      {label}
    </button>
  );

  return (
    <div className="w-[260px] h-full flex flex-col shrink-0 bg-[#1e1e1e]/95 backdrop-blur-xl border-r border-white/5 pt-10 pb-6">
      <input type="file" multiple accept="audio/*" ref={fileInputRef} className="hidden" onChange={onFileChange} />

      <div className="px-5 mb-6">
         <h1 className="text-xl font-bold text-white mb-6 flex items-center gap-2 tracking-tight">
            <Music className="w-6 h-6 text-[#fa2d48] fill-current" /> Music
         </h1>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        <NavItem icon={Home} label="Listen Now" />
        <NavItem icon={ListMusic} label="Library" active />
        <NavItem icon={Heart} label="Favorites" />
      </nav>

      <div className="px-5 py-4">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 pl-1">Playlists</p>
        <button onClick={onSelectFolder} className="w-full group border border-[#fa2d48]/30 hover:border-[#fa2d48] text-[#fa2d48] rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-all active:scale-95">
          <FolderOpen className="w-5 h-5" />
          <span className="font-medium text-sm">Open Folder / Files</span>
        </button>
      </div>

      <div className="px-3 mt-auto"><NavItem icon={Settings} label="Settings" /></div>
    </div>
  );
};
export default Sidebar;