import { motion } from 'framer-motion';
import { Camera, Map } from 'lucide-react';
import imgadministrasi from '../img/administrasi.jpeg';
import imgRapat from '../img/rapat.jpeg';
import imgSosialisasi from '../img/sosialisasi.jpeg';
import imgUMKM from '../img/umkm.jpeg';

const Gallery = () => {
  const photos = [
    { id: 1, title: "Rapat Desa", category: "Administrasi", url: imgRapat },
    { id: 2, title: "Layanan Balai Desa", category: "Digital", url: imgadministrasi },
    { id: 3, title: "Sosialisasi Program", category: "Pemberdayaan", url: imgSosialisasi },
    { id: 4, title: "UNKM Program", category: "UMKM", url: imgUMKM },

  ];

  return (
    <section id="gallery" className="py-24 bg-slate-50 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Deskripsi Daerah Balapulang */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black text-blue-900 mb-6 flex items-center gap-2">
              <Map size={32} /> Mengenal Banjaranyar
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Kecamatan Balapulang merupakan wilayah strategis di Kabupaten Tegal yang dikenal dengan keramahan penduduknya dan potensi ekonomi kerakyatan yang kuat. 
            </p>
            <p className="text-slate-600 leading-relaxed">
              Balai Desa Banjaranyar kini bertransformasi menjadi pusat digitalisasi layanan publik, memastikan setiap warga mendapatkan akses administrasi yang modern, cepat, dan transparan sesuai standar 
            </p>
          </motion.div>
          <div className="p-8 bg-blue-900 rounded-[3rem] text-white shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Statistik Desa</h3>
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <p className="text-3xl font-black">100%</p>
                <p className="text-xs opacity-70 uppercase tracking-widest mt-1">Layanan Digital</p>
              </div>
              <div>
                <p className="text-3xl font-black">24/7</p>
                <p className="text-xs opacity-70 uppercase tracking-widest mt-1">Akses Informasi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            <Camera className="text-blue-900" /> Gallery desa
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <motion.div 
              key={photo.id}
              whileHover={{ scale: 1.03 }}
              className="relative group overflow-hidden rounded-[2rem] h-[300px] shadow-lg"
            >
              <img 
                src={photo.url} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                alt={photo.title} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                <span className="text-xs font-bold text-blue-200 uppercase tracking-widest">{photo.category}</span>
                <h4 className="text-white font-bold text-lg">{photo.title}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;