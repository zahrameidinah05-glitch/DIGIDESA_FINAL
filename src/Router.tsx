import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient'; // Pastikan path ini benar
import App from './App'; 
import AdminDashboard from './pages/AdminDashboard';
import PengajuanSurat from './components/Surat/PengajuanSurat';
import Login from './pages/Login'; 

const AppRouter = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Cek sesi saat aplikasi pertama kali dimuat
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Pantau perubahan status login secara realtime
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null; // Atau ganti dengan loading spinner yang luxury

  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman yang bisa dibuka siapa saja */}
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pengajuan" element={<PengajuanSurat />} />
        
        {/* Halaman Dashboard Admin (Diproteksi) */}
        <Route 
          path="/dashboard" 
          element={session ? <AdminDashboard /> : <Navigate to="/login" />} 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;