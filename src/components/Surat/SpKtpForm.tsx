import { motion } from 'framer-motion';
import { ArrowRight, FileText, Upload, Users, User, Trash2, Loader2, MapPin } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export const SpKtpForm = ({ onNext, data, setData }: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const inputStyle = "w-full p-4 bg-slate-50 border border-transparent rounded-[1.2rem] focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium shadow-inner text-sm";
  const labelStyle = "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block";

  const handleChange = (field: string, value: any) => {
    setData({ ...data, [field]: value });
  };

  const handleUploadAndSubmit = async () => {
    if (!data.fc_ktp || !data.fc_kk) {
      alert("Harap unggah minimal KTP Lama/Surat Kehilangan & KK terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);

    try {
      const uploadFile = async (file: File, folder: string) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${data.nik}_${folder}.${fileExt}`;
        const { data: res, error } = await supabase.storage
          .from('berkas-surat')
          .upload(fileName, file);
        
        if (error) throw error;
        return res.path;
      };

      const [pathKtp, pathKk] = await Promise.all([
        uploadFile(data.fc_ktp, 'ktp'),
        uploadFile(data.fc_kk, 'kk')
      ]);

      const pathRT = data.sp_rt ? await uploadFile(data.sp_rt, 'surat_rt') : null;
      const pathSampah = data.fc_sampah ? await uploadFile(data.fc_sampah, 'kartu_sampah') : null;

      const { error: dbErr } = await supabase
        .from('pengajuan_surat') 
        .insert([{
          nama: data.nama,
          nik: data.nik,
          jenis_surat: 'KTP',
          alamat: data.alamat,
          alamat_domisili: data.alamat_domisili || null, // Field Baru
          ttl: data.ttl || null,
          agama: data.agama || null,
          pekerjaan: data.pekerjaan || null,
          pendidikan: data.pendidikan || null,
          status_kawin: data.status_kawin || null,
          jenis_kelamin: data.jenis_kelamin || null,
          golongan_darah: data.golongan_darah || null,
          // Menggabungkan tipe permohonan ke dalam field keperluan
          keperluan: `Permohonan KTP: ${data.permohonan_ktp || 'Baru'}`, 
          
          url_ktp: pathKtp,
          url_kk: pathKk,
          url_surat_rt: pathRT,
          url_kartu_sampah: pathSampah,
          
          status: 'pending'
        }]);

      if (dbErr) throw dbErr;

      onNext(); 
    } catch (error: any) {
      console.error("Error Detail:", error);
      alert(`Terjadi kesalahan: ${error.message || "Gagal mengirim data"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      {/* SECTION 1: JENIS PERMOHONAN */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
        <label className={labelStyle}>Permohonan KTP</label>
        <div className="flex flex-wrap gap-2">
          {['Baru', 'Perpanjang', 'Penggantian'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleChange('permohonan_ktp', item)}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all ${data.permohonan_ktp === item ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 2: DATA DETAIL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
        <div className="space-y-1">
          <label className={labelStyle}>Tempat, Tanggal Lahir</label>
          <input type="text" placeholder="Tegal, 10-02-2005" className={inputStyle} value={data.ttl || ''} onChange={(e) => handleChange('ttl', e.target.value)} />
        </div>

        <div className="space-y-1">
          <label className={labelStyle}>Alamat Domisili</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-4 text-slate-400" size={16} />
            <input type="text" placeholder="Jl. Contoh No. 123" className={`${inputStyle} pl-11`} value={data.alamat_domisili || ''} onChange={(e) => handleChange('alamat_domisili', e.target.value)} />
          </div>
        </div>

        <div className="space-y-1">
          <label className={labelStyle}>Jenis Kelamin</label>
          <select className={inputStyle} value={data.jenis_kelamin || ''} onChange={(e) => handleChange('jenis_kelamin', e.target.value)}>
            <option value="">Pilih Jenis Kelamin</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className={labelStyle}>Golongan Darah</label>
          <input type="text" placeholder="-" className={inputStyle} value={data.golongan_darah || ''} onChange={(e) => handleChange('golongan_darah', e.target.value)} />
        </div>

        <div className="space-y-1">
          <label className={labelStyle}>Agama</label>
          <input type="text" placeholder="Islam" className={inputStyle} value={data.agama || ''} onChange={(e) => handleChange('agama', e.target.value)} />
        </div>

        <div className="space-y-1">
          <label className={labelStyle}>Pekerjaan</label>
          <input type="text" placeholder="Pelajar/Mahasiswa" className={inputStyle} value={data.pekerjaan || ''} onChange={(e) => handleChange('pekerjaan', e.target.value)} />
        </div>

        <div className="space-y-1">
          <label className={labelStyle}>Pendidikan</label>
          <input type="text" placeholder="Tamat SD/Sederajat" className={inputStyle} value={data.pendidikan || ''} onChange={(e) => handleChange('pendidikan', e.target.value)} />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className={labelStyle}>Status Perkawinan</label>
          <select className={inputStyle} value={data.status_kawin || ''} onChange={(e) => handleChange('status_kawin', e.target.value)}>
            <option value="">Pilih Status</option>
            <option value="Belum Kawin">Belum Kawin</option>
            <option value="Kawin">Kawin</option>
            <option value="Cerai Hidup">Cerai Hidup</option>
            <option value="Cerai Mati">Cerai Mati</option>
          </select>
        </div>
      </div>

      {/* SECTION 3: UPLOAD BERKAS */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Upload size={14} className="text-blue-600" /> Berkas Persyaratan (Foto/Scan)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { id: 'fc_ktp', label: 'KTP Lama / Surat Kehilangan', icon: <User size={14}/> },
            { id: 'fc_kk', label: 'Kartu Keluarga (KK)', icon: <Users size={14}/> },
            { id: 'fc_sampah', label: 'Kartu Sampah (Lunas)', icon: <Trash2 size={14}/> },
            { id: 'sp_rt', label: 'Surat Pengantar RT/RW', icon: <FileText size={14}/> },
          ].map((berkas) => (
            <div key={berkas.id} className="relative group">
              <label className="flex items-center justify-between p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400 group-hover:text-blue-600">
                    {berkas.icon}
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase">{berkas.label}</span>
                </div>
                <input type="file" className="hidden" onChange={(e) => handleChange(berkas.id, e.target.files?.[0])} />
                <div className={`text-[9px] px-2 py-1 rounded-md font-black ${data[berkas.id] ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {data[berkas.id] ? 'TERPILIH' : 'UPLOAD'}
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={handleUploadAndSubmit}
        disabled={isSubmitting}
        className="w-full py-5 bg-blue-900 text-white rounded-[1.5rem] font-black shadow-xl shadow-blue-200 flex items-center justify-center gap-3 group transition-all active:scale-95 disabled:opacity-50"
      >
        {isSubmitting ? <>MENGIRIM... <Loader2 size={20} className="animate-spin" /></> : "KIRIM PERMOHONAN KTP"}
        {!isSubmitting && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
      </button>
    </motion.div>
  );
};