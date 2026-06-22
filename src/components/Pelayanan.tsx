import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, ShieldCheck, Send, X, ArrowRight, FileText, Users } from 'lucide-react';

const Pelayanan = () => {
  const [activeInfo, setActiveInfo] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#info-', '');
      if (['sktm', 'sktm_sekolah', 'skt', 'sku', 'ktp', 'pindah', 'kk', 'skck', 'anak'].includes(hash)) {
        setActiveInfo(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const layanan = [
    { 
      id: "sktm",
      title: "SKTM Umum", 
      desc: "Kesehatan & Bantuan. Persyaratan untuk pengajuan surat keterangan tidak mampu umum.", 
      icon: <ShieldCheck size={28} className="text-emerald-600" />,
      syarat: ["KTP Asli / Fotokopi", "Kartu Keluarga (KK)", "Surat Pengantar RT", "Kartu Sampah"]
    },
    { 
      id: "sktm_sekolah",
      title: "SKTM Sekolah", 
      desc: "Bantuan Seragam/Sekolah. Persyaratan untuk pengajuan SKTM keperluan sekolah anak.", 
      icon: <ShieldCheck size={28} className="text-emerald-600" />,
      syarat: ["KTP Asli / Fotokopi", "Kartu Keluarga (KK)", "Surat Pengantar RT", "Kartu Sampah"]
    },
    { 
      id: "skt",
      title: "Surat Tanah (SKT)", 
      desc: "Kehilangan Sertifikat. Persyaratan berkas untuk penerbitan surat keterangan kepemilikan dan status tanah.", 
      icon: <FileText size={28} className="text-orange-600" />,
      syarat: ["KTP Asli / Fotokopi", "Kartu Keluarga (KK)", "Surat Pengantar RT", "Kartu Sampah"]
    },
    { 
      id: "sku",
      title: "Surat Izin Usaha (SKU)", 
      desc: "Legalitas UMKM. Informasi mengenai berkas yang diperlukan untuk penerbitan izin usaha UMKM.", 
      icon: <LayoutDashboard size={28} className="text-blue-600" />,
      syarat: ["KTP Asli / Fotokopi", "Kartu Keluarga (KK)", "Surat Pengantar RT", "Kartu Sampah"]
    },
    { 
      id: "ktp",
      title: "Surat Pengantar KTP", 
      desc: "Baru / Perpanjang / Hilang. Persyaratan berkas untuk permohonan Kartu Tanda Penduduk.", 
      icon: <Users size={28} className="text-teal-600" />,
      syarat: ["KTP Lama Asli / Fotokopi", "Kartu Keluarga (KK)", "Surat Pengantar RT", "Kartu Sampah"]
    },
    { 
      id: "pindah",
      title: "Surat Pindah", 
      desc: "Keterangan Tinggal. Persyaratan berkas untuk administrasi domisili atau keterangan pindah.", 
      icon: <Send size={28} className="text-purple-600" />,
      syarat: ["KTP Asli / Fotokopi", "Kartu Keluarga (KK)", "Surat Pengantar RT", "Kartu Sampah"]
    },
    { 
      id: "kk",
      title: "Pembuatan KK", 
      desc: "Kartu Keluarga Baru. Persyaratan berkas untuk pengajuan pembuatan Kartu Keluarga (KK) baru.", 
      icon: <Users size={28} className="text-pink-600" />,
      syarat: ["KTP Asli / Fotokopi", "Kartu Keluarga (KK) Lama", "Surat Pengantar RT", "Kartu Sampah"]
    },
    { 
      id: "skck",
      title: "Surat Keterangan SKCK", 
      desc: "Keterangan Kerja. Persyaratan berkas untuk membuat surat keterangan catatan kepolisian (SKCK).", 
      icon: <Send size={28} className="text-indigo-600" />,
      syarat: ["KTP Asli / Fotokopi", "Kartu Keluarga (KK)", "Surat Pengantar RT", "Kartu Sampah"]
    },
    { 
      id: "anak",
      title: "Surat Urutan Anak", 
      desc: "Keterangan Anak. Persyaratan berkas untuk membuat akta kelahiran atau keterangan anak.", 
      icon: <Send size={28} className="text-cyan-600" />,
      syarat: ["KTP Orang Tua", "Kartu Keluarga (KK)", "Surat Pengantar RT", "Kartu Sampah"]
    }
  ];

  const currentLayanan = layanan.find(l => l.id === activeInfo);

  return (
    <section id="pelayanan" className="py-16 md:py-28 px-4 md:px-6 bg-[#F8FAFC] scroll-mt-28">
      <div className="max-w-7xl mx-auto text-center mb-12 md:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Kebutuhan Dokumen</h2>
          <p className="text-slate-500 text-sm md:text-lg max-w-2xl mx-auto">Klik pada kartu untuk melihat daftar persyaratan dokumen yang wajib Anda siapkan.</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
        {layanan.map((item) => (
          <motion.div 
            key={item.id}
            id={`info-${item.id}`} 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -12, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.08)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveInfo(item.id)}
            className="p-8 bg-white border border-slate-100 rounded-[2.5rem] transition-all cursor-pointer group relative overflow-hidden shadow-sm"
          >
            <div className="mb-6 p-5 bg-slate-50 w-fit rounded-3xl group-hover:bg-blue-50 transition-all duration-500">
              {item.icon}
            </div>
            <h4 className="text-xl md:text-2xl font-bold mb-4 text-slate-800 tracking-tight">{item.title}</h4>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-6">
              {item.desc}
            </p>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              Lihat Persyaratan <ArrowRight size={16} />
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeInfo && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[999] flex items-end md:items-center justify-center p-0 md:p-6"
            onClick={() => { setActiveInfo(null); window.history.replaceState(null, '', ' '); }}
          >
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()} 
              className="bg-white rounded-t-[2.5rem] md:rounded-[3rem] w-full max-w-lg relative shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => { setActiveInfo(null); window.history.replaceState(null, '', ' '); }}
                className="absolute top-6 right-6 p-3 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-600 transition-all z-20"
              >
                <X size={20} />
              </button>

              <div className="p-8 md:p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
                    {currentLayanan?.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">{currentLayanan?.title}</h3>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">Syarat Berkas</p>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {currentLayanan?.syarat.map((s, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      key={idx} 
                      className="flex items-center gap-3 text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                      <span className="text-sm md:text-base font-semibold">{s}</span>
                    </motion.div>
                  ))}
                </div>

                <button 
                  onClick={() => window.location.href = `/pengajuan?jenis=${currentLayanan?.id}`}
                  className="w-full py-5 bg-blue-900 text-white rounded-[1.8rem] font-bold flex items-center justify-center gap-3 hover:bg-blue-800 active:scale-[0.97] transition-all shadow-xl shadow-blue-900/20"
                >
                  Lanjutkan Buat Surat
                </button>

                <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                  <p className="text-[10px] text-slate-400 italic leading-relaxed">
                    Sistem akan memvalidasi data Anda secara otomatis berdasarkan berkas yang diunggah.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Pelayanan;