import React, { useRef } from 'react';
import { FolderOpen, Music, Home, Heart, Settings, ListMusic } from 'lucide-react';
import { handleDirectorySelect, handleFileSelect, isFileSystemSupported } from '../services/fileSystem';
import { useAppStore } from '../store/useAppStore';
import InstallButton from './InstallButton';

const Sidebar: React.FC = () => {
  const { addTracks, activeView, setActiveView } = useAppStore(); // Ambil state baru
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

  // Helper component untuk tombol nav
  const NavItem = ({ icon: Icon, label, viewName }: any) => {
    const isActive = activeView === viewName;
    return (
      <button 
        onClick={() => setActiveView(viewName)} // Ganti View saat diklik
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[15px] font-medium transition-all ${isActive ? 'bg-[#fa2d48]/10 text-[#fa2d48]' : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'}`}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
        {label}
      </button>
    );
  };

  return (
    // UBAH DARI pb-32 KEMBALI KE pb-6
    // Karena sekarang Player ada di SEBELAH KANAN sidebar, bukan di ATAS sidebar
    <div className="w-[260px] h-full flex flex-col shrink-0 bg-[#1e1e1e]/95 backdrop-blur-xl border-r border-white/5 pt-10 pb-6">
      
      {/* ... (Konten Sidebar tetap sama) ... */}
      <input type="file" multiple accept="audio/*" ref={fileInputRef} className="hidden" onChange={onFileChange} />

      <div className="px-5 mb-6">
         <h1 className="text-xl font-bold text-white mb-6 flex items-center gap-2 tracking-tight">
            <Music className="w-6 h-6 text-[#fa2d48] fill-current" /> Music
         </h1>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[15px] font-medium text-zinc-400 hover:text-zinc-100 hover:bg-white/5">
            <Home className="w-5 h-5 stroke-2" /> Listen Now
        </button>
        <NavItem icon={ListMusic} label="Library" viewName="library" />
        <NavItem icon={Heart} label="Favorites" viewName="favorites" />
      </nav>

      <div className="px-5 py-4">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 pl-1">Playlists</p>
        <button onClick={onSelectFolder} className="w-full group border border-[#fa2d48]/30 hover:border-[#fa2d48] text-[#fa2d48] rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-all active:scale-95">
          <FolderOpen className="w-5 h-5" />
          <span className="font-medium text-sm">Open Folder / Files</span>
        </button>
      </div>

      <div className="px-3 mt-auto">
        <InstallButton /> 
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[15px] font-medium text-zinc-400 hover:text-zinc-100 hover:bg-white/5">
            <Settings className="w-5 h-5 stroke-2" /> Settings
        </button>
      </div>
    </div>
  );
};
export default Sidebar;