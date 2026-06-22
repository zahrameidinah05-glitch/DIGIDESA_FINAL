import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export const useAdminLogic = () => {
  const [pengajuan, setPengajuan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pengajuan_surat')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setPengajuan(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const channel = supabase
      .channel('db-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pengajuan_surat' }, () => fetchData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    await supabase.from('pengajuan_surat').update({ status: newStatus }).eq('id', id);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus data ini secara permanen?")) {
      await supabase.from('pengajuan_surat').delete().eq('id', id);
    }
  };

  const exportToCSV = () => {
    const headers = ["Nama,NIK,Jenis Surat,Status,Tanggal\n"];
    const rows = pengajuan.map(item => 
      `${item.nama_lengkap},${item.nik},${item.jenis_surat},${item.status},${item.created_at}`
    );
    const blob = new Blob([headers + rows.join("\n")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rekap_Pengajuan_${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  return { pengajuan, loading, handleUpdateStatus, handleDelete, exportToCSV };
};