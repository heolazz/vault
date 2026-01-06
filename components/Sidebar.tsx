import React, { useRef } from 'react';
import { FolderOpen, Home, Heart, Settings, ListMusic, PlusCircle } from 'lucide-react';
import { handleDirectorySelect, handleFileSelect, isFileSystemSupported } from '../services/fileSystem';
import { useAppStore } from '../store/useAppStore';
import InstallButton from './InstallButton';

const Sidebar: React.FC = () => {
  const { addTracks, activeView, setActiveView } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSelectFolder = async () => {
    if (isFileSystemSupported()) {
       try {
         const newTracks = await handleDirectorySelect();
         if (newTracks.length > 0) addTracks(newTracks);
       } catch (e) {}
    } else { fileInputRef.current?.click(); }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
          const newTracks = await handleFileSelect(e.target.files);
          addTracks(newTracks);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const NavItem = ({ icon: Icon, label, viewName }: any) => {
    const isActive = activeView === viewName;
    return (
      <button 
        onClick={() => setActiveView(viewName)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 ${isActive ? 'bg-[#fa2d48]/10 text-[#fa2d48]' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
        {label}
      </button>
    );
  };

  return (
    <div className="w-[260px] h-full flex flex-col shrink-0 bg-[#1e1e1e]/95 backdrop-blur-xl border-r border-white/5 pt-8 pb-6">
      <input type="file" multiple accept="audio/*" ref={fileInputRef} className="hidden" onChange={onFileChange} />

      {/* --- LOGO --- */}
      <div className="px-6 mb-8">
         <h1 className="text-2xl font-extrabold tracking-tighter text-white">
            Vault<span className="text-[#fa2d48]">Music</span>
         </h1>
      </div>

      {/* --- MAIN NAVIGATION --- */}
      <div className="px-3">
         <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2 px-3">Menu</div>
         <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
                <Home className="w-5 h-5 stroke-2" /> Listen Now
            </button>
            <NavItem icon={ListMusic} label="Library" viewName="library" />
            <NavItem icon={Heart} label="Favorites" viewName="favorites" />
         </nav>
      </div>

      <div className="my-6 border-t border-white/5 mx-6" />

      {/* --- IMPORT SECTION (OPEN FOLDER) --- */}
      <div className="px-3">
        <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2 px-3">Library</div>
        
        {/* Tombol Open Folder yang Lebih Premium */}
        <button 
            onClick={onSelectFolder} 
            className="
                w-full group relative overflow-hidden
                bg-zinc-800 hover:bg-zinc-700
                border border-white/5 hover:border-white/10
                text-white rounded-xl px-4 py-3 
                flex items-center gap-3 transition-all duration-300
                mb-2
            "
        >
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#fa2d48] group-hover:text-white transition-colors duration-300">
             <PlusCircle className="w-5 h-5" />
          </div>
          <div className="flex flex-col items-start">
             <span className="text-sm font-semibold">Import Music</span>
             <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300">Folder or Files</span>
          </div>
        </button>
      </div>

      {/* --- BOTTOM SECTION --- */}
      <div className="mt-auto px-3 space-y-1">
        
        {/* Tombol Install App (Banner Style) */}
        <InstallButton /> 
        
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
            <Settings className="w-5 h-5 stroke-2" /> Settings
        </button>
      </div>
    </div>
  );
};
export default Sidebar;