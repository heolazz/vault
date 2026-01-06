import React from 'react';
import { Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface Props {
  mobile?: boolean;
}

const InstallButton: React.FC<Props> = ({ mobile }) => {
  const { isInstallable, installApp } = usePWAInstall();

  // Jika browser tidak support PWA atau sudah terinstall, jangan render apa-apa
  if (!isInstallable) return null;

  if (mobile) {
    // Style Mobile: Icon kecil di Navigasi Bawah
    return (
      <button 
        onClick={installApp}
        className="flex flex-col items-center gap-1 text-zinc-400 hover:text-[#fa2d48] animate-pulse"
      >
        <Download className="w-6 h-6" />
        <span className="text-[10px] font-medium">Install</span>
      </button>
    );
  }

  // Style Desktop: Tombol Panjang di Sidebar
  return (
    <button
      onClick={installApp}
      className="w-full mb-3 group border border-[#fa2d48]/50 bg-[#fa2d48]/10 hover:bg-[#fa2d48] text-[#fa2d48] hover:text-white rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-all duration-300"
    >
      <Download className="w-5 h-5" />
      <span className="font-medium text-sm">Install App</span>
    </button>
  );
};

export default InstallButton;