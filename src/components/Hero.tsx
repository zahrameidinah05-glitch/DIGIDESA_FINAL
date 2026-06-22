import { motion } from 'framer-motion';
import imgHero from '../img/foto depan balaidesa.jpeg';
import { ChevronRight, ShieldCheck } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative py-20 px-6 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 items-center gap-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-6">
            <ShieldCheck size={14} /> SISTEM INFORMASI DESA BANJARANYAR
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.05] mb-8">
            Pelayanan Administrasi <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-600">
              Desa Online
            </span>
          </h2>
          <p className="text-lg text-slate-500 max-w-lg mb-10 leading-relaxed">
            Warga Banjaranyar kini bisa mengurus surat keterangan dan administrasi kependudukan cukup dari smartphone. Lebih cepat, transparan, dan efisien.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-10 py-4 bg-blue-900 text-white rounded-2xl font-bold hover:shadow-2xl hover:shadow-blue-900/40 transition-all flex items-center gap-2">
              Mulai Pelayanan <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative hidden lg:block"
        >
          <img 
            src={imgHero}
            className="rounded-[3rem] shadow-2xl border-[12px] border-white object-cover h-[500px] w-full"
            alt="Banjaranyar Digital" 
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;