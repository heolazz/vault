import React from 'react';
import { Moon, Sun, Download, Trash2, Smartphone, Github, Check } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { usePWAInstall } from '../hooks/usePWAInstall';

const Settings: React.FC = () => {
  const { theme, toggleTheme, clearLibrary } = useAppStore();
  const { isInstallable, installApp } = usePWAInstall();

  // Helper Styles
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-[#1c1c1e]' : 'bg-[#f5f5f7]';
  const cardColor = isDark ? 'bg-[#2c2c2e]' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-black';
  const subTextColor = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const borderColor = isDark ? 'border-white/10' : 'border-black/5';

  const handleClear = () => {
    if (window.confirm('Are you sure you want to delete all songs?')) clearLibrary();
  };

  return (
    <div className={`flex-1 flex flex-col h-full ${bgColor} overflow-y-auto pb-40 md:pb-20`}>
      
      {/* Header */}
      <div className={`h-16 flex items-center px-6 md:px-8 border-b ${borderColor} sticky top-0 z-10 ${bgColor}/80 backdrop-blur-md`}>
        <h2 className={`text-2xl font-bold ${textColor} tracking-tight`}>Settings</h2>
      </div>

      <div className="p-6 md:p-8 max-w-2xl mx-auto w-full space-y-8">
        
        {/* SECTION 1: APPEARANCE */}
        <section>
            <h3 className={`text-xs font-semibold uppercase tracking-wider ${subTextColor} mb-3 pl-1`}>Appearance</h3>
            <div className={`${cardColor} rounded-2xl overflow-hidden shadow-sm border ${borderColor}`}>
                <div 
                    onClick={toggleTheme}
                    className={`flex items-center justify-between p-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-orange-500/20 text-orange-500'}`}>
                            {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </div>
                        <div>
                            <p className={`font-medium ${textColor}`}>Theme Mode</p>
                            <p className={`text-xs ${subTextColor}`}>{isDark ? 'Dark' : 'Light'} Mode Active</p>
                        </div>
                    </div>
                    {/* Toggle Switch UI */}
                    <div className={`w-12 h-7 rounded-full p-1 transition-colors ${isDark ? 'bg-zinc-600' : 'bg-[#fa2d48]'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${isDark ? '' : 'translate-x-5'}`} />
                    </div>
                </div>
            </div>
        </section>

        {/* SECTION 2: APPLICATION (INSTALL) */}
        <section>
            <h3 className={`text-xs font-semibold uppercase tracking-wider ${subTextColor} mb-3 pl-1`}>Application</h3>
            <div className={`${cardColor} rounded-2xl overflow-hidden shadow-sm border ${borderColor} divide-y divide-white/5`}>
                
                {/* Install Button Logic */}
                {isInstallable ? (
                    <div 
                        onClick={installApp}
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                         <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-[#fa2d48]/20 text-[#fa2d48] flex items-center justify-center">
                                <Download className="w-5 h-5" />
                            </div>
                            <div>
                                <p className={`font-medium ${textColor}`}>Install App</p>
                                <p className={`text-xs ${subTextColor}`}>Install as PWA for offline use</p>
                            </div>
                        </div>
                        <span className="text-xs font-bold text-[#fa2d48] bg-[#fa2d48]/10 px-3 py-1 rounded-full">INSTALL</span>
                    </div>
                ) : (
                    <div className="flex items-center justify-between p-4 opacity-50 cursor-not-allowed">
                         <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                                <Check className="w-5 h-5" />
                            </div>
                            <div>
                                <p className={`font-medium ${textColor}`}>App Installed</p>
                                <p className={`text-xs ${subTextColor}`}>Running as Standalone App</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>

        {/* SECTION 3: STORAGE */}
        <section>
            <h3 className={`text-xs font-semibold uppercase tracking-wider ${subTextColor} mb-3 pl-1`}>Storage & Data</h3>
            <div className={`${cardColor} rounded-2xl overflow-hidden shadow-sm border ${borderColor}`}>
                <div 
                    onClick={handleClear}
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-red-500/10 transition-colors group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                            <Trash2 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className={`font-medium ${isDark ? 'text-red-400' : 'text-red-600'}`}>Clear Library</p>
                            <p className={`text-xs ${subTextColor}`}>Delete all songs from database</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Footer Info */}
        <div className="flex flex-col items-center justify-center pt-8 gap-2">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                <Smartphone className={`w-6 h-6 ${subTextColor}`} />
            </div>
            <p className={`text-sm font-medium ${textColor}`}>SonicVault Music</p>
            <p className={`text-xs ${subTextColor}`}>v1.2.0 • Local-First Player</p>
        </div>

      </div>
    </div>
  );
};

export default Settings;