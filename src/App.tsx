import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Tentang from './components/Tentang';
import Gallery from './components/Gallery';
import Pelayanan from './components/Pelayanan';
import Lokasi from './components/Lokasi';
import Faq from './components/Faq';
import PengajuanSurat from './components/Surat/PengajuanSurat';

// Komponen pembantu agar setiap pindah route, posisi scroll balik ke atas
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const HomePage = () => (
  <>
    <Hero />
    <Tentang />
    <Gallery />
    <Pelayanan />
    <Lokasi />
    <Faq />
  </>
);

function App() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 selection:bg-blue-100 font-sans">
      {/* Memastikan scroll reset setiap pindah halaman */}
      <ScrollToTop />

      {/* Navbar tetap muncul di semua halaman */}
      <Navbar />
      
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pengajuan" element={<PengajuanSurat />} />
          
          {/* Opsi: Tambahkan 404 Page jika route tidak ditemukan */}
          <Route path="*" element={
            <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-4xl font-black text-blue-900 mb-2">404</h1>
              <p className="text-slate-500 mb-6">Halaman tidak ditemukan.</p>
              <a href="/" className="px-6 py-2 bg-blue-900 text-white rounded-full font-bold">Kembali</a>
            </div>
          } />
        </Routes>
      </main>

      {/* Footer Utama */}
      <footer className="py-16 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <span className="font-black text-2xl tracking-tighter text-white">DIGIDESA</span>
            <span className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase">Balapulang - Tegal</span>
          </div>
          
          <div className="h-[1px] w-20 bg-blue-900/50" />
          
          <p className="opacity-40 text-[10px] font-semibold tracking-[0.2em] uppercase text-center leading-loose">
            © 2026 Balai Desa Balapulang <br /> 
            Dikembangkan oleh <span className="text-blue-400">Andra Developer</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;