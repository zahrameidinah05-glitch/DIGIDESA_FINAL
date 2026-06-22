import { motion } from 'framer-motion';
import { Info, FileText } from 'lucide-react';

const Tentang = () => {
  return (
    // ID "tentang" sudah terpasang di sini untuk target scroll dari Navbar
    <section id="tentang" className="py-24 bg-slate-50 px-6 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Header dengan Animasi Muncul */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1.5 mb-4 bg-blue-50 rounded-full border border-blue-100">
            <span className="text-[10px] font-black text-blue-700 uppercase tracking-[0.2em]">Profil Banjaranyar</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-4">Membangun Desa Masa Depan</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Mengenal lebih dekat visi dan misi Balai Desa Banjaranyar dalam mewujudkan tata kelola administrasi yang transparan bagi seluruh warga Tegal.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Box Visi */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="p-8 md:p-10 bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/5"
          >
            <div className="w-12 h-12 bg-blue-900 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-900/30">
              <Info className="text-white" size={20} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-800 tracking-tight">Visi Desa</h3>
            <p className="text-slate-500 leading-relaxed italic border-l-4 border-blue-900 pl-4 text-sm md:text-base">
              "Kebersamaan dalam membangun demi Desa Banjaranyar yang lebih maju."
            </p>
          </motion.div>

          {/* Box Misi */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="p-8 md:p-10 bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-600/5"
          >
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-600/30">
              <FileText className="text-white" size={20} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-800 tracking-tight">Misi Desa</h3>
            <ul className="text-slate-500 space-y-4 text-sm md:text-base">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div> 
                </div>
                <span>Bersama masyarakat memperkuat kelembagaan desa yang ada untuk melayani masyarakat secara optimal.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div> 
                </div>
                <span>Bersama masyarakat dan Kelembagaan Desa menyelenggarakan pemerintahan desa dan melaksanakan pembangunan desa yang partisipatif.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div> 
                </div>
                <span>Bersama masyarakat dan kelembagaan masyarakat dalam mewujudkan Desa Banjaranyar yang aman, tentram dan damai.</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Tentang;