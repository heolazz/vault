import { useState, useEffect } from 'react';

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Mencegah Chrome menampilkan prompt default secara otomatis
      e.preventDefault();
      // Simpan event untuk dipicu nanti via tombol
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listener jika user selesai menginstall
    window.addEventListener('appinstalled', () => {
      console.log('App installed successfully');
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    // Tampilkan prompt install asli browser
    deferredPrompt.prompt();

    // Tunggu respon user (Accepted/Dismissed)
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response: ${outcome}`);

    // Reset prompt karena hanya bisa dipakai sekali
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return { isInstallable, installApp };
};