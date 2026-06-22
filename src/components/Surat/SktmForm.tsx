import { useState } from 'react';
import { motion } from 'framer-motion';

export const SktmForm = ({ onNext, setData }: { onNext: () => void, setData: (data: any) => void }) => {
  const [formData, setLocalFormData] = useState({
    nik: '',
    nama: '',
    ttl: '',
    pekerjaan: '',
    agama: '',
    kewarganegaraan: 'WNI',
    alamat: '',
    keterangan: '',
    keperluan: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Data yang dikirim ke state utama (disinkronkan dengan skema DB Supabase)
    setData((prev: any) => ({
      ...prev,
      nik: formData.nik,
      nama: formData.nama,
      jenis_surat: 'SKTM', 
      ttl: formData.ttl,
      pekerjaan: formData.pekerjaan,
      agama: formData.agama,
      kewarganegaraan: formData.kewarganegaraan,
      alamat: formData.alamat,
      // 'keterangan' disimpan ke 'keterangan_lain' agar sinkron dengan AdminDashboard.tsx
      keterangan_lain: formData.keterangan, 
      keperluan: formData.keperluan,
    }));

    onNext();
  };

  const inputClass = "w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-900 transition-all font-medium text-slate-700 placeholder:text-slate-400";
  const labelClass = "text-[10px] font-black text-blue-900/40 uppercase tracking-[0.2em] ml-1 block mb-2";

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-10 bg-white rounded-[40px] shadow-2xl shadow-blue-900/5 border border-slate-50 font-sans">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-blue-900 tracking-tighter uppercase">Pengajuan SKTM</h2>
        <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mt-1">Surat Keterangan Tidak Mampu</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* IDENTITAS */}
        <div>
          <label className={labelClass}>Informasi Identitas</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              inputMode="numeric"
              maxLength={16}
              placeholder="NIK (16 Digit)"
              className={inputClass}
              value={formData.nik}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                setLocalFormData({...formData, nik: val});
              }}
              required
            />
            <input
              type="text"
              placeholder="Nama Lengkap"
              className={inputClass}
              value={formData.nama}
              onChange={(e) => setLocalFormData({...formData, nama: e.target.value.toUpperCase()})}
              required
            />
            <input
              type="text"
              placeholder="Tempat, Tgl Lahir (Contoh: Tegal, 01-01-1990)"
              className={`${inputClass} md:col-span-2`}
              value={formData.ttl}
              onChange={(e) => setLocalFormData({...formData, ttl: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Pekerjaan"
              className={inputClass}
              value={formData.pekerjaan}
              onChange={(e) => setLocalFormData({...formData, pekerjaan: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Agama"
              className={inputClass}
              value={formData.agama}
              onChange={(e) => setLocalFormData({...formData, agama: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Kewarganegaraan"
              className={inputClass}
              value={formData.kewarganegaraan}
              onChange={(e) => setLocalFormData({...formData, kewarganegaraan: e.target.value})}
              required
            />
            <textarea
              placeholder="Alamat Lengkap Sesuai KTP"
              className={`${inputClass} md:col-span-2 min-h-[90px] resize-none`}
              value={formData.alamat}
              onChange={(e) => setLocalFormData({...formData, alamat: e.target.value})}
              required
            />
          </div>
        </div>

        {/* KETERANGAN & KEPERLUAN */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <label className={labelClass}>Keterangan & Keperluan</label>
          <textarea
            placeholder="Keterangan tambahan (e.g. Penduduk tidak mampu)"
            className={`${inputClass} min-h-[100px] resize-none`}
            value={formData.keterangan}
            onChange={(e) => setLocalFormData({...formData, keterangan: e.target.value})}
            required
          />
          <textarea
            placeholder="Keperluan (e.g. Pengajuan Bantuan Sosial)"
            className={`${inputClass} min-h-[90px] resize-none`}
            value={formData.keperluan}
            onChange={(e) => setLocalFormData({...formData, keperluan: e.target.value})}
            required
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-5 bg-blue-900 text-white rounded-[20px] font-bold shadow-xl shadow-blue-900/20 hover:bg-blue-800 transition-all uppercase tracking-widest text-sm"
        >
          Lanjutkan ke Upload Berkas
        </motion.button>
      </form>
    </div>
  );
};