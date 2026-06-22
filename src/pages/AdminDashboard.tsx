import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, Trash2, Calendar, 
  FileText, FileSpreadsheet, RefreshCw, LogOut,
  Clock, ChevronRight, Eye, Search, FileDown, Edit2, X 
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

// IMPORT UNTUK PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pengajuan, setPengajuan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [penandatangan, setPenandatangan] = useState('');

  // --- PROTEK DASHBOARD & FETCH DATA ---
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }
      
      fetchData();
    };

    checkUser();

    // Realtime listener
    const channel = supabase
      .channel('db-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pengajuan_surat' }, () => fetchData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('pengajuan_surat')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setPengajuan(data);
    if (error) console.error("Error fetch:", error.message);
    setLoading(false);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Gagal logout:", error.message);
    } else {
      navigate('/login');
    }
  };

  const handleEditPenandatangan = (item: any) => {
    setEditingItem(item);
    let currentPenandatangan = '';
    try {
      if (item.keterangan_lain) {
        const parsed = JSON.parse(item.keterangan_lain);
        currentPenandatangan = parsed.penandatangan || '';
      }
    } catch (e) {}
    setPenandatangan(currentPenandatangan);
    setIsEditModalOpen(true);
  };

  const savePenandatangan = async () => {
    if (!editingItem) return;
    setIsSubmitting(true);
    let parsed: any = {};
    try {
      if (editingItem.keterangan_lain) {
        const parsedData = JSON.parse(editingItem.keterangan_lain);
        if (typeof parsedData === 'object' && parsedData !== null) {
          parsed = parsedData;
        } else {
          parsed = { text: editingItem.keterangan_lain };
        }
      }
    } catch (e) {
      parsed = { text: editingItem.keterangan_lain };
    }
    
    parsed.penandatangan = penandatangan;

    const { error } = await supabase
      .from('pengajuan_surat')
      .update({ keterangan_lain: JSON.stringify(parsed) })
      .eq('id', editingItem.id);

    setIsSubmitting(false);
    if (!error) {
      setIsEditModalOpen(false);
      setEditingItem(null);
      fetchData(); // Refresh data
    } else {
      alert("Gagal menyimpan nama penanda tangan");
    }
  };

  // --- FUNGSI CETAK PDF FORMAL ---
  const generatePDF = async (item: any) => {
    let logoImg: HTMLImageElement | null = null;
    let garudaImg: HTMLImageElement | null = null;
    try {
      logoImg = await new Promise((resolve, reject) => {
        const img = new Image();
        img.src = '/logo-tegal.png';
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
      });
      garudaImg = await new Promise((resolve, reject) => {
        const img = new Image();
        img.src = '/logo-garuda.png';
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
      });
    } catch (e) {
      console.error("Gagal meload logo:", e);
    }

    let penandatanganNama = '';
    let keteranganLainText = item.keterangan_lain || '-';
    try {
      if (item.keterangan_lain) {
        const parsed = JSON.parse(item.keterangan_lain);
        if (typeof parsed === 'object' && parsed !== null) {
          penandatanganNama = parsed.penandatangan || '';
          if (parsed.text !== undefined) {
            keteranganLainText = parsed.text || '-';
          } else {
            keteranganLainText = '-'; 
          }
        }
      }
    } catch (e) {}

    const jenisSurat = item.jenis_surat?.toUpperCase();
    const isKK = jenisSurat === 'KK';
    const doc = isKK ? new jsPDF('l', 'mm', 'a4') : new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const isSKTM = jenisSurat === 'SKTM';
    const isSKT = jenisSurat === 'SKT';
    const isSKU = jenisSurat === 'SKU';
    const isSKCK = jenisSurat === 'SKCK';

    if (!isKK && !isSKTM && !isSKT && !isSKU && !isSKCK) {
      // 1. Watermark
      doc.setTextColor(245, 245, 245); 
      doc.setFontSize(60);
      doc.setFont("helvetica", "bold");
      
      // 2. Kop Surat
      if (logoImg) doc.addImage(logoImg, 'PNG', 20, 10, 20, 25);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("PEMERINTAH KABUPATEN TEGAL", 105, 15, { align: "center" });
      doc.text("KECAMATAN BALAPULANG", 105, 22, { align: "center" });
      doc.setFontSize(16);
      doc.text("DESA BANJARANYAR", 105, 30, { align: "center" });
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Jalan Proklamasi No. 1 Desa Banjaranyar, Kec. Balapulang, Kab. Tegal", 105, 36, { align: "center" });

      doc.setLineWidth(0.8);
      doc.line(20, 39, 190, 39);
      doc.setLineWidth(0.2);
      doc.line(20, 40, 190, 40);
    }

    if (jenisSurat === 'KK') {
      // ==========================================
      // FORMAT KARTU KELUARGA (LANDSCAPE)
      // ==========================================
      doc.setTextColor(0, 0, 0);
      
      // Logo Garuda (Kiri Atas sesuai gambar)
      if (garudaImg) doc.addImage(garudaImg, 'PNG', 15, 10, 22, 22);

      // Judul KARTU KELUARGA
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("KARTU KELUARGA", pageWidth / 2, 20, { align: "center" });
      
      doc.setFontSize(12);
      // Asumsi ada nomor KK, pakai NIK pemohon sementara jika kosong
      doc.text(`NO: ${item.nik || '-'}`, pageWidth / 2, 26, { align: "center" });

      // Header Info (Kiri)
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Nama Kepala Keluarga", 15, 35);
      doc.text(":", 55, 35);
      doc.text((item.nama || '').toUpperCase(), 58, 35);

      doc.text("Alamat", 15, 40);
      doc.text(":", 55, 40);
      doc.text((item.alamat || '').toUpperCase(), 58, 40);

      doc.text("RT / RW", 15, 45);
      doc.text(":", 55, 45);
      doc.text("007/001", 58, 45); // Dummy RT/RW or parse from alamat

      doc.text("Desa/Kelurahan", 15, 50);
      doc.text(":", 55, 50);
      doc.text("BANJARANYAR", 58, 50);

      // Header Info (Kanan)
      const rightX = pageWidth - 85;
      doc.text("Kecamatan", rightX, 35);
      doc.text(":", rightX + 25, 35);
      doc.text("BALAPULANG", rightX + 28, 35);

      doc.text("Kabupaten/Kota", rightX, 40);
      doc.text(":", rightX + 25, 40);
      doc.text("TEGAL", rightX + 28, 40);

      doc.text("Kode Pos", rightX, 45);
      doc.text(":", rightX + 25, 45);
      doc.text("52464", rightX + 28, 45);

      doc.text("Provinsi", rightX, 50);
      doc.text(":", rightX + 25, 50);
      doc.text("JAWA TENGAH", rightX + 28, 50);

      // Data Anggota
      let anggota = [];
      try {
        if (item.keterangan_lain) {
          const parsed = JSON.parse(item.keterangan_lain);
          if (parsed.anggota_keluarga) anggota = parsed.anggota_keluarga;
        }
      } catch (e) {}

      // Default jika tidak ada data sama sekali
      if (anggota.length === 0) {
        anggota = [{
          nama_lengkap: item.nama || '-',
          nik: item.nik || '-',
          jenis_kelamin: item.jenis_kelamin || '-',
          tempat_lahir: (item.ttl || '-').split(',')[0] || '-',
          tanggal_lahir: (item.ttl || '-').split(',')[1] || '-',
          agama: item.agama || '-',
          pendidikan: item.pendidikan || '-',
          jenis_pekerjaan: item.pekerjaan || '-',
          status_perkawinan: item.status_kawin || '-',
          status_hubungan: 'KEPALA KELUARGA',
          kewarganegaraan: item.kewarganegaraan || 'WNI',
          no_paspor: '-', no_kitas: '-', nama_ayah: '-', nama_ibu: '-'
        }];
      }

      // Tabel 1 (Kolom 1-8)
      const table1Head = [[
        'No', 
        'Nama Lengkap\n\n(1)', 
        'NIK\n\n(2)', 
        'Jenis\nKelamin\n\n(3)', 
        'Tempat Lahir\n\n(4)', 
        'Tanggal\nLahir\n\n(5)', 
        'Agama\n\n(6)', 
        'Pendidikan\n\n(7)', 
        'Jenis Pekerjaan\n\n(8)'
      ]];
      const table1Body = anggota.map((a: any, i: number) => [
        (i + 1).toString(),
        a.nama_lengkap || '-',
        a.nik || '-',
        a.jenis_kelamin || '-',
        a.tempat_lahir || '-',
        a.tanggal_lahir || '-',
        a.agama || '-',
        a.pendidikan || '-',
        a.jenis_pekerjaan || '-'
      ]);

      autoTable(doc, {
        startY: 55,
        head: table1Head,
        body: table1Body,
        theme: 'grid',
        headStyles: { fillColor: [240, 240, 240], textColor: [0,0,0], fontStyle: 'bold', halign: 'center', valign: 'middle', fontSize: 8, lineWidth: 0.2, lineColor: [0,0,0] },
        bodyStyles: { fontSize: 8, textColor: [0,0,0], halign: 'center', valign: 'middle', lineWidth: 0.2, lineColor: [0,0,0] },
        styles: { font: "helvetica", cellPadding: 2 },
        columnStyles: { 1: { halign: 'left' } },
        margin: { left: 15, right: 15 }
      });

      let nextY = (doc as any).lastAutoTable.finalY + 5;

      // Tabel 2 (Kolom 9-16)
      const table2Head = [
        [
          { content: 'No', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
          { content: 'Status\nPerkawinan\n\n(9)', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
          { content: 'Status Hubungan\nDalam Keluarga\n\n(10)', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
          { content: 'Kewarganegaraan\n\n(11)', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
          { content: 'Dokumen Imigrasi', colSpan: 2, styles: { halign: 'center', valign: 'middle' } },
          { content: 'Nama Orang Tua', colSpan: 2, styles: { halign: 'center', valign: 'middle' } }
        ],
        [
          { content: 'No. Paspor\n\n(12)', styles: { halign: 'center', valign: 'middle' } },
          { content: 'No. KITAS/KITAP\n\n(13)', styles: { halign: 'center', valign: 'middle' } },
          { content: 'Ayah\n\n(14)', styles: { halign: 'center', valign: 'middle' } },
          { content: 'Ibu\n\n(15)', styles: { halign: 'center', valign: 'middle' } }
        ]
      ];
      const table2Body = anggota.map((a: any, i: number) => [
        (i + 1).toString(),
        a.status_perkawinan || '-',
        a.status_hubungan || '-',
        a.kewarganegaraan || '-',
        a.no_paspor || '-',
        a.no_kitas || '-',
        a.nama_ayah || '-',
        a.nama_ibu || '-'
      ]);

      autoTable(doc, {
        startY: nextY,
        head: table2Head,
        body: table2Body,
        theme: 'grid',
        headStyles: { fillColor: [240, 240, 240], textColor: [0,0,0], fontStyle: 'bold', halign: 'center', valign: 'middle', fontSize: 8, lineWidth: 0.2, lineColor: [0,0,0] },
        bodyStyles: { fontSize: 8, textColor: [0,0,0], halign: 'center', valign: 'middle', lineWidth: 0.2, lineColor: [0,0,0] },
        styles: { font: "helvetica", cellPadding: 2 },
        margin: { left: 15, right: 15 }
      });

      let finalY = (doc as any).lastAutoTable.finalY + 15;

      // Footer
      doc.setFontSize(9);
      doc.text("Dikeluarkan Tanggal", 15, finalY);
      doc.text(":", 50, finalY);
      
      const today = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
      doc.text(today, 53, finalY);

      doc.text("LEMBAR", 15, finalY + 5);
      doc.text(":", 50, finalY + 5);
      doc.text("I. Kepala Keluarga", 53, finalY + 5);
      doc.text("II. RT", 53, finalY + 10);
      doc.text("III. Desa/Kelurahan", 53, finalY + 15);

      // TTD Kepala Keluarga
      doc.text("Kepala Keluarga", pageWidth / 3, finalY, { align: "center" });
      doc.text((item.nama || '').toUpperCase(), pageWidth / 3, finalY + 25, { align: "center" });

      // TTD Kepala Desa
      doc.text("A.n KEPALA DESA BANJARANYAR", pageWidth - 45, finalY, { align: "center" });
      doc.text("Kasi Pelayanan", pageWidth - 45, finalY + 5, { align: "center" });
      
      doc.setFont("helvetica", "bold");
      if (penandatanganNama) {
        const nameUpper = penandatanganNama.toUpperCase();
        doc.text(nameUpper, pageWidth - 45, finalY + 25, { align: "center" });
        doc.setLineWidth(0.3);
        const nameWidth = doc.getTextWidth(nameUpper);
        doc.line((pageWidth - 45) - nameWidth / 2, finalY + 26, (pageWidth - 45) + nameWidth / 2, finalY + 26);
      }

    } else if (jenisSurat === 'SKTM_SEKOLAH') {
      // FORMAT SKTM SEKOLAH
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      const judulText = "SURAT KETERANGAN TIDAK MAMPU";
      doc.text(judulText, pageWidth / 2, 50, { align: "center" });
      const judulWidth = doc.getTextWidth(judulText);
      doc.line(pageWidth / 2 - judulWidth / 2, 51.5, pageWidth / 2 + judulWidth / 2, 51.5);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("Nomor : .....................................................", pageWidth / 2, 56, { align: "center" });

      doc.setFontSize(10);
      const paragraf1 = "Yang bertanda tangan di bawah ini Kepala Desa Banjaranyar Kecamatan Balapulang, Kabupaten Tegal, dengan ini menerangkan dengan sebenarnya bahwa :";
      doc.text(doc.splitTextToSize(paragraf1, 160), 25, 68);

      const anakData = [
        ['Nama', ':', item.nama_anak || '-'],
        ['NIK', ':', item.nik_anak || '-'],
        ['Tempat/tgl lahir', ':', item.ttl_anak || '-'],
        ['Jenis Kelamin', ':', item.jk_anak || '-'],
        ['Agama', ':', item.agama_anak || '-'],
        ['Alamat', ':', item.alamat_anak || '-'],
      ];

      autoTable(doc, {
        startY: 78,
        theme: 'plain',
        body: anakData,
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 5 },
          2: { cellWidth: 'auto' }
        },
        styles: { fontSize: 10, cellPadding: 1.5, font: "helvetica" },
        margin: { left: 25 }
      });

      let finalTableY = (doc as any).lastAutoTable.finalY + 5;
      
      doc.text("Nama tersebut di atas adalah Anak dari :", 25, finalTableY);
      finalTableY += 5;

      const ortuData = [
        ['Nama', ':', item.nama || '-'],
        ['NIK', ':', item.nik || '-'],
        ['Tempat/tgl lahir', ':', item.ttl || '-'],
        ['Jenis Kelamin', ':', item.jenis_kelamin || '-'],
        ['Agama', ':', item.agama || '-'],
        ['Pekerjaan', ':', item.pekerjaan || '-'],
        ['Alamat', ':', item.alamat || '-'],
      ];

      autoTable(doc, {
        startY: finalTableY,
        theme: 'plain',
        body: ortuData,
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 5 },
          2: { cellWidth: 'auto' }
        },
        styles: { fontSize: 10, cellPadding: 1.5, font: "helvetica" },
        margin: { left: 25 }
      });

      finalTableY = (doc as any).lastAutoTable.finalY + 5;

      doc.setFont("helvetica", "bold");
      const boldText = "Adalah warga kami yang mengaku tidak mampu / miskin";
      doc.text(boldText, 25, finalTableY);
      const boldWidth = doc.getTextWidth(boldText);
      doc.setFont("helvetica", "normal");
      doc.text(", dan akan digunakan untuk,", 25 + boldWidth, finalTableY);
      
      finalTableY += 8;
      doc.text("Keperluan", 25, finalTableY);
      doc.text(": " + (item.keperluan || '-'), 55, finalTableY);

      finalTableY += 10;
      doc.text("Demikian surat keterangan ini dibuat dan untuk dapat dipergunakan sebagaimana mestinya.", 25, finalTableY);

      // Signatures
      const signY = finalTableY + 20;
      doc.text("Banjaranyar, " + new Date().toLocaleDateString('id-ID'), 155, signY, { align: "center" });
      doc.text("An. Kepala Desa Banjaranyar", 155, signY + 12, { align: "center" });
      doc.text("Kasi Pelayanan", 155, signY + 18, { align: "center" });
      if (penandatanganNama) {
        doc.setFont("helvetica", "bold");
        const nameUpper = penandatanganNama.toUpperCase();
        doc.text(nameUpper, 155, signY + 44, { align: "center" });
        doc.setLineWidth(0.3);
        const nameWidth = doc.getTextWidth(nameUpper);
        doc.line(155 - nameWidth / 2, signY + 45, 155 + nameWidth / 2, signY + 45);
      }

    } else if (jenisSurat === 'KTP') {
      // FORMAT SURAT PENGANTAR KTP
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      const judulText = "SURAT PENGANTAR";
      doc.text(judulText, pageWidth / 2, 50, { align: "center" });
      const judulWidth = doc.getTextWidth(judulText);
      doc.line(pageWidth / 2 - judulWidth / 2, 51.5, pageWidth / 2 + judulWidth / 2, 51.5);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Nomor : .....................................................", pageWidth / 2, 56, { align: "center" });

      // Checkbox Permohonan KTP (kosong, diceklis manual)
      const checkY = 64;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("PERMOHONAN KTP", 25, checkY);
      doc.text(":", 60, checkY);

      // Baru
      doc.rect(65, checkY - 3.5, 4, 4);
      doc.setFont("helvetica", "normal");
      doc.text("Baru", 71, checkY);

      // Perpanjang
      doc.rect(90, checkY - 3.5, 4, 4);
      doc.text("Perpanjang", 96, checkY);

      // Penggantian
      doc.rect(125, checkY - 3.5, 4, 4);
      doc.text("Penggantian", 131, checkY);

      // Paragraf pembuka
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const paragraf1 = "          Yang bertanda tangan di bawah ini, Kepala Desa Banjaranyar Kecamatan Balapulang Kabupaten Tegal, menerangkan bahwa :";
      doc.text(doc.splitTextToSize(paragraf1, 160), 25, 72);

      // 10 Field bernomor
      const ktpData = [
        ['1.  Nama lengkap', ':', item.nama || '-'],
        ['2.  NIK', ':', item.nik || '-'],
        ['3.  Tanggal lahir', ':', item.ttl || '-'],
        ['4.  Jenis Kelamin', ':', item.jenis_kelamin || '-'],
        ['5.  Golongan darah', ':', item.golongan_darah || '-'],
        ['6.  Agama', ':', item.agama || '-'],
        ['7.  Pekerjaan', ':', item.pekerjaan || '-'],
        ['8.  Pendidikan', ':', item.pendidikan || '-'],
        ['9.  Status', ':', item.status_kawin || '-'],
        ['10. Tempat Tinggal', ':', item.alamat || '-'],
      ];

      autoTable(doc, {
        startY: 82,
        theme: 'plain',
        body: ktpData,
        columnStyles: {
          0: { cellWidth: 45 },
          1: { cellWidth: 5 },
          2: { cellWidth: 'auto' }
        },
        styles: { fontSize: 10, cellPadding: 1.5, font: "helvetica" },
        margin: { left: 25 }
      });

      const finalTableY = (doc as any).lastAutoTable.finalY + 10;
      doc.text("          Demikian surat pengantar ini kami buat dengan sebenar-benarnya dan untuk dapat", 25, finalTableY);
      doc.text("digunakan seperlunya.", 25, finalTableY + 5);

      // Tanda Tangan
      const signY = finalTableY + 18;
      doc.text("Banjaranyar, " + new Date().toLocaleDateString('id-ID'), 155, signY, { align: "center" });

      // Kiri: Pemohon
      doc.text("Pemohon", 35, signY + 12);
      doc.setFont("helvetica", "bold");
      doc.text((item.nama || '').toUpperCase(), 25, signY + 44);
      doc.setLineWidth(0.3);
      doc.line(25, signY + 45, 25 + doc.getTextWidth((item.nama || '').toUpperCase()), signY + 45);

      // Kanan: Kepala Desa
      doc.setFont("helvetica", "normal");
      doc.text("Mengetahui,", 155, signY + 12, { align: "center" });
      doc.text("a.n Kepala Desa Banjaranyar", 155, signY + 18, { align: "center" });
      doc.text("Kasi Pelayanan", 155, signY + 24, { align: "center" });
      if (penandatanganNama) {
        doc.setFont("helvetica", "bold");
        const nameUpper = penandatanganNama.toUpperCase();
        doc.text(nameUpper, 155, signY + 50, { align: "center" });
        doc.setLineWidth(0.3);
        const nameWidth = doc.getTextWidth(nameUpper);
        doc.line(155 - nameWidth / 2, signY + 51, 155 + nameWidth / 2, signY + 51);
      }

    } else if (jenisSurat === 'SKT') {
      // ==========================================
      // FORMAT SURAT TANAH
      // ==========================================
      doc.setTextColor(0, 0, 0);

      // Kop Surat SKT
      if (logoImg) doc.addImage(logoImg, 'PNG', 20, 10, 20, 25);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("PEMERINTAH KABUPATEN TEGAL", pageWidth / 2, 15, { align: "center" });
      doc.text("KECAMATAN BALAPULANG", pageWidth / 2, 22, { align: "center" });
      doc.setFontSize(16);
      doc.text("DESA BANJARANYAR", pageWidth / 2, 30, { align: "center" });
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Jl. Proklamasi No.1 Kode Pos: 52464", pageWidth / 2, 36, { align: "center" });

      doc.setLineWidth(0.8);
      doc.line(20, 39, 190, 39);
      doc.setLineWidth(0.2);
      doc.line(20, 40, 190, 40);

      // No. Kode Desa below line
      doc.setFontSize(9);
      doc.text("No. Kode Desa / Kelurahan :", 20, 46);
      doc.text("3328042014", 20, 51);

      // Judul
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      const judulText = "SURAT KETERANGAN";
      doc.text(judulText, pageWidth / 2, 57, { align: "center" });
      const judulWidth = doc.getTextWidth(judulText);
      doc.line(pageWidth / 2 - judulWidth / 2, 58.5, pageWidth / 2 + judulWidth / 2, 58.5);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("Nomor : .....................................................", pageWidth / 2, 64, { align: "center" });

      doc.setFontSize(10);
      // Paragraf pembuka
      const paragraf1 = "Yang bertanda tangan di bawah ini Kepala Desa Banjaranyar Kecamatan Balapulang Kabupaten Tegal, menerangkan bahwa :";
      doc.text(doc.splitTextToSize(paragraf1, 170), 20, 74);

      const agKew = (item.kewarganegaraan || 'Indonesia') + " & " + (item.agama || 'Islam');
      
      const noSertifikat = item.no_sertifikat || '-';
      const noShm = item.no_shm || '-';
      const noNib = item.no_nib || '-';

      const keperluanTanah = `Surat kehilangan Sertifikat Tanah Kavling An ${item.nama || '-'} \nSHM ${noSertifikat} ,SU ${noShm} ,NIB ${noNib}.`;

      const pemohonData = [
        ['Nama', ':', item.nama || '-'],
        ['Jenis Kelamin', ':', item.jenis_kelamin || '-'],
        ['Tempat & Tanggal Lahir', ':', item.ttl || '-'],
        ['Kewarganegaraan & Agama', ':', agKew],
        ['Pekerjaan', ':', item.pekerjaan || '-'],
        ['Tempat tinggal', ':', `${item.alamat || '-'}\nKec. Balapulang, Kab. Tegal`],
        ['Surat bukti diri (NIK)', ':', `NIK. ${item.nik || '-'}`],
        ['Keperluan', ':', keperluanTanah],
        ['Berlaku mulai', ':', `${new Date().toLocaleDateString('id-ID')} s/d Selesai`],
        ['Keterangan lain', ':', "Benar bahwa orang tersebut di atas benar-benar warga\nkami yang Kehilangan sebuah sertifikat"]
      ];

      autoTable(doc, {
        startY: 82,
        theme: 'plain',
        body: pemohonData,
        columnStyles: {
          0: { cellWidth: 45 },
          1: { cellWidth: 5 },
          2: { cellWidth: 120 }
        },
        styles: { fontSize: 10, cellPadding: 1.8, font: "helvetica" },
        margin: { left: 20 }
      });

      const finalTableY = (doc as any).lastAutoTable.finalY + 10;
      doc.text("Demikian surat keterangan ini kami buat dengan sebenar benarnya dan untuk dapat dipergunakan sebagaimana mestinya.", 20, finalTableY, { maxWidth: 170 });

      // Signatures
      const signY = finalTableY + 22;
      doc.text("Banjaranyar, " + new Date().toLocaleDateString('id-ID'), 155, signY, { align: "center" });
      doc.text("An Kepala Desa Banjaranyar", 155, signY + 12, { align: "center" });
      doc.text("Kasi Kesra", 155, signY + 18, { align: "center" });
      if (penandatanganNama) {
        doc.setFont("helvetica", "bold");
        const nameUpper = penandatanganNama.toUpperCase();
        doc.text(nameUpper, 155, signY + 44, { align: "center" });
        doc.setLineWidth(0.3);
        const nameWidth = doc.getTextWidth(nameUpper);
        doc.line(155 - nameWidth / 2, signY + 45, 155 + nameWidth / 2, signY + 45);
      }


    } else if (jenisSurat === 'SKTM') {
      // ==========================================
      // FORMAT SKTM UMUM (CUSTOM HEADER)
      // ==========================================
      doc.setTextColor(0, 0, 0);

      // Kop Surat SKTM Umum
      if (logoImg) doc.addImage(logoImg, 'PNG', 20, 8, 18, 22);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("KECAMATAN BALAPULANG", pageWidth / 2, 16, { align: "center" });
      doc.setFontSize(16);
      doc.text("DESA BANJARANYAR", pageWidth / 2, 24, { align: "center" });
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Alamat : Jalan Proklamasi No. 1", pageWidth / 2, 30, { align: "center" });
      doc.setLineWidth(0.8);
      doc.line(20, 33, 190, 33);
      doc.setLineWidth(0.2);
      doc.line(20, 34, 190, 34);

      // Judul
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      const judulSKTM = "SURAT KETERANGAN TIDAK MAMPU";
      doc.text(judulSKTM, pageWidth / 2, 44, { align: "center" });
      const judulSKTMWidth = doc.getTextWidth(judulSKTM);
      doc.line(pageWidth / 2 - judulSKTMWidth / 2, 45.5, pageWidth / 2 + judulSKTMWidth / 2, 45.5);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Nomor : .....................................................", pageWidth / 2, 50, { align: "center" });

      // Paragraf pembuka (baris pertama menjorok, baris lanjutan rata kiri)
      const paraUmum = "Yang bertanda tangan di bawah ini, Kepala Desa Banjaranyar Kecamatan Balapulang Kabupaten Tegal, dengan ini menerangkan bahwa :";
      const paraLines = doc.splitTextToSize(paraUmum, 150);
      if (paraLines.length > 0) {
        doc.text(paraLines[0], 40, 60); // baris pertama menjorok
        if (paraLines.length > 1) {
          doc.text(paraLines.slice(1), 25, 65); // baris selanjutnya rata kiri
        }
      }

      // Data pemohon
      const agamaKewarganegaraan = (item.agama || '-') + " & " + (item.kewarganegaraan || 'Indonesia');
      const sktmUmumData = [
        ['Nama', ':', item.nama || '-'],
        ['Tempat / Tanggal lahir', ':', item.ttl || '-'],
        ['Pekerjaan', ':', item.pekerjaan || '-'],
        ['Agama & Kewarganegaraan', ':', agamaKewarganegaraan],
        ['Nomor Identitas diri', ':', `NIK. ${item.nik || '-'}`],
        ['Alamat', ':', item.alamat || '-'],
      ];

      autoTable(doc, {
        startY: 70,
        theme: 'plain',
        body: sktmUmumData,
        columnStyles: {
          0: { cellWidth: 55 },
          1: { cellWidth: 5 },
          2: { cellWidth: 'auto' }
        },
        styles: { fontSize: 10, cellPadding: 1.8, font: "helvetica" },
        margin: { left: 25, right: 25 }
      });

      let sktmY = (doc as any).lastAutoTable.finalY + 8;

      // Kalimat keterangan
      doc.setFont("helvetica", "italic");
      doc.text("Orang tersebut di atas adalah benar-benar penduduk kami yang keadaannya tidak mampu.", 25, sktmY);
      sktmY += 8;
      doc.setFont("helvetica", "normal");
      doc.text(`Keperluan : ${item.keperluan || '-'}`, 25, sktmY);
      sktmY += 10;
      doc.text(doc.splitTextToSize("Demikian surat keterangan ini kami buat dengan sebenar-benarnya dan untuk dapat digunakan seperlunya.", 155), 25, sktmY);

      // Tanda Tangan
      const sktmSignY = sktmY + 22;
      doc.text("Banjaranyar, " + new Date().toLocaleDateString('id-ID'), 155, sktmSignY, { align: "center" });

      // Kiri: PUSKESOS
      doc.setFont("helvetica", "normal");
      doc.text("PUSKESOS Kec. BALAPULANG", 25, sktmSignY + 12);
      doc.text("Tgl", 25, sktmSignY + 18);
      doc.text(":", 35, sktmSignY + 18);
      doc.text("NO", 25, sktmSignY + 24);
      doc.text(":", 35, sktmSignY + 24);
      doc.text("...............................", 25, sktmSignY + 44);

      // Kanan: Kepala Desa
      doc.text("An.Kepala Desa Banjaranyar", 155, sktmSignY + 12, { align: "center" });
      doc.text("Kasi Kesra", 155, sktmSignY + 18, { align: "center" });
      if (penandatanganNama) {
        doc.setFont("helvetica", "bold");
        const nameUpper = penandatanganNama.toUpperCase();
        doc.text(nameUpper, 155, sktmSignY + 44, { align: "center" });
        doc.setLineWidth(0.3);
        const nameWidth = doc.getTextWidth(nameUpper);
        doc.line(155 - nameWidth / 2, sktmSignY + 45, 155 + nameWidth / 2, sktmSignY + 45);
      }

      // Mengetahui Camat
      doc.setFont("helvetica", "normal");
      doc.text("Mengetahui,", pageWidth / 2, sktmSignY + 52, { align: "center" });
      doc.text("Camat Balapulang", pageWidth / 2, sktmSignY + 58, { align: "center" });
      doc.text("NIP : ...........................................", pageWidth / 2, sktmSignY + 85, { align: "center" });

    } else if (jenisSurat === 'SKU') {
      // ==========================================
      // FORMAT SURAT KETERANGAN USAHA (SKU)
      // ==========================================
      doc.setTextColor(0, 0, 0);

      // Kop Surat SKU
      if (logoImg) doc.addImage(logoImg, 'PNG', 20, 10, 20, 25);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("KECAMATAN BALAPULANG", pageWidth / 2, 16, { align: "center" });
      doc.setFontSize(11);
      doc.text("PEMERINTAH KABUPATEN TEGAL", pageWidth / 2, 22, { align: "center" });
      doc.setFontSize(16);
      doc.text("DESA BANJARANYAR", pageWidth / 2, 30, { align: "center" });
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.text("Alamat : Jalan Proklamasi No.01 Email: baldes.banjaranyar@gmail.com", pageWidth / 2, 36, { align: "center" });
      doc.setLineWidth(0.8);
      doc.line(20, 39, 190, 39);
      doc.setLineWidth(0.2);
      doc.line(20, 40, 190, 40);

      // Judul
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      const judulSKU = "SURAT KETERANGAN USAHA";
      doc.text(judulSKU, pageWidth / 2, 50, { align: "center" });
      const judulSKUWidth = doc.getTextWidth(judulSKU);
      doc.line(pageWidth / 2 - judulSKUWidth / 2, 51.5, pageWidth / 2 + judulSKUWidth / 2, 51.5);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Nomor : .....................................................", pageWidth / 2, 57, { align: "center" });

      // Paragraf pembuka
      doc.setFontSize(10);
      const paraSKU = "Yang bertanda tangan di bawah ini, Kepala Desa Banjaranyar Kecamatan Balapulang Kabupaten Tegal, Menerangkan bahwa :";
      const paraLines = doc.splitTextToSize(paraSKU, 155);
      if (paraLines.length > 0) {
        doc.text(paraLines[0], 40, 67);
        if (paraLines.length > 1) {
          doc.text(paraLines.slice(1), 25, 72);
        }
      }

      // Data pemohon
      const skuData = [
        ['Nama', ':', item.nama || '-'],
        ['Nomor KTP', ':', item.nik || '-'],
        ['Tempat, Tanggal Lahir', ':', item.ttl || '-'],
        ['Pekerjaan', ':', item.pekerjaan || '-'],
        ['Alamat', ':', (item.alamat || '-')],
      ];

      autoTable(doc, {
        startY: 78,
        theme: 'plain',
        body: skuData,
        columnStyles: {
          0: { cellWidth: 45 },
          1: { cellWidth: 5 },
          2: { cellWidth: 'auto' }
        },
        styles: { fontSize: 10, cellPadding: 1.8, font: "helvetica" },
        margin: { left: 25, right: 25 }
      });

      let skuY = (doc as any).lastAutoTable.finalY + 8;

      // Paragraf usaha
      doc.setFont("helvetica", "normal");
      const paraUsaha = "Benar \u2013 benar mengakui mempunyai usaha di wilayah Desa Banjaranyar Kecamatan Balapulang Kabupaten Tegal, dengan kegiatan usaha:";
      const paraUsahaLines = doc.splitTextToSize(paraUsaha, 155);
      if (paraUsahaLines.length > 0) {
        doc.text(paraUsahaLines[0], 40, skuY);
        if (paraUsahaLines.length > 1) {
          doc.text(paraUsahaLines.slice(1), 25, skuY + 5);
        }
      }
      skuY += paraUsahaLines.length * 5 + 8;

      // Nama Usaha (Bold, Centered, Underlined)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      const namaUsaha = (item.nama_usaha || item.keperluan || '-').toUpperCase();
      doc.text(namaUsaha, pageWidth / 2, skuY, { align: "center" });
      const usahaWidth = doc.getTextWidth(namaUsaha);
      doc.setLineWidth(0.3);
      doc.line(pageWidth / 2 - usahaWidth / 2, skuY + 1, pageWidth / 2 + usahaWidth / 2, skuY + 1);
      skuY += 12;

      // Penutup
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text("Demikian surat keterangan ini dibuat untuk dapat dipergunakan sebagaimana mestinya.", 25, skuY);
      skuY += 5;

      // Tanda Tangan (kanan)
      const skuSignY = skuY + 15;
      doc.setFont("helvetica", "normal");
      doc.text("Banjaranyar, " + new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'), 155, skuSignY, { align: "center" });
      doc.text("Mengetahui", 155, skuSignY + 12, { align: "center" });
      doc.text("a.n Kepala Desa Banjaranyar", 155, skuSignY + 18, { align: "center" });
      doc.text("Sekdes", 155, skuSignY + 24, { align: "center" });

      if (penandatanganNama) {
        doc.setFont("helvetica", "bold");
        const nameUpper = penandatanganNama.toUpperCase();
        doc.text(nameUpper, 155, skuSignY + 48, { align: "center" });
        doc.setLineWidth(0.3);
        const nameWidth = doc.getTextWidth(nameUpper);
        doc.line(155 - nameWidth / 2, skuSignY + 49, 155 + nameWidth / 2, skuSignY + 49);
      }

    } else if (jenisSurat === 'SKCK') {
      // ==========================================
      // FORMAT SKCK
      // ==========================================
      doc.setTextColor(0, 0, 0);

      // Kop Surat SKCK
      if (logoImg) doc.addImage(logoImg, 'PNG', 20, 10, 20, 25);
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text("PEMERINTAH KABUPATEN TEGAL", pageWidth / 2, 15, { align: "center" });
      doc.text("KECAMATAN BALAPULANG", pageWidth / 2, 22, { align: "center" });
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("DESA BANJARANYAR", pageWidth / 2, 30, { align: "center" });
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Jl. Proklamasi NO.1 Kode Pos: 52464", pageWidth / 2, 36, { align: "center" });
      
      doc.setLineWidth(0.8);
      doc.line(20, 39, 190, 39);
      doc.setLineWidth(0.2);
      doc.line(20, 40, 190, 40);

      // Judul
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("PENGANTAR", pageWidth / 2, 48, { align: "center" });
      const judulSKCK = "SURAT KETERANGAN CATATAN KEPOLISIAN (SKCK)";
      doc.text(judulSKCK, pageWidth / 2, 54, { align: "center" });
      const judulWidth = doc.getTextWidth(judulSKCK);
      doc.line(pageWidth / 2 - judulWidth / 2, 55, pageWidth / 2 + judulWidth / 2, 55);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Nomor : .....................................................", pageWidth / 2, 60, { align: "center" });

      // Paragraf pembuka
      doc.setFontSize(10);
      const paraSKCK = "Yang bertanda tangan di bawah ini, Kepala Desa Banjaranyar Kecamatan Balapulang Kabupaten Tegal, dengan ini menerangkan bahwa :";
      const paraLines = doc.splitTextToSize(paraSKCK, 155);
      if (paraLines.length > 0) {
        doc.text(paraLines[0], 40, 70);
        if (paraLines.length > 1) {
          doc.text(paraLines.slice(1), 25, 75);
        }
      }

      // Data pemohon
      const agamaKwn = (item.agama || '-') + " & " + (item.kewarganegaraan || '-');
      const skckData = [
        ['Nama', ':', item.nama || '-'],
        ['Tempat / Tanggal lahir', ':', item.ttl || '-'],
        ['Pekerjaan', ':', item.pekerjaan || '-'],
        ['Agama & Kewarganegaraan', ':', agamaKwn],
        ['Nomor Identitas diri', ':', 'NIK.' + (item.nik || '-')],
        ['Alamat', ':', (item.alamat || '-')],
        ['Keperluan', ':', item.keperluan || '-'],
        ['Keterangan lain', ':', keteranganLainText]
      ];

      autoTable(doc, {
        startY: 82,
        theme: 'plain',
        body: skckData,
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 5 },
          2: { cellWidth: 'auto' }
        },
        styles: { fontSize: 10, cellPadding: 1.5, font: "helvetica" },
        margin: { left: 25, right: 25 }
      });

      let skckY = (doc as any).lastAutoTable.finalY + 8;

      // Paragraf penutup
      const penutupSKCK = "Demikian surat keterangan ini kami buat dengan sebenar-benarnya dan untuk dapat digunakan seperlunya.";
      const penutupLines = doc.splitTextToSize(penutupSKCK, 155);
      if (penutupLines.length > 0) {
        doc.text(penutupLines[0], 40, skckY);
        if (penutupLines.length > 1) {
          doc.text(penutupLines.slice(1), 25, skckY + 5);
        }
      }
      skckY += penutupLines.length * 5 + 10;

      // Tanda Tangan
      // Kiri: Pemohon
      doc.text("Yang bersangkutan,", 55, skckY, { align: "center" });
      doc.text((item.nama || '').toUpperCase(), 55, skckY + 25, { align: "center" });
      
      // Kanan: Kepala Desa
      doc.setFont("helvetica", "normal");
      doc.text("Banjaranyar, " + new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'), 155, skckY, { align: "center" });
      doc.text("A/n. Kepala Desa Banjaranyar", 155, skckY + 6, { align: "center" });
      doc.text("Kasi Pemerintahan", 155, skckY + 12, { align: "center" });
      if (penandatanganNama) {
        doc.setFont("helvetica", "bold");
        const nameUpper = penandatanganNama.toUpperCase();
        doc.text(nameUpper, 155, skckY + 25, { align: "center" });
      }

      // Bottom Center: Mengetahui Camat
      let camatY = skckY + 40;
      doc.setFont("helvetica", "normal");
      doc.text("Nomor", 75, camatY);
      doc.text(":", 90, camatY);
      doc.text(".....................................................", 93, camatY);
      
      doc.text("Tanggal", 75, camatY + 6);
      doc.text(":", 90, camatY + 6);
      doc.text(".....................................................", 93, camatY + 6);

      doc.text("Mengetahui", pageWidth / 2, camatY + 18, { align: "center" });
      doc.text("Camat Balapulang", pageWidth / 2, camatY + 24, { align: "center" });
      
      doc.text(".............................................................", pageWidth / 2, camatY + 45, { align: "center" });
      doc.setFont("helvetica", "bold");
      doc.text("NIP.", 72, camatY + 51);

    } else {
      // FORMAT DEFAULT LAYANAN LAIN
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      const judulText = `SURAT KETERANGAN: ${item.jenis_surat?.toUpperCase() || 'LAYANAN'}`;
      doc.text(judulText, pageWidth / 2, 50, { align: "center" });
      const judulWidth = doc.getTextWidth(judulText);
      doc.line(pageWidth / 2 - judulWidth / 2, 51.5, pageWidth / 2 + judulWidth / 2, 51.5);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("Nomor : .....................................................", pageWidth / 2, 57, { align: "center" });
      doc.text("Yang bertanda tangan di bawah ini Kepala Desa menerangkan bahwa:", 25, 70);

      // 4. Tabel Data
      const bodyData = [
        ['Nama Lengkap', ':', item.nama || '-'],
        ['NIK', ':', item.nik || '-'],
      ];

      if (item.ttl) bodyData.push(['Tempat, Tgl Lahir', ':', item.ttl]);
      if (item.jenis_kelamin) bodyData.push(['Jenis Kelamin', ':', item.jenis_kelamin]);
      if (item.pekerjaan) bodyData.push(['Pekerjaan', ':', item.pekerjaan]);
      if (item.pendidikan) bodyData.push(['Pendidikan', ':', item.pendidikan]);
      if (item.status_kawin) bodyData.push(['Status Perkawinan', ':', item.status_kawin]);
      if (item.agama) bodyData.push(['Agama', ':', item.agama]);
      if (item.kewarganegaraan) bodyData.push(['Kewarganegaraan', ':', item.kewarganegaraan]);
      if (item.alamat_domisili) bodyData.push(['Alamat Domisili', ':', item.alamat_domisili]);
      if (item.alamat) bodyData.push(['Alamat', ':', item.alamat]);

      autoTable(doc, {
        startY: 75,
        theme: 'plain',
        body: bodyData,
        columnStyles: {
          0: { cellWidth: 45, fontStyle: 'bold' },
          1: { cellWidth: 5 },
          2: { cellWidth: 'auto' }
        },
        styles: { fontSize: 10, cellPadding: 1.5 },
        margin: { left: 30 }
      });

      const finalTableY = (doc as any).lastAutoTable.finalY + 10;

      // Baris Keperluan
      const keperluanY = finalTableY + 12;
      doc.setFont("helvetica", "bold");
      doc.text("Keperluan", 25, keperluanY);
      doc.setFont("helvetica", "normal");
      doc.text(`: ${item.keperluan || '-'}`, 55, keperluanY);

      // Paragraf penutup
      const closingText = "Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya. Atas perhatiannya kami ucapkan terima kasih.";
      const closingY = keperluanY + 12;
      doc.text(doc.splitTextToSize(closingText, 160), 25, closingY);

      // Tanda Tangan
      const signY = closingY + 25;
      doc.text("Banjaranyar, " + new Date().toLocaleDateString('id-ID'), 155, signY, { align: "center" });
      doc.text("Kepala Desa,", 155, signY + 12, { align: "center" });
      if (penandatanganNama) {
        doc.setFont("helvetica", "bold");
        const nameUpper = penandatanganNama.toUpperCase();
        doc.text(nameUpper, 155, signY + 36, { align: "center" });
        doc.setLineWidth(0.3);
        const nameWidth = doc.getTextWidth(nameUpper);
        doc.line(155 - nameWidth / 2, signY + 37, 155 + nameWidth / 2, signY + 37);
      } else {
        doc.text("", 130, signY + 36); 
      }
    }

    doc.save(`Surat_${item.jenis_surat || 'Dokumen'}_${item.nama || 'Warga'}.pdf`);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (isSubmitting) return; 
    setIsSubmitting(true);
    const { error } = await supabase.from('pengajuan_surat').update({ status: newStatus }).eq('id', id);
    if (error) alert("Gagal update status!");
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (isSubmitting) return;
    if (confirm("Hapus data ini secara permanen?")) {
      setIsSubmitting(true);
      const { error } = await supabase.from('pengajuan_surat').delete().eq('id', id);
      if (error) alert("Gagal menghapus data!");
      setIsSubmitting(false);
    }
  };

  const downloadBerkas = (item: any) => {
    const openFile = (path: string) => {
      if (!path) return;
      const { data } = supabase.storage.from('berkas-surat').getPublicUrl(path);
      window.open(data.publicUrl, '_blank');
    };

    const choice = prompt(
      `Pilih berkas ${item.nama}:\n1. KTP\n2. KK\n3. Surat RT\n4. Kartu Sampah\nKetik angka (1-4):`, 
      "1"
    );

    if (choice === "1") item.url_ktp ? openFile(item.url_ktp) : alert("KTP tidak ada");
    else if (choice === "2") item.url_kk ? openFile(item.url_kk) : alert("KK tidak ada");
    else if (choice === "3") item.url_surat_rt ? openFile(item.url_surat_rt) : alert("Surat RT tidak ada");
    else if (choice === "4") item.url_kartu_sampah ? openFile(item.url_kartu_sampah) : alert("Kartu Sampah tidak ada");
  };

  const exportToCSV = () => {
    const headers = "Nama,NIK,Layanan,Status,Tanggal\n";
    const rows = pengajuan.map(item => `${item.nama},${item.nik},${item.jenis_surat},${item.status},${item.created_at}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rekap_Digidesa_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredData = pengajuan
    .filter(item => filter === 'Semua' ? true : item.status === filter)
    .filter(item => 
      item.nama?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.nik?.includes(searchQuery)
    );

  const stats = [
    { label: 'Total Masuk', value: pengajuan.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Perlu ACC', value: pengajuan.filter(x => x.status === 'pending').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Selesai', value: pengajuan.filter(x => x.status === 'ACC').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex font-sans text-slate-900">
      <aside className="hidden lg:flex w-72 bg-[#0F172A] m-5 rounded-[2.5rem] p-8 flex-col text-white shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-4 mb-14 relative z-10">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/40 font-black text-xl">D</div>
          <div>
            <h2 className="font-black text-lg tracking-tight leading-none">DIGIDESA</h2>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1 text-blue-400">Tegal Digital</p>
          </div>
        </div>
        <nav className="flex-1 space-y-2 relative z-10">
          <button className="w-full flex items-center justify-between px-5 py-4 bg-white/10 rounded-2xl font-bold text-white border border-white/5 shadow-inner">
            <div className="flex items-center gap-3"><FileText size={18} /> Antrean</div>
            <ChevronRight size={14} className="opacity-50" />
          </button>
          <button onClick={exportToCSV} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/5 rounded-2xl font-bold text-slate-400 hover:text-white transition-all group">
            <FileSpreadsheet size={18} className="group-hover:text-emerald-400" /> Export Data
          </button>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-5 py-4 text-slate-500 font-bold hover:text-red-400 mt-auto"><LogOut size={18} /> Logout</button>
      </aside>

      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-6">
          <div>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 mb-2">
              <RefreshCw size={12} className={loading || isSubmitting ? "animate-spin" : ""} /> Realtime Active
            </span>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Dashboard <span className="text-blue-600 underline decoration-blue-100 underline-offset-8">Admin</span></h1>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
            <div className="relative w-full md:w-64 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" size={16} />
              <input type="text" placeholder="Cari Nama / NIK..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all"/>
            </div>
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
              {['Semua', 'pending', 'ACC'].map((s) => (
                <button key={s} onClick={() => setFilter(s)} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${filter === s ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>{s.toUpperCase()}</button>
              ))}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, i) => (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} key={stat.label} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-sm`}><stat.icon size={24} /></div>
              <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p><p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p></div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-6 text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">Data Warga</th>
                  <th className="px-8 py-6 text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">Surat / Layanan</th>
                  <th className="px-8 py-6 text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">Status</th>
                  <th className="px-8 py-6 text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  [...Array(5)].map((_, i) => (<tr key={i} className="animate-pulse"><td colSpan={4} className="px-8 py-10 bg-slate-50/30"></td></tr>))
                ) : (
                  <AnimatePresence mode='popLayout'>
                    {filteredData.map((item) => (
                      <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }} key={item.id} className="hover:bg-blue-50/30 transition-all group">
                        <td className="px-8 py-8">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black group-hover:bg-blue-600 transition-all">{item.nama?.charAt(0)}</div>
                            <div><p className="font-black text-slate-900 tracking-tight">{item.nama}</p><p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase">NIK: {item.nik}</p></div>
                          </div>
                        </td>
                        <td className="px-8 py-8">
                          <div className="flex flex-col"><span className="text-sm font-black text-blue-600">{item.jenis_surat}</span><span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1"><Calendar size={12} /> {new Date(item.created_at).toLocaleDateString('id-ID')}</span></div>
                        </td>
                        <td className="px-8 py-8">
                          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${item.status === 'ACC' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'ACC' ? 'bg-emerald-500' : 'bg-amber-500'}`} /> {item.status}
                          </span>
                        </td>
                        <td className="px-8 py-8 text-right">
                          <div className="flex gap-2 justify-end">
                            {item.status === 'pending' && (
                              <button disabled={isSubmitting} onClick={() => handleUpdateStatus(item.id, 'ACC')} className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm" title="Approve"><CheckCircle size={18} /></button>
                            )}
                            <button onClick={() => handleEditPenandatangan(item)} className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all" title="Edit Penandatangan"><Edit2 size={18} /></button>
                            <button onClick={() => generatePDF(item)} className="p-3 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all" title="Cetak PDF"><FileDown size={18} /></button>
                            <button onClick={() => downloadBerkas(item)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all" title="Lihat Berkas"><Eye size={18} /></button>
                            <button disabled={isSubmitting} onClick={() => handleDelete(item.id)} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Edit Penandatangan */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="font-black text-lg text-slate-900">Edit Penanda Tangan</h3>
                  <p className="text-xs font-bold text-slate-500 mt-1">Nama ini akan tercetak di PDF</p>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nama Penanda Tangan</label>
                <input type="text" value={penandatangan} onChange={(e) => setPenandatangan(e.target.value)} placeholder="Contoh: JUMAROH / LUTFI FAIZAL" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all outline-none" />
                <p className="text-[10px] text-slate-400 font-bold mt-3 leading-relaxed">Biarkan kosong jika ingin tanda tangan diisi manual dengan pulpen setelah dicetak.</p>
              </div>
              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                <button onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-all">Batal</button>
                <button onClick={savePenandatangan} disabled={isSubmitting} className="px-5 py-2.5 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2">
                  {isSubmitting ? <RefreshCw size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                  Simpan Nama
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;