import { motion } from 'framer-motion';
import { CheckCircle, Home, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export const StepSelesai = ({ formData }: { formData: any }) => {
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    // Kita tidak melakukan INSERT lagi di sini.
    // Fungsi ini hanya memberikan efek loading visual agar terlihat profesional.
    const timer = setTimeout(() => {
      setIsSyncing(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }} 
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-10 space-y-6"
    >
      {isSyncing ? (
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="text-blue-600 animate-spin" />
          <p className="text-slate-500 font-bold">Menyelesaikan pendaftaran...</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <CheckCircle size={48} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Permohonan Terkirim!</h3>
          <p className="text-slate-500 px-6 text-sm leading-relaxed mb-4">
            Halo <span className="font-bold text-slate-800">{formData.nama}</span>, data Anda telah berhasil dikirim ke balai desa.
          </p>
          <p className="text-slate-400 px-6 text-xs italic">
            Admin akan melakukan validasi berkas dalam waktu 1x24 jam.
          </p>
        </motion.div>
      )}
      
      {!isSyncing && (
        <div className="pt-4">
          <button 
            onClick={() => window.location.href = '/'} 
            className="inline-flex items-center gap-2 py-4 px-10 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 group"
          >
            <Home size={18} className="group-hover:-translate-y-0.5 transition-transform" /> 
            Kembali ke Beranda
          </button>
        </div>
      )}
    </motion.div>
  );
};