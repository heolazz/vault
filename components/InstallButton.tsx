import React from 'react';
import { Download, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface Props {
  mobile?: boolean;
}

const InstallButton: React.FC<Props> = ({ mobile }) => {
  const { isInstallable, installApp } = usePWAInstall();

  if (!isInstallable) return null;

  if (mobile) {
    // Mobile: Icon kecil di Nav Bar (Simple)
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

  // Desktop: Premium Banner Style
  return (
    <div className="px-2 mb-2">
        <button
          onClick={installApp}
          className="
            group w-full relative overflow-hidden
            bg-gradient-to-br from-[#fa2d48]/20 to-[#fa2d48]/5 
            border border-[#fa2d48]/20 hover:border-[#fa2d48]/50
            rounded-xl p-3 text-left transition-all duration-300
            hover:shadow-[0_0_20px_rgba(250,45,72,0.15)]
          "
        >
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-[#fa2d48] flex items-center justify-center shrink-0 shadow-lg shadow-red-900/20 group-hover:scale-110 transition-transform">
                <Download className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-bold text-white tracking-wide">Install App</span>
                <span className="text-[10px] text-zinc-400 group-hover:text-zinc-300">Get better performance</span>
            </div>
          </div>
          
          {/* Decorative Glow */}
          <div className="absolute -right-4 -top-4 w-12 h-12 bg-[#fa2d48] blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity" />
        </button>
    </div>
  );
};

export default InstallButton;