import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, FileUp, CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import { StepDataDiri } from './StepDataDiri';
import { StepUploadBerkas } from './StepUploadBerkas';
import { StepSelesai } from './StepSelesai';
import { SpKtpForm } from './SpKtpForm';

const PengajuanSurat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [judulSurat, setJudulSurat] = useState("Surat Keterangan");
  
  const [formData, setFormData] = useState({
    nama: '', 
    nik: '', 
    alamat: '', 
    ttl: '', 
    pekerjaan: '', 
    agama: '', 
    kewarganegaraan: '', 
    keperluan: '', 
    keterangan: '', 
    jenis_kelamin: '',
    golongan_darah: '',
    pendidikan: '',
    status_kawin: '',
    permohonan_ktp: '', 
    berkasKtp: null, 
    berkasKk: null,
    fc_ktp: null, 
    fc_kk: null, 
    fc_sampah: null, 
    sp_rt: null,
    no_sertifikat: '',
    no_shm: '',
    no_nib: '',
    luas_tanah: '',
    alamat_tanah: '',
    kepemilikan: '',
    keterangan_tanah: '',
    berkasSertifikat: null,
    anggota_keluarga: [],
    jenisSurat: '' 
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const jenis = params.get('jenis') || 'umum';
    
    const jenisUpper = jenis.toUpperCase();
    setFormData(prev => ({ ...prev, jenisSurat: jenisUpper }));

    if (jenis === 'sku') setJudulSurat("Surat Keterangan Usaha (SKU)");
    else if (jenis === 'sktm') setJudulSurat("Surat Keterangan Tidak Mampu (SKTM Umum)");
    else if (jenis === 'sktm_sekolah') setJudulSurat("Surat Keterangan Tidak Mampu (Sekolah)");
    else if (jenis === 'ktp') setJudulSurat("Surat Pengantar KTP");
    else if (jenis === 'umum') setJudulSurat("Surat Keterangan Domisili / Umum");
    else if (jenis === 'skck') setJudulSurat("Surat Keterangan Catatan Kepolisian (SKCK)");
    else if (jenis === 'anak') setJudulSurat("Surat Urutan Anak / Akta Kelahiran");
    else if (jenis === 'pindah') setJudulSurat("Surat Keterangan Pindah Domisili");
    else if (jenis === 'skt') setJudulSurat("Surat Keterangan Tanah");
    else if (jenis === 'kk') setJudulSurat("Pembuatan Kartu Keluarga Baru");
    else setJudulSurat("Pengajuan Surat Online");
  }, [location]);

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  return (
    <div className="min-h-screen bg-slate-50 py-6 md:py-10 px-3 md:px-4 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-2xl bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Header Section */}
        <div className="p-5 md:p-8 border-b border-slate-50 bg-white text-center">
            <div className="mb-2 text-[8px] md:text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">
              Layanan Mandiri Online
            </div>
            <h2 className="text-lg md:text-xl font-extrabold text-slate-800 mb-6 md:mb-10 uppercase tracking-tight px-2">
              FORM PENGAJUAN: <span className="text-blue-700 block sm:inline">{judulSurat}</span>
            </h2>
            
            {/* Stepper */}
            <div className="flex justify-between relative px-2 md:px-10">
               <div className="absolute top-4 md:top-5 left-10 right-10 h-[2px] md:h-[3px] bg-slate-100 -z-0" />
               <motion.div 
                 className="absolute top-4 md:top-5 left-10 h-[2px] md:h-[3px] bg-blue-600 -z-0"
                 initial={{ width: "0%" }}
                 animate={{ width: step === 1 ? "0%" : step === 2 ? "45%" : "85%" }}
                 transition={{ duration: 0.5 }}
               />

               {[
                 { id: 1, icon: <User size={16} />, label: "Data" },
                 { id: 2, icon: <FileUp size={16} />, label: "Berkas" },
                 { id: 3, icon: <CheckCircle size={16} />, label: "Selesai" }
               ].map((item) => (
                 <div key={item.id} className="relative z-10 flex flex-col items-center gap-2">
                   <div className={`w-8 h-8 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all duration-500 border-2 md:border-4 ${
                     step >= item.id ? 'bg-blue-600 text-white border-blue-100 shadow-lg' : 'bg-white text-slate-300 border-slate-50'
                   }`}>
                     {item.id < step ? <CheckCircle size={16} /> : item.icon}
                   </div>
                   <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-wider ${
                     step >= item.id ? 'text-blue-700' : 'text-slate-400'
                   }`}>
                     {item.label}
                   </span>
                 </div>
               ))}
            </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-12 bg-[#fcfdfe]">
          <div className="mb-6 p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3 text-amber-700 text-xs md:text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>Pastikan data yang dimasukkan sesuai dengan dokumen asli untuk mempercepat proses verifikasi.</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && <StepDataDiri onNext={nextStep} data={formData} setData={setFormData} />}
              
              {step === 2 && (
                formData.jenisSurat === 'KTP' ? (
                  <SpKtpForm onNext={nextStep} data={formData} setData={setFormData} />
                ) : (
                  <StepUploadBerkas onNext={nextStep} onPrev={prevStep} data={formData} setData={setFormData} />
                )
              )}

              {step === 3 && <StepSelesai formData={formData} />}
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 pt-6 border-t border-slate-100">
            <button 
              onClick={() => navigate('/')}
              className="w-full py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center gap-2 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Batalkan & Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PengajuanSurat;