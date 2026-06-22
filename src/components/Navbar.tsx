import { Landmark, Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const waNumber = "6288220007296";

  const handleScroll = (id: string) => {
    setIsOpen(false); 
    const executeScroll = () => {
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const yOffset = -100; 
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 200); 
    };

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => { executeScroll(); }, 400);
    } else {
      executeScroll();
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-[100] border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="p-2.5 bg-blue-900 rounded-xl shadow-lg shadow-blue-900/20">
              <Landmark className="text-white" size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter text-blue-900 leading-none">DIGIDESA</span>
              <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase whitespace-nowrap">Digitalisasi Administrasi Desa</span>
            </div>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex gap-8 font-semibold text-slate-500 text-sm uppercase tracking-widest items-center">
            <button onClick={() => handleScroll('tentang')} className="hover:text-blue-900 transition-colors">Tentang</button>
            
            {/* Dropdown Buat Surat Desktop */}
            <div className="relative group cursor-pointer">
              <button className="flex items-center gap-1 hover:text-blue-900 transition-colors uppercase tracking-widest text-sm font-semibold">
                Pelayan Administrasi <ChevronDown size={14} />
              </button>
              
              <div className="absolute top-full left-0 w-64 bg-white shadow-2xl rounded-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-slate-50 translate-y-2 group-hover:translate-y-0 z-[120]">
                <Link to="/pengajuan?jenis=sktm" className="block p-3 hover:bg-blue-50 rounded-xl transition-colors font-bold text-slate-700 hover:text-blue-900">
                  SKTM Umum
                  <span className="block text-[10px] font-medium text-slate-400 uppercase tracking-tighter">Kesehatan & Bantuan</span>
                </Link>
                <Link to="/pengajuan?jenis=sktm_sekolah" className="block p-3 hover:bg-blue-50 rounded-xl transition-colors font-bold text-slate-700 hover:text-blue-900 border-t border-slate-50">
                  SKTM Sekolah
                  <span className="block text-[10px] font-medium text-slate-400 uppercase tracking-tighter">Bantuan Seragam/Sekolah</span>
                </Link>
                <Link to="/pengajuan?jenis=skt" className="block p-3 hover:bg-blue-50 rounded-xl transition-colors font-bold text-slate-700 hover:text-blue-900 border-t border-slate-50">
                  Surat Tanah (SKT)
                  <span className="block text-[10px] font-medium text-slate-400 uppercase tracking-tighter">Kehilangan Sertifikat</span>
                </Link>
                <Link to="/pengajuan?jenis=sku" className="block p-3 hover:bg-blue-50 rounded-xl transition-colors font-bold text-slate-700 hover:text-blue-900 border-t border-slate-50">
                  Surat Izin Usaha (SKU)
                  <span className="block text-[10px] font-medium text-slate-400 uppercase tracking-tighter">Legalitas UMKM</span>
                </Link>
                
                {/* TAMBAHAN: SURAT PENGANTAR KTP DESKTOP */}
                <Link to="/pengajuan?jenis=ktp" className="block p-3 hover:bg-blue-50 rounded-xl transition-colors font-bold text-slate-700 hover:text-blue-900 border-t border-slate-50">
                  Surat Pengantar KTP
                  <span className="block text-[10px] font-medium text-slate-400 uppercase tracking-tighter">Baru / Perpanjang / Hilang</span>
                </Link>

                <Link to="/pengajuan?jenis=pindah" className="block p-3 hover:bg-blue-50 rounded-xl transition-colors font-bold text-slate-700 hover:text-blue-900 border-t border-slate-50">
                  Surat Pindah
                  <span className="block text-[10px] font-medium text-slate-400 uppercase tracking-tighter">Keterangan Tinggal</span>
                </Link>
                <Link to="/pengajuan?jenis=kk" className="block p-3 hover:bg-blue-50 rounded-xl transition-colors font-bold text-slate-700 hover:text-blue-900 border-t border-slate-50">
                  Pembuatan KK
                  <span className="block text-[10px] font-medium text-slate-400 uppercase tracking-tighter">Kartu Keluarga Baru</span>
                </Link>
                <Link to="/pengajuan?jenis=skck" className="block p-3 hover:bg-blue-50 rounded-xl transition-colors font-bold text-slate-700 hover:text-blue-900 border-t border-slate-50">
                  Surat Keterangan SKCK
                  <span className="block text-[10px] font-medium text-slate-400 uppercase tracking-tighter">Keterangan Kerja</span>
                </Link>
                <Link to="/pengajuan?jenis=anak" className="block p-3 hover:bg-blue-50 rounded-xl transition-colors font-bold text-slate-700 hover:text-blue-900 border-t border-slate-50">
                  Surat Urutan Anak
                  <span className="block text-[10px] font-medium text-slate-400 uppercase tracking-tighter">Keterangan Anak</span>
                </Link>
              </div>
            </div>

            <button onClick={() => handleScroll('pelayanan')} className="hover:text-blue-900 transition-colors">Persyaratan Dokumen</button>
            <button onClick={() => handleScroll('lokasi')} className="hover:text-blue-900 transition-colors">Lokasi</button>
            <button onClick={() => handleScroll('faq')} className="hover:text-blue-900 transition-colors">FAQ</button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-slate-600 transition-transform active:scale-90" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-20 left-0 w-full bg-white flex flex-col overflow-hidden md:hidden shadow-2xl z-[150] border-b border-slate-100"
          >
            <div className="p-6 flex flex-col gap-2">
              <button 
                onClick={() => handleScroll('tentang')} 
                className="w-full text-left p-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
              >
                Tentang Desa
              </button>
              
              <div className="my-2 flex flex-col gap-2 pl-4 border-l-2 border-blue-900 bg-slate-50/50 p-4 rounded-r-2xl">
                <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-1">Pelayanan Administratif</span>
                <Link to="/pengajuan?jenis=sktm" onClick={() => setIsOpen(false)} className="py-1 text-sm font-bold text-slate-500 hover:text-blue-900">- Surat SKTM (Umum)</Link>
                <Link to="/pengajuan?jenis=sktm_sekolah" onClick={() => setIsOpen(false)} className="py-1 text-sm font-bold text-slate-500 hover:text-blue-900">- Surat SKTM (Sekolah)</Link>
                <Link to="/pengajuan?jenis=skt" onClick={() => setIsOpen(false)} className="py-1 text-sm font-bold text-slate-500 hover:text-blue-900">- Surat Tanah (SKT)</Link>
                <Link to="/pengajuan?jenis=sku" onClick={() => setIsOpen(false)} className="py-1 text-sm font-bold text-slate-500 hover:text-blue-900">- Surat Izin Usaha (SKU)</Link>
                
                {/* TAMBAHAN: SURAT PENGANTAR KTP MOBILE */}
                <Link to="/pengajuan?jenis=ktp" onClick={() => setIsOpen(false)} className="py-1 text-sm font-bold text-slate-500 hover:text-blue-900">- Surat Pengantar KTP</Link>
                
                <Link to="/pengajuan?jenis=umum" onClick={() => setIsOpen(false)} className="py-1 text-sm font-bold text-slate-500 hover:text-blue-900">- Surat Domisili (Umum)</Link>
                <Link to="/pengajuan?jenis=kk" onClick={() => setIsOpen(false)} className="py-1 text-sm font-bold text-slate-500 hover:text-blue-900">- Pembuatan KK</Link>
                <Link to="/pengajuan?jenis=skck" onClick={() => setIsOpen(false)} className="py-1 text-sm font-bold text-slate-500 hover:text-blue-900">- Surat Keterangan SKCK</Link>
                <Link to="/pengajuan?jenis=anak" onClick={() => setIsOpen(false)} className="py-1 text-sm font-bold text-slate-500 hover:text-blue-900">- Surat Urutan Anak</Link>
              </div>

              <button 
                onClick={() => handleScroll('pelayanan')} 
                className="w-full text-left p-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
              >
                Persyaratan Dokumen
              </button>

              <button 
                onClick={() => handleScroll('lokasi')} 
                className="w-full text-left p-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
              >
                Lokasi Kantor
              </button>

              <button 
                onClick={() => handleScroll('faq')} 
                className="w-full text-left p-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
              >
                Tanya Jawab (FAQ)
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;