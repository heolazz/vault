import React from 'react';
import { Moon, Sun, Download, Trash2, Smartphone, Github, Check } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { usePWAInstall } from '../hooks/usePWAInstall';

const Settings: React.FC = () => {
    const { theme, toggleTheme, clearLibrary } = useAppStore();
    const { isInstallable, installApp } = usePWAInstall();

    // Helper Styles
    const isDark = theme === 'dark';
    const bgColor = isDark ? 'bg-[#1c1c1e]' : 'bg-white';
    const cardColor = isDark ? 'bg-[#2c2c2e]' : 'bg-white';
    const textColor = isDark ? 'text-white' : 'text-black';
    const subTextColor = isDark ? 'text-zinc-400' : 'text-zinc-500';
    const borderColor = isDark ? 'border-white/10' : 'border-black/5';
    const shadowClass = isDark ? 'shadow-lg' : 'shadow-none';

    const handleClear = () => {
        if (window.confirm('Are you sure you want to delete all songs?')) clearLibrary();
    };

    return (
        <div className={`flex-1 flex flex-col h-full ${bgColor} overflow-y-auto pb-40 md:pb-20`}>

            {/* Header */}
            <div className={`h-16 flex items-center px-6 md:px-8 border-b ${borderColor} sticky top-0 z-10 ${bgColor}/80 backdrop-blur-md`}>
            </div>

            <div className="p-6 md:p-8 max-w-2xl mx-auto w-full space-y-8">

                <section>
                    <h3 className={`text-xs font-semibold uppercase tracking-wider ${subTextColor} mb-3 pl-1`}>Appearance</h3>
                    <div className={`${cardColor} rounded-2xl overflow-hidden ${shadowClass} border ${borderColor} p-1`}>
                        <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1 relative">
                            {/* Light Option */}
                            <button
                                onClick={() => theme === 'dark' && toggleTheme()}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 z-10 ${theme === 'light' ? 'bg-white text-black shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
                            >
                                <Sun className="w-4 h-4" /> Light
                            </button>

                            {/* Dark Option */}
                            <button
                                onClick={() => theme === 'light' && toggleTheme()}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 z-10 ${theme === 'dark' ? 'bg-[#3a3a3c] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
                            >
                                <Moon className="w-4 h-4" /> Dark
                            </button>
                        </div>
                        <div className="px-4 py-3 text-xs text-zinc-500 text-center border-t border-black/5 dark:border-white/5 mt-1">
                            Choose your preferred visual style.
                        </div>
                    </div>
                </section>

                {/* SECTION 2: APPLICATION (INSTALL) */}
                <section>
                    <h3 className={`text-xs font-semibold uppercase tracking-wider ${subTextColor} mb-3 pl-1`}>Application</h3>
                    <div className={`${cardColor} rounded-2xl overflow-hidden ${shadowClass} border ${borderColor}`}>

                        {isInstallable ? (
                            <div
                                onClick={installApp}
                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white group-hover:scale-110 transition-transform">
                                        <Download className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className={`font-medium ${textColor}`}>Install App</p>
                                        <p className={`text-xs ${subTextColor}`}>Install as PWA for offline use</p>
                                    </div>
                                </div>
                                <div className="text-zinc-400 dark:text-zinc-600">
                                    <Download className="w-5 h-5" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-4 opacity-70">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white">
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
                    <div className={`${cardColor} rounded-2xl overflow-hidden ${shadowClass} border ${borderColor}`}>
                        <div
                            onClick={handleClear}
                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white group-hover:scale-110 transition-transform">
                                    <Trash2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className={`font-medium ${textColor} group-hover:text-red-500 transition-colors`}>Clear Library</p>
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