import { motion } from 'framer-motion';
import { Upload, ArrowLeft, Send, Loader2, FileCheck } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export const StepUploadBerkas = ({ onNext, onPrev, data, setData }: any) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files[0]) {
      setData({ ...data, [field]: e.target.files[0] });
    }
  };

  const handleUploadAndSubmit = async () => {
    if (!data.berkasKtp || !data.berkasKk) {
      alert("Harap unggah minimal KTP & KK terlebih dahulu.");
      return;
    }

    setIsUploading(true);

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
        uploadFile(data.berkasKtp, 'ktp'),
        uploadFile(data.berkasKk, 'kk')
      ]);

      const pathRT = data.berkasRT ? await uploadFile(data.berkasRT, 'surat_rt') : null;
      const pathSampah = data.berkasSampah ? await uploadFile(data.berkasSampah, 'kartu_sampah') : null;
      const pathSertifikat = data.berkasSertifikat ? await uploadFile(data.berkasSertifikat, 'sertifikat_tanah') : null;

      const { error: dbErr } = await supabase
        .from('pengajuan_surat') 
        .insert([{
          nama: data.nama,
          nik: data.nik,
          jenis_surat: data.jenisSurat || data.jenis_surat,
          alamat: data.alamat,
          ttl: data.ttl || null,
          agama: data.agama || null,
          pekerjaan: data.pekerjaan || null,
          pendidikan: data.pendidikan || null,
          status_kawin: data.status_kawin || null,
          jenis_kelamin: data.jenis_kelamin || null,
          golongan_darah: data.golongan_darah || null,
          kewarganegaraan: data.kewarganegaraan || null, 
          keterangan_lain: ((data.jenisSurat || data.jenis_surat)?.toUpperCase() === 'KK') ? JSON.stringify({ anggota_keluarga: data.anggota_keluarga || [] }) : (data.keterangan_lain || null),
          keperluan: data.keperluan || null,
          nama_usaha: data.nama_usaha || data.usaha || null,
          
          // SKTM Anak Fields
          nama_anak: data.nama_anak || null,
          nik_anak: data.nik_anak || null,
          ttl_anak: data.ttl_anak || null,
          jk_anak: data.jk_anak || null,
          agama_anak: data.agama_anak || null,
          alamat_anak: data.alamat_anak || null,

          // SKT Fields
          no_sertifikat: data.no_sertifikat || null,
          no_shm: data.no_shm || null,
          no_nib: data.no_nib || null,
          luas_tanah: data.luas_tanah || null,
          alamat_tanah: data.alamat_tanah || null,
          kepemilikan: data.kepemilikan || null,
          keterangan_tanah: data.keterangan_tanah || null,

          // Berkas
          url_ktp: pathKtp,
          url_kk: pathKk,
          url_surat_rt: pathRT,
          url_kartu_sampah: pathSampah,
          url_sertifikat: pathSertifikat,
          status: 'pending'
        }]);

      if (dbErr) throw dbErr;

      setData({ 
        ...data, 
        url_ktp: pathKtp, 
        url_kk: pathKk,
        url_surat_rt: pathRT,
        url_kartu_sampah: pathSampah,
        url_sertifikat: pathSertifikat
      });

      onNext(); 

    } catch (error: any) {
      console.error("Error Detail:", error);
      alert(`Terjadi kesalahan: ${error.message || "Gagal mengirim data"}`);
    } finally {
      setIsUploading(false);
    }
  };

  const UploadBox = ({ field, label, fileData }: any) => (
    <label className={`border-2 border-dashed p-6 rounded-[2rem] text-center transition-all cursor-pointer group block ${fileData ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'}`}>
      {fileData ? (
        <FileCheck className="mx-auto mb-2 text-emerald-600" size={24} />
      ) : (
        <Upload className="mx-auto mb-2 text-slate-400 group-hover:text-blue-600" size={24} />
      )}
      <p className="text-[11px] font-black text-slate-700 uppercase tracking-tighter">{label}</p>
      <p className="text-[9px] text-slate-400 mt-1 truncate px-2">
        {fileData ? fileData.name : "Klik untuk pilih file"}
      </p>
      <input type="file" className="hidden" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, field)} />
    </label>
  );

  return (
    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
      <div className="text-sm font-black text-slate-800 uppercase tracking-widest border-l-4 border-blue-600 pl-3">
        Upload Dokumen Pendukung
      </div>
      <div className="grid grid-cols-2 gap-4">
        <UploadBox field="berkasKtp" label="Foto KTP" fileData={data.berkasKtp} />
        <UploadBox field="berkasKk" label="Foto KK" fileData={data.berkasKk} />
        <UploadBox field="berkasRT" label="Surat Pengantar RT" fileData={data.berkasRT} />
        <UploadBox field="berkasSampah" label="Kartu Sampah" fileData={data.berkasSampah} />
      </div>

      {data.jenisSurat === 'SKT' && (
        <>
          <div className="mt-8 text-sm font-black text-slate-800 uppercase tracking-widest border-l-4 border-blue-600 pl-3">
            Dokumen Sertifikat Tanah
          </div>
          <div className="grid grid-cols-1 gap-4">
            <UploadBox field="berkasSertifikat" label="Sertifikat Tanah / Dokumen Kepemilikan" fileData={data.berkasSertifikat} />
          </div>
        </>
      )}

      <div className="flex gap-3 pt-4">
        <button onClick={onPrev} disabled={isUploading} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all disabled:opacity-50">
          <ArrowLeft size={18} /> Kembali
        </button>
        <button onClick={handleUploadAndSubmit} disabled={isUploading} className="flex-[2] py-4 bg-blue-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-all shadow-lg shadow-blue-100 disabled:bg-blue-400">
          {isUploading ? <>Memproses... <Loader2 size={18} className="animate-spin" /></> : <>Kirim Permohonan <Send size={18} /></>}
        </button>
      </div>
    </motion.div>
  );
};