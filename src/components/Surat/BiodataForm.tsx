export const BiodataForm = ({ onChange }: { onChange: (data: any) => void }) => {
  return (
    <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
      <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
        <span className="p-2 bg-blue-900 text-white rounded-lg text-xs">1</span>
        Informasi Pemohon
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        <input 
          type="text" inputMode="numeric" maxLength={16} placeholder="NIK (16 Digit)" 
          className="p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 outline-none transition-all"
          onChange={(e) => { const val = e.target.value.replace(/\D/g, '').slice(0, 16); onChange({ nik: val }); }}
        />
        <input 
          type="text" placeholder="Nama Lengkap Sesuai KTP" 
          className="p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 outline-none transition-all"
          onChange={(e) => onChange({ nama: e.target.value })}
        />
        <input 
          type="text" placeholder="Tempat, Tanggal Lahir" 
          className="p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 outline-none transition-all"
          onChange={(e) => onChange({ ttl: e.target.value })}
        />
        <textarea 
          placeholder="Alamat Lengkap di Banjaranyar" 
          className="p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 outline-none transition-all md:col-span-2"
          onChange={(e) => onChange({ alamat: e.target.value })}
        />
      </div>
    </div>
  );
};