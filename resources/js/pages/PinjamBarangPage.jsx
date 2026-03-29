import React, { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Package, ArrowLeft, Sun, Moon, Info, CheckCircle2, AlertCircle, ClipboardList, LayoutGrid, ChevronDown, Menu, X } from "lucide-react";
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function PinjamBarangPage({ isDark, toggleDark }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // State untuk dialog per-card
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    // State untuk form standalone
    const [formData, setFormData] = useState({
        nik: '', nama_peminjam: '', nama_barang: '',
        jumlah: '1', tanggal_pinjam: '', tanggal_kembali: '', keterangan: ''
    });
    const [formFiles, setFormFiles] = useState(null);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [formSuccess, setFormSuccess] = useState(false);
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        setLoading(true);
        fetch('/api/inventaris')
            .then(res => res.json())
            .then(data => {
                setItems(data.items || []);
                setBookings(data.bookings || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    // Submit dari dialog per-card
    const handleBooking = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(false);
        const form = e.target;
        const fd = new FormData(form);

        const fileInput = form.querySelector('input[type="file"]');
        if (fileInput && fileInput.files.length > 0) {
            fd.delete('identitas[]');
            for (let i = 0; i < fileInput.files.length; i++) {
                const file = fileInput.files[i];
                if (file.type.startsWith('image/')) {
                    try {
                        const compressedFile = await imageCompression(file, { maxSizeMB: 0.1, maxWidthOrHeight: 800, useWebWorker: true });
                        fd.append('identitas[]', compressedFile, file.name);
                    } catch (err) {
                        fd.append('identitas[]', file);
                    }
                } else {
                    fd.append('identitas[]', file);
                }
            }
        }

        fetch('/api/inventaris/booking', {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: fd
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Terjadi kesalahan.');
                return data;
            })
            .then(() => {
                setSubmitting(false);
                setSuccess(true);
                e.target.reset();
                fetchData();
                setTimeout(() => setSuccess(false), 5000);
            })
            .catch(err => {
                setError(err.message);
                setSubmitting(false);
            });
    };

    // Submit dari form standalone
    const handleStandaloneSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitting(true);
        setFormError(null);
        setFormSuccess(false);

        const fd = new FormData();
        fd.append('nama_peminjam', formData.nama_peminjam);
        fd.append('nik', formData.nik);
        fd.append('jumlah', formData.jumlah);
        fd.append('tanggal_pinjam', formData.tanggal_pinjam);
        fd.append('tanggal_kembali', formData.tanggal_kembali);

        // Cari item berdasarkan nama
        const matchedItem = items.find(i =>
            i.nama_barang.toLowerCase().includes(formData.nama_barang.toLowerCase())
        );

        if (matchedItem) {
            fd.append('inventaris_id', matchedItem.id);
        } else if (items.length > 0) {
            // Jika tidak ditemukan tapi ada barang, kirim id pertama dan sertakan keterangan nama
            fd.append('inventaris_id', items[0].id);
        } else {
            // Jika tidak ada barang di database, kirim via email/WA alternatif
            setFormSubmitting(false);
            setFormError('Saat ini catalog barang belum tersedia. Hubungi kantor desa atau tunggu beberapa saat.');
            return;
        }

        if (formFiles) {
            for (let i = 0; i < formFiles.length; i++) {
                const file = formFiles[i];
                if (file.type.startsWith('image/')) {
                    try {
                        const compressedFile = await imageCompression(file, { maxSizeMB: 0.1, maxWidthOrHeight: 800, useWebWorker: true });
                        fd.append('identitas[]', compressedFile, file.name);
                    } catch (err) {
                        fd.append('identitas[]', file);
                    }
                } else {
                    fd.append('identitas[]', file);
                }
            }
        }

        fetch('/api/inventaris/booking', {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: fd
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Terjadi kesalahan.');
                return data;
            })
            .then(() => {
                setFormSubmitting(false);
                setFormSuccess(true);
                setFormData({ nik: '', nama_peminjam: '', nama_barang: '', jumlah: '1', tanggal_pinjam: '', tanggal_kembali: '', keterangan: '' });
                setFormFiles(null);
                e.target.reset();
                fetchData();
            })
            .catch(err => {
                setFormError(err.message);
                setFormSubmitting(false);
            });
    };

    return (
        <div className="flex flex-col min-h-screen bg-c-bg dark:bg-[#0F172A] font-sans selection:bg-fuchsia-500/30">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800/60 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md">
                <div className="container flex h-[72px] items-center px-4 md:px-6 mx-auto relative">
                    {/* Mobile: hamburger kiri */}
                    <button
                        className="md:hidden p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mr-2"
                        onClick={() => setMobileOpen(o => !o)}
                        aria-label="Toggle menu"
                    >
                        <Menu className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    </button>
                    {/* Logo - tengah di mobile, kiri di desktop */}
                    <div className="flex items-center gap-3 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:left-auto">
                        <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain fallback-logo bg-c-tertiary p-1 rounded-full" />
                        <span className="text-xl font-extrabold tracking-tight text-c-primary dark:text-white">Jawara Portal</span>
                    </div>
                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-8 ml-10">
                        <Link to="/" className="text-sm font-semibold text-c-primary border-b-2 border-c-primary pb-1 pt-1">Beranda</Link>
                        <div className="relative group pt-1">
                            <button className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors pb-1">
                                Layanan Digital <ChevronDown className="h-4 w-4" />
                            </button>
                            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-2.5 overflow-hidden translate-y-2 group-hover:translate-y-0">
                                <Link to="/layanan-surat" className="block px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Administrasi Surat</Link>
                                <Link to="/lapak-desa" className="block px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Lapak Desa</Link>
                                <Link to="/pinjam-barang" className="block px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors">Pinjam Barang</Link>
                                <Link to="/posyandu" className="block px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-red-600 dark:hover:text-red-400 transition-colors">Info Posyandu</Link>
                                <Link to="/barang-hilang" className="block px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Barang Hilang</Link>
                                <Link to="/social-aid" className="block px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Penerima Bantuan</Link>
                                <Link to="/finance" className="block px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Transparansi Keuangan</Link>
                                <div className="h-px w-full bg-slate-100 dark:bg-slate-800 my-1.5"></div>
                                <Link to="/report" className="block px-5 py-2.5 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">Layanan Pengaduan</Link>
                            </div>
                        </div>
                    </nav>
                    {/* Desktop dark mode */}
                    <div className="hidden md:flex items-center ml-auto">
                        <button onClick={toggleDark} className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Toggle dark mode">
                            {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
                        </button>
                    </div>
                </div>
            </header>
            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] md:hidden"
                        onClick={() => setMobileOpen(false)}
                    />
                    {/* Sidebar */}
                    <div className="fixed top-0 left-0 h-full w-[60%] max-w-[280px] bg-white dark:bg-[#0F172A] z-[70] shadow-2xl flex flex-col md:hidden">
                        {/* Sidebar header */}
                        <div className="flex items-center justify-between px-5 h-[72px] border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <img src="/logo.png" alt="Logo" className="h-8 w-auto object-contain bg-c-tertiary p-1 rounded-full" />
                                <span className="font-extrabold text-c-primary dark:text-white text-sm">Jawara Portal</span>
                            </div>
                            <button onClick={() => setMobileOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                            </button>
                        </div>
                        {/* Menu items */}
                        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
                            <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-c-primary dark:text-white bg-c-bg dark:bg-slate-800">Beranda</Link>
                            <p className="px-4 pt-3 pb-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Layanan Digital</p>
                            <Link to="/layanan-surat" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Administrasi Surat</Link>
                            <Link to="/lapak-desa" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Lapak Desa</Link>
                            <Link to="/pinjam-barang" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Pinjam Barang</Link>
                            <Link to="/posyandu" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Info Posyandu</Link>
                            <Link to="/barang-hilang" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Barang Hilang</Link>
                            <Link to="/social-aid" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Penerima Bantuan</Link>
                            <Link to="/finance" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Transparansi Keuangan</Link>
                            <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                            <Link to="/report" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10">Layanan Pengaduan</Link>
                        </div>
                        {/* Dark mode at bottom */}
                        <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-4">
                            <button
                                onClick={toggleDark}
                                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-500" />}
                                {isDark ? 'Mode Terang' : 'Mode Gelap'}
                            </button>
                        </div>
                    </div>
                </>
            )}
            {mobileOpen && (
                <>
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] md:hidden" onClick={() => setMobileOpen(false)} />
                    <div className="fixed top-0 left-0 h-full w-[60%] max-w-[280px] bg-white dark:bg-[#0F172A] z-[70] shadow-2xl flex flex-col md:hidden">
                        <div className="flex items-center justify-between px-5 h-[72px] border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <img src="/logo.png" alt="Logo" className="h-8 w-auto object-contain bg-c-tertiary p-1 rounded-full" />
                                <span className="font-extrabold text-c-primary dark:text-white text-sm">Jawara Portal</span>
                            </div>
                            <button onClick={() => setMobileOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
                            <Link to="/" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-semibold text-c-primary dark:text-white bg-c-bg dark:bg-slate-800">Beranda</Link>
                            <p className="px-4 pt-3 pb-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Layanan Digital</p>
                            <Link to="/layanan-surat" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Administrasi Surat</Link>
                            <Link to="/lapak-desa" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Lapak Desa</Link>
                            <Link to="/pinjam-barang" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Pinjam Barang</Link>
                            <Link to="/posyandu" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Info Posyandu</Link>
                            <Link to="/barang-hilang" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Barang Hilang</Link>
                            <Link to="/social-aid" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Penerima Bantuan</Link>
                            <Link to="/finance" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Transparansi Keuangan</Link>
                            <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                            <Link to="/report" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10">Layanan Pengaduan</Link>
                        </div>
                        <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-4">
                            <button onClick={toggleDark} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-500" />}
                                {isDark ? 'Mode Terang' : 'Mode Gelap'}
                            </button>
                        </div>
                    </div>
                </>
            )}

            <main className="flex-1 container px-4 sm:px-6 py-10 mx-auto space-y-10 max-w-6xl">

                {/* Header Copy */}
                <div className="space-y-2 text-center md:text-left">
                    <h2 className="text-3xl font-extrabold tracking-tight text-c-primary dark:text-white">Barang & Peralatan Desa</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base">Warga dapat meminjam peralatan desa untuk keperluan sosial/kemasyarakatan.</p>
                </div>

                {/* ===== FORM PEMINJAMAN STANDALONE ===== */}
                <Card className="border-none shadow-sm dark:shadow-none bg-white dark:bg-[#1E293B] rounded-3xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-fuchsia-500 to-purple-600"></div>
                    <CardHeader className="pb-4 pt-8 px-6 md:px-8">
                        <CardTitle className="flex items-center gap-3 text-xl font-bold text-c-primary dark:text-white">
                            <div className="p-2 bg-fuchsia-100 dark:bg-fuchsia-500/20 rounded-lg">
                                <ClipboardList className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-400" />
                            </div>
                            Form Pengajuan Peminjaman
                        </CardTitle>
                        <CardDescription className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                            Isi formulir di bawah untuk mengajukan peminjaman barang/peralatan desa.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 md:px-8 pb-8">
                        {formSuccess ? (
                            <div className="py-12 flex flex-col items-center justify-center gap-4 text-center bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
                                <div className="p-4 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                                    <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-c-primary dark:text-white">Permohonan Terkirim!</h3>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Admin akan menghubungi Anda untuk konfirmasi peminjaman.</p>
                                </div>
                                <Button variant="outline" onClick={() => setFormSuccess(false)} className="mt-4 font-bold rounded-xl border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                                    Ajukan Lagi
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleStandaloneSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="f_nik" className="text-slate-700 dark:text-slate-300 font-semibold">NIK Peminjam (opsional)</Label>
                                        <Input
                                            id="f_nik"
                                            placeholder="NIK sesuai KTP"
                                            value={formData.nik}
                                            onChange={e => setFormData(p => ({ ...p, nik: e.target.value }))}
                                            className="bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 focus-visible:ring-fuchsia-500 h-11 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="f_nama" className="text-slate-700 dark:text-slate-300 font-semibold">Nama Lengkap <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="f_nama"
                                            placeholder="Nama sesuai KTP"
                                            required
                                            value={formData.nama_peminjam}
                                            onChange={e => setFormData(p => ({ ...p, nama_peminjam: e.target.value }))}
                                            className="bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 focus-visible:ring-fuchsia-500 h-11 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="f_barang" className="text-slate-700 dark:text-slate-300 font-semibold">
                                            Nama Barang yang Dipinjam <span className="text-red-500">*</span>
                                        </Label>
                                        {items.length > 0 ? (
                                            <select
                                                id="f_barang"
                                                required
                                                className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-c-primary dark:text-slate-100"
                                                value={formData.nama_barang}
                                                onChange={e => setFormData(p => ({ ...p, nama_barang: e.target.value }))}
                                            >
                                                <option value="">-- Pilih Barang --</option>
                                                {items.map(item => (
                                                    <option key={item.id} value={item.nama_barang}>
                                                        {item.nama_barang} ({item.jumlah_tersedia} tersedia)
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <Input
                                                id="f_barang"
                                                placeholder="Contoh: Tenda, Kursi, Sound System..."
                                                required
                                                value={formData.nama_barang}
                                                onChange={e => setFormData(p => ({ ...p, nama_barang: e.target.value }))}
                                                className="bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 focus-visible:ring-fuchsia-500 h-11 rounded-xl"
                                            />
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="f_jumlah" className="text-slate-700 dark:text-slate-300 font-semibold">Jumlah <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="f_jumlah"
                                            type="number"
                                            min="1"
                                            required
                                            value={formData.jumlah}
                                            onChange={e => setFormData(p => ({ ...p, jumlah: e.target.value }))}
                                            className="bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 focus-visible:ring-fuchsia-500 h-11 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="f_mulai" className="text-slate-700 dark:text-slate-300 font-semibold">Tanggal Mulai Pinjam <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="f_mulai"
                                            type="date"
                                            required
                                            value={formData.tanggal_pinjam}
                                            onChange={e => setFormData(p => ({ ...p, tanggal_pinjam: e.target.value }))}
                                            className="bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 focus-visible:ring-fuchsia-500 h-11 rounded-xl text-c-primary dark:text-slate-100"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="f_kembali" className="text-slate-700 dark:text-slate-300 font-semibold">Tanggal Kembali <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="f_kembali"
                                            type="date"
                                            required
                                            value={formData.tanggal_kembali}
                                            onChange={e => setFormData(p => ({ ...p, tanggal_kembali: e.target.value }))}
                                            className="bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 focus-visible:ring-fuchsia-500 h-11 rounded-xl text-c-primary dark:text-slate-100"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="f_ktp" className="text-slate-700 dark:text-slate-300 font-semibold">
                                        Foto KTP / Kartu Identitas <span className="text-red-500">*</span>
                                        <span className="text-slate-500 font-normal ml-1 text-xs tracking-tight">(maks. 7 file)</span>
                                    </Label>
                                    <Input
                                        id="f_ktp"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        required
                                        className="bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 file:text-slate-700 dark:file:text-slate-300 cursor-pointer h-11 rounded-xl"
                                        onChange={e => {
                                            if (e.target.files.length > 7) {
                                                alert('Maksimal upload adalah 7 file.');
                                                e.target.value = '';
                                                return;
                                            }
                                            setFormFiles(e.target.files);
                                        }}
                                    />
                                </div>

                                {formError && (
                                    <div className="p-4 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 rounded-xl text-sm font-medium flex items-center gap-3 border border-red-200 dark:border-red-900/50">
                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                        {formError}
                                    </div>
                                )}

                                <Button type="submit" className="w-full md:w-auto bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold h-12 px-8 rounded-xl shadow-md lg:mt-4" disabled={formSubmitting}>
                                    {formSubmitting ? 'Mengirim...' : 'Ajukan Peminjaman'}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>

                {/* ===== CATALOG BARANG ===== */}
                <div className="mt-12 space-y-6">
                    <h3 className="text-xl font-extrabold flex items-center gap-3 text-c-primary dark:text-white">
                        <Package className="h-6 w-6 text-fuchsia-600 dark:text-fuchsia-500" />
                        Katalog Barang Tersedia
                    </h3>

                    {loading ? (
                        <div className="grid gap-6 md:grid-cols-3">
                            {[1, 2, 3].map(i => (
                                <Card key={i} className="animate-pulse border-none shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-[#1E293B]">
                                    <div className="h-48 bg-slate-100 dark:bg-slate-800" />
                                    <div className="p-5 space-y-3">
                                        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : items.length === 0 ? (
                        <div className="py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-[#1E293B]/50">
                            <Package className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                            <p className="text-c-primary dark:text-white font-bold text-lg">Catalog barang belum tersedia.</p>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Kamu tetap bisa mengajukan peminjaman via form di atas.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {items.map((item) => (
                                <Card key={item.id} className="overflow-hidden border-none shadow-sm dark:shadow-none bg-white dark:bg-[#1E293B] flex flex-col rounded-[1.5rem] group hover:shadow-lg transition-all duration-300">
                                    <div className="h-48 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                                        {item.foto_barang ? (
                                            <img src={`/storage/${item.foto_barang}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.nama_barang} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="h-16 w-16 text-slate-300 dark:text-slate-600" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 shadow-md">
                                            <Badge
                                                className={`border-none text-[10px] font-extrabold px-3 py-1.5 uppercase tracking-wider ${item.jumlah_tersedia > 0 ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}
                                            >
                                                {item.jumlah_tersedia > 0 ? `${item.jumlah_tersedia} Tersedia` : 'Habis'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardHeader className="p-5 space-y-1.5">
                                        <div className="text-[11px] text-fuchsia-600 dark:text-fuchsia-400 uppercase font-bold tracking-widest">{item.kode_barang}</div>
                                        <CardTitle className="text-[18px] font-bold text-c-primary dark:text-white">{item.nama_barang}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-5 pb-5 pt-0 flex-1">
                                        <div className="p-4 bg-slate-50 dark:bg-[#0F172A] rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-3">
                                            <div className="font-bold flex items-center gap-2 text-slate-700 dark:text-slate-300 uppercase tracking-wide text-[10px]">
                                                <Calendar className="h-3.5 w-3.5" /> Agenda Booking Terdekat
                                            </div>
                                            {bookings.filter(b => b.inventaris_id === item.id).length > 0 ? (
                                                <div className="space-y-2">
                                                    {bookings.filter(b => b.inventaris_id === item.id).slice(0, 2).map((b, i) => (
                                                        <div key={i} className="flex justify-between items-center text-slate-600 dark:text-slate-400 bg-white dark:bg-[#1E293B] p-2 rounded-lg text-[11px] font-medium border border-slate-200 dark:border-slate-700">
                                                            <span>{new Date(b.tanggal_pinjam).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(b.tanggal_kembali).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                                                            <span className="font-extrabold text-c-primary dark:text-white">({b.jumlah} Unit)</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-slate-500 dark:text-slate-500 italic font-medium py-1">Belum ada agenda booking.</div>
                                            )}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-5 pt-0">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    className={`w-full gap-2 h-11 rounded-xl font-bold shadow-sm transition-all ${item.jumlah_tersedia > 0 ? 'bg-fuchsia-600 hover:bg-fuchsia-700 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'}`}
                                                    disabled={item.jumlah_tersedia <= 0}
                                                    onClick={() => setSelectedItem(item)}
                                                >
                                                    <Calendar className="h-4 w-4" /> Booking Sekarang
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[500px] bg-white dark:bg-[#1E293B] border-none shadow-2xl rounded-2xl">
                                                <DialogHeader>
                                                    <DialogTitle className="text-xl font-extrabold text-c-primary dark:text-white">Formulir Peminjaman: <span className="text-fuchsia-600 dark:text-fuchsia-400">{selectedItem?.nama_barang}</span></DialogTitle>
                                                    <DialogDescription className="text-slate-500 dark:text-slate-400 font-medium pt-1">
                                                        Isi detail peminjaman. Upload foto KTP sebagai jaminan.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <form onSubmit={handleBooking} className="space-y-5 py-4">
                                                    <input type="hidden" name="inventaris_id" value={selectedItem?.id || ''} />
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="nik" className="text-slate-700 dark:text-slate-300 font-semibold">NIK Peminjam</Label>
                                                            <Input id="nik" name="nik" placeholder="NIK sesuai KTP" className="bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 focus-visible:ring-fuchsia-500 rounded-lg" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="nama_peminjam" className="text-slate-700 dark:text-slate-300 font-semibold">Nama Lengkap</Label>
                                                            <Input id="nama_peminjam" name="nama_peminjam" required placeholder="Nama Lengkap" className="bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 focus-visible:ring-fuchsia-500 rounded-lg" />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="jumlah" className="text-slate-700 dark:text-slate-300 font-semibold">Jumlah</Label>
                                                            <Input id="jumlah" name="jumlah" type="number" defaultValue="1" min="1" max={selectedItem?.jumlah_tersedia} required className="bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 focus-visible:ring-fuchsia-500 rounded-lg" />
                                                        </div>
                                                        <div className="space-y-2 col-span-2">
                                                            <Label htmlFor="identitas" className="text-slate-700 dark:text-slate-300 font-semibold">Foto KTP (Maks 7)</Label>
                                                            <Input
                                                                id="identitas"
                                                                name="identitas[]"
                                                                type="file"
                                                                multiple
                                                                accept="image/*"
                                                                required
                                                                className="bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 file:text-slate-700 dark:file:text-slate-300 cursor-pointer rounded-lg"
                                                                onChange={(e) => {
                                                                    if (e.target.files.length > 7) {
                                                                        alert('Maksimal 7 file.');
                                                                        e.target.value = '';
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="tanggal_pinjam" className="text-slate-700 dark:text-slate-300 font-semibold">Tgl Mulai</Label>
                                                            <Input id="tanggal_pinjam" name="tanggal_pinjam" type="date" required className="bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 focus-visible:ring-fuchsia-500 rounded-lg text-c-primary dark:text-slate-100" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="tanggal_kembali" className="text-slate-700 dark:text-slate-300 font-semibold">Tgl Kembali</Label>
                                                            <Input id="tanggal_kembali" name="tanggal_kembali" type="date" required className="bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 focus-visible:ring-fuchsia-500 rounded-lg text-c-primary dark:text-slate-100" />
                                                        </div>
                                                    </div>
                                                    <Button type="submit" className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold h-11 rounded-xl shadow-md mt-2" disabled={submitting}>
                                                        {submitting ? 'Mengirim...' : 'Ajukan Peminjaman'}
                                                    </Button>
                                                    {success && (
                                                        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm font-medium flex items-center justify-center gap-3 border border-emerald-200 dark:border-emerald-900/50">
                                                            <CheckCircle2 className="h-5 w-5" /> Berhasil diajukan! Tunggu konfirmasi.
                                                        </div>
                                                    )}
                                                    {error && (
                                                        <div className="p-4 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 rounded-xl text-sm font-medium flex items-center justify-center gap-3 border border-red-200 dark:border-red-900/50">
                                                            <AlertCircle className="h-5 w-5" /> {error}
                                                        </div>
                                                    )}
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Prosedur */}
                <div className="p-8 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] border-none shadow-sm dark:shadow-none flex flex-col md:flex-row gap-8 items-center mt-12 mb-4">
                    <div className="p-5 bg-c-secondary/10 dark:bg-c-secondary/20 rounded-2xl">
                        <Info className="h-10 w-10 text-c-secondary dark:text-blue-400" />
                    </div>
                    <div className="space-y-3 text-center md:text-left flex-1">
                        <h4 className="font-extrabold text-xl text-c-primary dark:text-white">Prosedur Peminjaman</h4>
                        <div className="text-[15px] font-medium text-slate-600 dark:text-slate-300 leading-relaxed grid gap-2 md:grid-cols-2">
                            <p className="flex items-start gap-2"><span className="font-bold text-c-secondary dark:text-blue-400">1.</span> Ajukan booking online melalui form di atas atau katalog.</p>
                            <p className="flex items-start gap-2"><span className="font-bold text-c-secondary dark:text-blue-400">2.</span> Admin akan melakukan pengecekan ketersediaan dan validasi data.</p>
                            <p className="flex items-start gap-2"><span className="font-bold text-c-secondary dark:text-blue-400">3.</span> Ambil barang di kantor desa pada hari yang ditentukan dengan membawa KTP asli.</p>
                            <p className="flex items-start gap-2"><span className="font-bold text-c-secondary dark:text-blue-400">4.</span> Pastikan barang dikembalikan sesuai jadwal dalam kondisi awal.</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-[#7AAACE]/20 dark:border-slate-800/80 bg-white dark:bg-[#0F172A] mt-auto">
                <div className="container px-6 py-6 flex flex-col md:flex-row items-center justify-between mx-auto">
                    <div className="flex items-center gap-2 mb-3 md:mb-0">
                        <img src="/logo.png" alt="Logo" className="h-6 w-auto object-contain fallback-logo bg-c-tertiary p-0.5 rounded-full" />
                        <span className="text-sm font-bold text-[#355872] dark:text-slate-300 tracking-tight">Jawara Portal</span>
                    </div>
                    <div className="text-sm font-medium text-slate-400">
                        © {new Date().getFullYear()} JAWARA. Hak Cipta Dilindungi Undang-Undang.
                    </div>
                </div>
            </footer>
        </div>
    );
}
