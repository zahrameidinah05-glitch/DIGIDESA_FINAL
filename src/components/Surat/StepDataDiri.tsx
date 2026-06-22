import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, User, Briefcase, CalendarDays, Heart, GraduationCap, Droplets, Users, FileText, Globe, MessageSquare } from 'lucide-react';
import { FormAnggotaKeluarga } from './FormAnggotaKeluarga';

export const StepDataDiri = ({ onNext, data, setData }: any) => {
  
  const inputStyle = "w-full p-4 md:p-5 bg-slate-50 border border-transparent rounded-[1.5rem] focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium shadow-inner";
  const labelStyle = "text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] ml-2 flex items-center gap-2";

  // Cek Jenis Surat
  const isSKU = data.jenisSurat?.toUpperCase() === 'SKU' || data.jenis_surat?.toUpperCase() === 'SKU';
  const isKTP = data.jenisSurat?.toUpperCase() === 'KTP' || data.jenis_surat?.toUpperCase() === 'KTP';
  const isSKCK = data.jenisSurat?.toUpperCase() === 'SKCK';
  const isSKTMUmum = data.jenisSurat?.toUpperCase() === 'SKTM';
  const isSKTMSekolah = data.jenisSurat?.toUpperCase() === 'SKTM_SEKOLAH';
  const isSKT = data.jenisSurat?.toUpperCase() === 'SKT' || data.jenis_surat?.toUpperCase() === 'SKT';
  const isKK = data.jenisSurat?.toUpperCase() === 'KK' || data.jenis_surat?.toUpperCase() === 'KK';

  return (
    <motion.div 
      initial={{ x: 20, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }} 
      exit={{ x: -20, opacity: 0 }} 
      className="space-y-8"
    >
      <div className="bg-blue-50/50 p-4 rounded-2xl text-blue-700 text-[11px] font-bold border border-blue-100 flex items-center gap-3">
        <div className="bg-blue-600 text-white p-1 rounded-md">
          <User size={14} />
        </div>
        <span className="uppercase tracking-wider">Langkah 1: Lengkapi Data Identitas Pemohon</span>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 text-left">
            <label className={labelStyle}>Nama Lengkap Sesuai KTP</label>
            <input 
              type="text" 
              value={data.nama || ''}
              onChange={(e) => setData({...data, nama: e.target.value.toUpperCase()})}
              placeholder="NAMA LENGKAP" 
              className={inputStyle} 
            />
          </div>
          <div className="space-y-2 text-left">
            <label className={labelStyle}>Nomor Induk Kependudukan (NIK)</label>
            <input 
              type="text" 
              inputMode="numeric"
              maxLength={16}
              value={data.nik || ''}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                setData({...data, nik: val});
              }}
              placeholder="16 DIGIT NIK" 
              className={inputStyle} 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 text-left">
            <label className={labelStyle}><CalendarDays size={12} className="text-blue-500" /> Tempat, Tanggal Lahir</label>
            <input type="text" value={data.ttl || ''} onChange={(e) => setData({...data, ttl: e.target.value})} placeholder="Tegal, 10-02-2005" className={inputStyle} />
          </div>
          <div className="space-y-2 text-left">
            <label className={labelStyle}><Briefcase size={12} className="text-blue-500" /> Pekerjaan</label>
            <input type="text" value={data.pekerjaan || ''} onChange={(e) => setData({...data, pekerjaan: e.target.value})} placeholder="Contoh: Wiraswasta" className={inputStyle} />
          </div>
          
          {/* HANYA MUNCUL JIKA BUKAN SKU */}
          {!isSKU && (
            <>
              <div className="space-y-2 text-left">
                <label className={labelStyle}><Users size={12} className="text-blue-500" /> Jenis Kelamin</label>
                <select className={inputStyle} value={data.jenis_kelamin || ''} onChange={(e) => setData({...data, jenis_kelamin: e.target.value})}>
                  <option value="">Pilih...</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div className="space-y-2 text-left">
                <label className={labelStyle}><Heart size={12} className="text-blue-500" /> Agama</label>
                <input type="text" value={data.agama || ''} onChange={(e) => setData({...data, agama: e.target.value})} placeholder="Contoh: Islam" className={inputStyle} />
              </div>
              <div className="space-y-2 text-left">
                <label className={labelStyle}><Globe size={12} className="text-blue-500" /> Kewarganegaraan</label>
                <input type="text" value={data.kewarganegaraan || ''} onChange={(e) => setData({...data, kewarganegaraan: e.target.value})} placeholder="Contoh: WNI" className={inputStyle} />
              </div>
            </>
          )}
        </div>

        <AnimatePresence mode="wait">
          {(isSKU || isKTP || isSKCK || isSKTMUmum || isSKTMSekolah || isSKT) && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isSKU && (
                  <div className="space-y-2 text-left md:col-span-2">
                    <label className={labelStyle}><Briefcase size={12} className="text-blue-500" /> Kegiatan Usaha</label>
                    <input 
                      type="text" 
                      value={data.usaha || ''} 
                      onChange={(e) => setData({...data, usaha: e.target.value.toUpperCase()})} 
                      placeholder="Contoh: PETERNAK SAPI" 
                      className={inputStyle} 
                    />
                  </div>
                )}

                {isSKCK && (
                  <>
                    <div className="space-y-2 text-left md:col-span-2">
                      <label className={labelStyle}><FileText size={12} className="text-blue-500" /> Keperluan SKCK</label>
                      <input type="text" value={data.keperluan || ''} onChange={(e) => setData({...data, keperluan: e.target.value})} placeholder="Contoh: Melamar Pekerjaan" className={inputStyle} />
                    </div>
                    <div className="space-y-2 text-left md:col-span-2">
                      <label className={labelStyle}><MessageSquare size={12} className="text-blue-500" /> Keterangan Lain</label>
                      <textarea
                        value={data.keterangan_lain || ''}
                        onChange={(e) => setData({...data, keterangan_lain: e.target.value})}
                        placeholder="Contoh: Bahwa orang tersebut di atas adalah benar – benar penduduk kami yang tidak tersangkut masalah hukum."
                        className={`${inputStyle} min-h-[100px] resize-none`}
                      />
                    </div>
                  </>
                )}

                {isSKTMUmum && (
                    <div className="space-y-2 text-left md:col-span-2">
                      <label className={labelStyle}><FileText size={12} className="text-blue-500" /> Keperluan SKTM (Umum)</label>
                      <input
                        type="text"
                        value={data.keperluan || ''}
                        onChange={(e) => setData({...data, keperluan: e.target.value})}
                        placeholder="Contoh: Pengajuan Bantuan Sosial / Berobat"
                        className={inputStyle}
                      />
                    </div>
                )}

                {isSKTMSekolah && (
                  <>
                    <div className="space-y-2 text-left md:col-span-2 mt-2">
                      <div className="bg-blue-100/50 p-2 rounded text-blue-800 font-bold text-xs uppercase text-center border border-blue-200">
                        DATA ANAK (Yang Diberi SKTM Sekolah)
                      </div>
                    </div>
                    <div className="space-y-2 text-left">
                      <label className={labelStyle}>Nama Anak</label>
                      <input type="text" value={data.nama_anak || ''} onChange={(e) => setData({...data, nama_anak: e.target.value.toUpperCase()})} placeholder="NAMA ANAK" className={inputStyle} />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className={labelStyle}>NIK Anak</label>
                      <input type="text" inputMode="numeric" maxLength={16} value={data.nik_anak || ''} onChange={(e) => { const val = e.target.value.replace(/\D/g, '').slice(0, 16); setData({...data, nik_anak: val}); }} placeholder="16 DIGIT NIK ANAK" className={inputStyle} />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className={labelStyle}>Tempat, Tgl Lahir Anak</label>
                      <input type="text" value={data.ttl_anak || ''} onChange={(e) => setData({...data, ttl_anak: e.target.value})} placeholder="Contoh: Tegal, 01-01-2015" className={inputStyle} />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className={labelStyle}>Jenis Kelamin Anak</label>
                      <select className={inputStyle} value={data.jk_anak || ''} onChange={(e) => setData({...data, jk_anak: e.target.value})}>
                        <option value="">Pilih...</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>
                    <div className="space-y-2 text-left">
                      <label className={labelStyle}>Agama Anak</label>
                      <input type="text" value={data.agama_anak || ''} onChange={(e) => setData({...data, agama_anak: e.target.value})} placeholder="Contoh: Islam" className={inputStyle} />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className={labelStyle}>Alamat Anak</label>
                      <textarea value={data.alamat_anak || ''} onChange={(e) => setData({...data, alamat_anak: e.target.value})} placeholder="Alamat Lengkap Anak" className={`${inputStyle} min-h-[50px] resize-none`} />
                    </div>
                    <div className="space-y-2 text-left md:col-span-2">
                      <div className="bg-blue-100/50 p-2 rounded text-blue-800 font-bold text-xs uppercase text-center border border-blue-200 mt-2 mb-2">
                        DATA ORANG TUA (Pemohon)
                      </div>
                      <p className="text-xs text-slate-500 mb-2 italic px-2">Pastikan Identitas Diri (Langkah 1) sudah diisi karena akan digunakan sebagai Data Orang Tua.</p>
                      <label className={labelStyle}><FileText size={12} className="text-blue-500" /> Keperluan SKTM Sekolah</label>
                      <input
                        type="text"
                        value={data.keperluan || ''}
                        onChange={(e) => setData({...data, keperluan: e.target.value})}
                        placeholder="Contoh: Bantuan Seragam Sekolah"
                        className={inputStyle}
                      />
                    </div>
                  </>
                )}

                {isKTP && (
                  <>
                    {/* Jenis Kelamin sudah dipindah ke atas */}
                    <div className="space-y-2 text-left">
                      <label className={labelStyle}><Droplets size={12} className="text-blue-500" /> Golongan Darah</label>
                      <input type="text" value={data.golongan_darah || ''} onChange={(e) => setData({...data, golongan_darah: e.target.value})} placeholder="-" className={inputStyle} />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className={labelStyle}><GraduationCap size={12} className="text-blue-500" /> Pendidikan</label>
                      <input type="text" value={data.pendidikan || ''} onChange={(e) => setData({...data, pendidikan: e.target.value})} placeholder="Tamat SD/Sederajat" className={inputStyle} />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className={labelStyle}>Status Perkawinan</label>
                      <select className={inputStyle} value={data.status_kawin || ''} onChange={(e) => setData({...data, status_kawin: e.target.value})}>
                        <option value="Belum Kawin">Belum Kawin</option>
                        <option value="Kawin">Kawin</option>
                        <option value="Cerai Hidup">Cerai Hidup</option>
                        <option value="Cerai Mati">Cerai Mati</option>
                      </select>
                    </div>
                  </>
                )}
                
                {isSKT && (
                <>
                  <div className="space-y-2 text-left md:col-span-2">
                    <label className={labelStyle}><FileText size={12} className="text-blue-500" /> No. Sertifikat</label>
                    <input type="text" value={data.no_sertifikat || ''} onChange={(e) => setData({...data, no_sertifikat: e.target.value.toUpperCase()})} placeholder="Contoh: SHM 01709" className={inputStyle} />
                  </div>
                  <div className="space-y-2 text-left md:col-span-2">
                    <label className={labelStyle}><FileText size={12} className="text-blue-500" /> No. SHM</label>
                    <input type="text" value={data.no_shm || ''} onChange={(e) => setData({...data, no_shm: e.target.value})} placeholder="Contoh: SU 1267/2006" className={inputStyle} />
                  </div>
                  <div className="space-y-2 text-left md:col-span-2">
                    <label className={labelStyle}><FileText size={12} className="text-blue-500" /> No. NIB</label>
                    <input type="text" value={data.no_nib || ''} onChange={(e) => setData({...data, no_nib: e.target.value})} placeholder="Contoh: 11350414.01591" className={inputStyle} />
                  </div>
                  <div className="space-y-2 text-left md:col-span-2">
                    <label className={labelStyle}>Luas Tanah (m²)</label>
                    <input type="text" value={data.luas_tanah || ''} onChange={(e) => setData({...data, luas_tanah: e.target.value})} placeholder="Contoh: 500" className={inputStyle} />
                  </div>
                  <div className="space-y-2 text-left md:col-span-2">
                    <label className={labelStyle}>Alamat Tanah</label>
                    <textarea value={data.alamat_tanah || ''} onChange={(e) => setData({...data, alamat_tanah: e.target.value})} placeholder="Contoh: Banjaranyar RT 001 RW 002, Kec. Balapulang" className={`${inputStyle} min-h-[100px] resize-none`} />
                  </div>
                  <div className="space-y-2 text-left md:col-span-2">
                    <label className={labelStyle}>Status Kepemilikan</label>
                    <select className={inputStyle} value={data.kepemilikan || ''} onChange={(e) => setData({...data, kepemilikan: e.target.value})}>
                      <option value="">Pilih...</option>
                      <option value="Milik Pribadi">Milik Pribadi</option>
                      <option value="Milik Keluarga">Milik Keluarga</option>
                      <option value="Warisan">Warisan</option>
                      <option value="Amanah">Amanah</option>
                    </select>
                  </div>
                  <div className="space-y-2 text-left md:col-span-2">
                    <label className={labelStyle}>Keterangan Tanah</label>
                    <textarea value={data.keterangan_tanah || ''} onChange={(e) => setData({...data, keterangan_tanah: e.target.value})} placeholder="Contoh: Tanah bebas dari sengketa" className={`${inputStyle} min-h-[100px] resize-none`} />
                  </div>
                </>
              )}  
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {isKK && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <FormAnggotaKeluarga data={data} setData={setData} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2 text-left">
          <label className={labelStyle}>Alamat Domisili (Sesuai KTP)</label>
          <textarea 
            value={data.alamat || ''}
            onChange={(e) => setData({...data, alamat: e.target.value})}
            placeholder="Contoh: Banjaranyar RT 005/ RW 002" 
            className={`${inputStyle} min-h-[100px] resize-none`} 
          />
        </div>
      </div>

      <button 
        onClick={onNext} 
        disabled={!data.nama || !data.nik}
        className="w-full py-5 bg-blue-900 text-white rounded-[1.8rem] font-bold flex items-center justify-center gap-3 hover:bg-blue-800 transition-all shadow-xl disabled:bg-slate-200 group"
      >
        Lanjut Upload Berkas <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </button>

      <p className="text-center text-[10px] text-slate-400 font-medium italic">
        *Pastikan data yang Anda masukkan sudah benar sesuai dokumen asli.
      </p>
    </motion.div>
  );
};