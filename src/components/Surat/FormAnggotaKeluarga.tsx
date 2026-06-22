import { Trash2, PlusCircle, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FormAnggotaKeluarga = ({ data, setData }: any) => {
  const inputStyle = "w-full p-3 md:p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-slate-300 text-slate-700 text-sm";
  const labelStyle = "text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block";

  const addAnggota = () => {
    setData({
      ...data,
      anggota_keluarga: [
        ...(data.anggota_keluarga || []),
        {
          nama_lengkap: '',
          nik: '',
          jenis_kelamin: '',
          tempat_lahir: '',
          tanggal_lahir: '',
          agama: '',
          pendidikan: '',
          jenis_pekerjaan: '',
          status_perkawinan: '',
          status_hubungan: '',
          kewarganegaraan: 'WNI',
          no_paspor: '-',
          no_kitas: '-',
          nama_ayah: '',
          nama_ibu: ''
        }
      ]
    });
  };

  const removeAnggota = (index: number) => {
    const newAnggota = [...data.anggota_keluarga];
    newAnggota.splice(index, 1);
    setData({ ...data, anggota_keluarga: newAnggota });
  };

  const updateAnggota = (index: number, field: string, value: string) => {
    const newAnggota = [...data.anggota_keluarga];
    newAnggota[index][field] = value;
    setData({ ...data, anggota_keluarga: newAnggota });
  };

  return (
    <div className="mt-8 pt-8 border-t-2 border-dashed border-slate-200">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-2.5 bg-pink-100 text-pink-600 rounded-xl">
          <Users size={20} />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Data Anggota Keluarga</h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Masukkan data seluruh anggota keluarga secara berurutan dimulai dari Kepala Keluarga.</p>
        </div>
      </div>

      <div className="space-y-8">
        <AnimatePresence>
          {data.anggota_keluarga?.map((anggota: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-5 md:p-6 bg-slate-50 border border-slate-100 rounded-2xl relative shadow-sm"
            >
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white">
                {index + 1}
              </div>
              
              <button 
                type="button"
                onClick={() => removeAnggota(index)}
                className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Hapus Anggota"
              >
                <Trash2 size={18} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="md:col-span-2">
                  <label className={labelStyle}>Nama Lengkap</label>
                  <input type="text" value={anggota.nama_lengkap} onChange={(e) => updateAnggota(index, 'nama_lengkap', e.target.value.toUpperCase())} placeholder="NAMA LENGKAP" className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>NIK</label>
                  <input type="text" inputMode="numeric" maxLength={16} value={anggota.nik} onChange={(e) => { const val = e.target.value.replace(/\D/g, '').slice(0, 16); updateAnggota(index, 'nik', val); }} placeholder="16 DIGIT NIK" className={inputStyle} />
                </div>
                
                <div>
                  <label className={labelStyle}>Tempat Lahir</label>
                  <input type="text" value={anggota.tempat_lahir} onChange={(e) => updateAnggota(index, 'tempat_lahir', e.target.value.toUpperCase())} placeholder="KOTA/KAB" className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Tanggal Lahir</label>
                  <input type="text" value={anggota.tanggal_lahir} onChange={(e) => updateAnggota(index, 'tanggal_lahir', e.target.value)} placeholder="DD-MM-YYYY" className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Jenis Kelamin</label>
                  <select value={anggota.jenis_kelamin} onChange={(e) => updateAnggota(index, 'jenis_kelamin', e.target.value)} className={inputStyle}>
                    <option value="">Pilih...</option>
                    <option value="LAKI-LAKI">LAKI-LAKI</option>
                    <option value="PEREMPUAN">PEREMPUAN</option>
                  </select>
                </div>

                <div>
                  <label className={labelStyle}>Agama</label>
                  <select value={anggota.agama} onChange={(e) => updateAnggota(index, 'agama', e.target.value.toUpperCase())} className={inputStyle}>
                    <option value="">Pilih...</option>
                    <option value="ISLAM">ISLAM</option>
                    <option value="KRISTEN">KRISTEN</option>
                    <option value="KATHOLIK">KATHOLIK</option>
                    <option value="HINDU">HINDU</option>
                    <option value="BUDDHA">BUDDHA</option>
                    <option value="KONGHUCU">KONGHUCU</option>
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Pendidikan</label>
                  <input type="text" value={anggota.pendidikan} onChange={(e) => updateAnggota(index, 'pendidikan', e.target.value.toUpperCase())} placeholder="Cth: SLTA/SEDERAJAT" className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Jenis Pekerjaan</label>
                  <input type="text" value={anggota.jenis_pekerjaan} onChange={(e) => updateAnggota(index, 'jenis_pekerjaan', e.target.value.toUpperCase())} placeholder="Cth: PETANI/PEKEBUN" className={inputStyle} />
                </div>

                <div>
                  <label className={labelStyle}>Status Perkawinan</label>
                  <select value={anggota.status_perkawinan} onChange={(e) => updateAnggota(index, 'status_perkawinan', e.target.value.toUpperCase())} className={inputStyle}>
                    <option value="">Pilih...</option>
                    <option value="BELUM KAWIN">BELUM KAWIN</option>
                    <option value="KAWIN">KAWIN</option>
                    <option value="CERAI HIDUP">CERAI HIDUP</option>
                    <option value="CERAI MATI">CERAI MATI</option>
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Hubungan Keluarga</label>
                  <select value={anggota.status_hubungan} onChange={(e) => updateAnggota(index, 'status_hubungan', e.target.value.toUpperCase())} className={inputStyle}>
                    <option value="">Pilih...</option>
                    <option value="KEPALA KELUARGA">KEPALA KELUARGA</option>
                    <option value="ISTRI">ISTRI</option>
                    <option value="ANAK">ANAK</option>
                    <option value="FAMILI LAIN">FAMILI LAIN</option>
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Kewarganegaraan</label>
                  <input type="text" value={anggota.kewarganegaraan} onChange={(e) => updateAnggota(index, 'kewarganegaraan', e.target.value.toUpperCase())} placeholder="WNI/WNA" className={inputStyle} />
                </div>

                <div>
                  <label className={labelStyle}>No. Paspor / KITAS</label>
                  <input type="text" value={anggota.no_paspor} onChange={(e) => updateAnggota(index, 'no_paspor', e.target.value.toUpperCase())} placeholder="-" className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Nama Ayah</label>
                  <input type="text" value={anggota.nama_ayah} onChange={(e) => updateAnggota(index, 'nama_ayah', e.target.value.toUpperCase())} placeholder="NAMA AYAH" className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Nama Ibu</label>
                  <input type="text" value={anggota.nama_ibu} onChange={(e) => updateAnggota(index, 'nama_ibu', e.target.value.toUpperCase())} placeholder="NAMA IBU" className={inputStyle} />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <button
          type="button"
          onClick={addAnggota}
          className="w-full py-4 bg-white border-2 border-dashed border-blue-200 text-blue-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all active:scale-[0.98]"
        >
          <PlusCircle size={18} />
          Tambah Anggota Keluarga
        </button>
      </div>
    </div>
  );
};
