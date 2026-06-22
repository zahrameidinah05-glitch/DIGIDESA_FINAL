import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group transition-all"
      >
        <span className={`font-bold pr-4 transition-colors ${isOpen ? 'text-blue-900' : 'text-slate-700 group-hover:text-blue-900'}`}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className={`${isOpen ? 'text-blue-900' : 'text-slate-400'}`}
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-slate-500 text-sm leading-relaxed whitespace-pre-line">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Faq = () => {
  const faqs = [
    {
      question: "Bagaimana cara mengurus Surat Keterangan Usaha (SKU)?",
      answer: "1. Siapkan KTP dan KK asli.\n2. Siapkan foto tempat usaha Anda.\n3. Klik menu 'Pelayanan' di website ini, pilih SKU, dan isi formulir digital.\n4. Tim admin desa akan memverifikasi data dan Anda akan menerima notifikasi jika surat siap diambil."
    },
    {
      question: "Berapa lama waktu pengerjaan surat di Balai Desa?",
      answer: "Untuk pengajuan online melalui sistem Desa Digital Balapulang, proses verifikasi biasanya memakan waktu 1-2 hari kerja tergantung kelengkapan data yang diunggah."
    },
    {
      question: "Apakah ada biaya dalam pengurusan surat?",
      answer: "Seluruh layanan administrasi surat-menyurat di Balai Desa Balapulang tidak dipungut biaya alias GRATIS sebagai bentuk pelayanan prima bagi warga."
    },
    {
      question: "Apa saja syarat membuat SKTM (Surat Keterangan Tidak Mampu)?",
      answer: "Syarat utama meliputi KTP, Kartu Keluarga, dan surat pernyataan penghasilan. Pengajuan bisa dilakukan langsung melalui menu SKTM Online untuk mempercepat proses."
    }
  ];

  return (
    // ID 'faq' harus sama dengan yang dipanggil di Navbar
    // scroll-mt-28 mencegah judul tertutup navbar saat scroll
    <section id="faq" className="py-24 bg-white px-6 scroll-mt-28">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="p-3 bg-blue-50 text-blue-900 rounded-2xl mb-4"
          >
            <HelpCircle size={28} />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">Tanya Jawab (FAQ)</h2>
          <p className="text-slate-500">Informasi lengkap seputar prosedur administrasi di Desa Banjaranyar.</p>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-slate-50 rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm"
        >
          {faqs.map((faq, index) => (
            <FaqItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Faq;