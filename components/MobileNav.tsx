import React, { useRef } from 'react';
import { Home, Library, FolderOpen, Search } from 'lucide-react';
import { handleFileSelect, isFileSystemSupported, handleDirectorySelect } from '../services/fileSystem';
import { useAppStore } from '../store/useAppStore';

const MobileNav: React.FC = () => {
  const { addTracks } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onMainAction = async () => {
    // Priority: Folder Picker (Desktop) -> File Input (Mobile)
    if (isFileSystemSupported()) {
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

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#1c1c1e]/95 backdrop-blur-xl border-t border-white/10 z-40 px-6 flex items-center justify-between pb-4 safe-area-bottom">
      <input type="file" multiple accept="audio/*" ref={fileInputRef} className="hidden" onChange={onFileChange} />
      
      <div className="flex flex-col items-center gap-1 text-zinc-500"><Home className="w-6 h-6" /><span className="text-[10px]">Home</span></div>
      
      {/* Floating Action Button */}
      <button onClick={onMainAction} className="relative -top-5 bg-[#fa2d48] w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-red-900/50 active:scale-95 transition-transform">
        <FolderOpen className="w-6 h-6 text-white" />
      </button>

      <div className="flex flex-col items-center gap-1 text-white"><Library className="w-6 h-6" /><span className="text-[10px]">Library</span></div>
    </div>
  );
};
export default MobileNav;