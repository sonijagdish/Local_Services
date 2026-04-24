import { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import toast from 'react-hot-toast';

const OfflineOverlay = () => {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => {
            setIsOffline(false);
            toast.success("Network Re-established. Resyncing Grid...", { icon: <Wifi className="text-green-500" /> });
        };
        const handleOffline = () => {
            setIsOffline(true);
            toast.error("Network Severed. Running in Low-Power Offline Cache.", { icon: <WifiOff className="text-red-500" /> });
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <div className="fixed inset-x-0 bottom-6 z-[1000] px-6 animate-in slide-in-from-bottom-20 duration-500">
            <div className="bg-red-600/90 backdrop-blur-xl border border-red-500 text-white p-6 rounded-[2.5rem] shadow-2xl flex items-center justify-between max-w-xl mx-auto ring-4 ring-red-500/10">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center animate-pulse shadow-lg">
                        <WifiOff size={28} />
                    </div>
                    <div>
                        <h4 className="text-xl font-black uppercase tracking-tight font-mono">Status: Offline</h4>
                        <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest leading-none">Limited functionality detected. Waiting for 3G/4G/5G handshake.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OfflineOverlay;
