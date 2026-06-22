import { useState } from 'react';

export const SkuForm = ({ onNext, setData }: { onNext: () => void, setData: (data: any) => void }) => {
  const [formData, setLocalFormData] = useState({
    nama: '',
    nik: '',
    ttl: '',
    pekerjaan: '',
    alamat: '',
    usaha: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Menyimpan data ke state global
    setData((prev: any) => ({
      ...prev,
      nama: formData.nama,
      nik: formData.nik,
      ttl: formData.ttl,
      pekerjaan: formData.pekerjaan,
      alamat: formData.alamat,
      nama_usaha: formData.usaha,
      jenis_surat: 'SKU',
      keperluan: `Usaha: ${formData.usaha}, Alamat: ${formData.alamat}`,
      
      // PENTING: Reset field yang tidak digunakan di SKU agar tidak ada data sisa
      agama: null,
      kewarganegaraan: null,
      keterangan_lain: null,
      status_kawin: null,
      jenis_kelamin: null,
      golongan_darah: null,
      pendidikan: null
    }));

    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input 
          type="text" 
          placeholder="Nama Lengkap (Sesuai KTP)" 
          className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-slate-700"
          value={formData.nama}
          onChange={(e) => setLocalFormData({...formData, nama: e.target.value})} 
          required 
        />
        <input 
          type="text" 
          inputMode="numeric"
          maxLength={16}
          placeholder="NIK (16 Digit)" 
          className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-slate-700"
          value={formData.nik}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '').slice(0, 16);
            setLocalFormData({...formData, nik: val});
          }} 
          required 
        />
        <input 
          type="text" 
          placeholder="Tempat, Tanggal Lahir" 
          className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-slate-700"
          value={formData.ttl}
          onChange={(e) => setLocalFormData({...formData, ttl: e.target.value})} 
          required 
        />
        <input 
          type="text" 
          placeholder="Pekerjaan" 
          className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-slate-700"
          value={formData.pekerjaan}
          onChange={(e) => setLocalFormData({...formData, pekerjaan: e.target.value})} 
          required 
        />
      </div>

      <input 
        type="text" 
        placeholder="Kegiatan Usaha (Contoh: PETERNAK SAPI)" 
        className="w-full p-4 bg-blue-50/50 border border-blue-100 rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all font-bold text-blue-700 placeholder:text-blue-500"
        value={formData.usaha}
        onChange={(e) => setLocalFormData({...formData, usaha: e.target.value})} 
        required 
      />

      <textarea 
        placeholder="Alamat Lengkap (Sesuai KTP)" 
        className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 min-h-[100px] transition-all font-medium text-slate-700"
        value={formData.alamat}
        onChange={(e) => setLocalFormData({...formData, alamat: e.target.value})} 
        required 
      />

      <button 
        type="submit" 
        className="w-full py-4 bg-[#0F172A] text-white rounded-2xl font-black hover:bg-blue-600 transition-all shadow-lg active:scale-[0.98] uppercase tracking-widest text-xs"
      >
        Lanjutkan ke Upload Berkas
      </button>
    </form>
  );
};