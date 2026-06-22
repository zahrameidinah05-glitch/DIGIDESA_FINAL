import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Lokasi = () => {
  return (
    // ID lokasi dengan scroll-margin agar tidak tertutup Navbar
    <section id="lokasi" className="py-24 bg-white px-6 scroll-mt-28">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Kolom Informasi Kontak */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-4 py-1.5 mb-6 bg-blue-50 rounded-full border border-blue-100">
            <span className="text-[10px] font-black text-blue-700 uppercase tracking-[0.2em]">Hubungi Kami</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-8 text-blue-900 tracking-tighter">Kontak & Lokasi</h2>
          
          <div className="space-y-6">
            {/* Alamat */}
            <div className="flex gap-5 p-7 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-blue-50/50 transition-colors duration-300">
              <div className="p-4 bg-white rounded-2xl text-blue-900 shadow-sm flex-shrink-0 h-fit">
                <MapPin size={24} />
              </div>
              <div>
                <p className="font-bold text-slate-900 uppercase text-[10px] tracking-widest mb-2 opacity-50">Alamat Kantor</p>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Jl. Raya Balapulang No. 1, Kec. Balapulang, Kabupaten Tegal, Jawa Tengah 52464
                </p>
              </div>
            </div>

            {/* Jam Operasional (Opsional tapi berguna untuk warga) */}
            <div className="flex gap-4 px-4">
              <div className="flex items-center gap-3 text-slate-600 font-semibold text-sm">
                <Clock size={18} className="text-blue-900" /> Sen - Jum: 08:00 - 15:30
              </div>
            </div>

            {/* Kontak Detail */}
            <div className="flex flex-wrap gap-6 px-4 pt-4">
              <div className="flex items-center gap-3 text-slate-600 font-bold text-sm hover:text-blue-900 transition-colors">
                <div className="p-2 bg-slate-100 rounded-lg"><Phone size={16} /></div>
                (0283) 465123
              </div>
              <div className="flex items-center gap-3 text-slate-600 font-bold text-sm hover:text-blue-900 transition-colors">
                <div className="p-2 bg-slate-100 rounded-lg"><Mail size={16} /></div>
                info@balapulang.desa.id
              </div>
            </div>
          </div>
        </motion.div>

        {/* Kolom Google Maps */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="h-[450px] md:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-900/10 border-8 border-slate-50 group"
        >
          <iframe 
            // Pastikan pakai link embed Google Maps yang asli di sini nanti
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15840.407986701198!2d109.1306306!3d-7.0000000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6fb9b5a0000001%3A0x0!2zQmFsYWkgRGVzYSBCYWxhcHVsYW5n!5e0!3m2!1sid!2sid!4v1700000000000" 
            className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>
      </div>
    </section>
  );
};

export default Lokasi;