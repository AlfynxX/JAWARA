import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Send, Search, CheckCircle2, Clock, XCircle, Download, ArrowLeft, Sun, Moon, LayoutGrid, ChevronDown, Menu, X } from "lucide-react";
import { Link } from 'react-router-dom';

export default function LayananSuratPage({ isDark, toggleDark }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [nik, setNik] = useState('');
    const [statusData, setStatusData] = useState([]);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const checkStatus = () => {
        if (!nik) return;
        setLoadingStatus(true);
        fetch(`/api/permohonan-surat?nik=${nik}`)
            .then(res => res.json())
            .then(data => {
                setStatusData(data);
                setLoadingStatus(false);
            })
            .catch(err => {
                console.error(err);
                setLoadingStatus(false);
            });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(false);
        const form = e.target;
        const formData = new FormData(form);

        const fileInput = form.querySelector('input[type="file"]');
        if (fileInput && fileInput.files.length > 0) {
            formData.delete('dokumen[]');
            for (let i = 0; i < fileInput.files.length; i++) {
                const file = fileInput.files[i];
                if (file.type.startsWith('image/')) {
                    try {
                        const compressedFile = await imageCompression(file, { maxSizeMB: 0.1, maxWidthOrHeight: 800, useWebWorker: true });
                        formData.append('dokumen[]', compressedFile, file.name);
                    } catch (err) {
                        formData.append('dokumen[]', file);
                    }
                } else {
                    formData.append('dokumen[]', file);
                }
            }
        }

        fetch('/api/permohonan-surat', {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: formData
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || 'Terjadi kesalahan saat mengirim permohonan.');
                }
                return data;
            })
            .then(data => {
                setSubmitting(false);
                setSuccess(true);
                e.target.reset();
                setTimeout(() => setSuccess(false), 5000);
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
                setSubmitting(false);
            });
    };

    return (
        <div className="flex flex-col min-h-screen bg-c-bg dark:bg-[#0F172A] font-sans selection:bg-c-secondary/30">
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

            <main className="flex-1 container px-4 py-8 mx-auto grid gap-8 md:grid-cols-2 max-w-6xl">
                {/* Form Request */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-extrabold tracking-tight text-c-primary dark:text-white">Buat Permohonan Baru</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Pilih jenis surat dan lengkapi data diri Anda.</p>
                    </div>

                    <Card className="border-none shadow-sm dark:shadow-none bg-white dark:bg-[#1E293B] rounded-2xl overflow-hidden">
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid gap-2">
                                    <Label htmlFor="nama_pemohon" className="text-slate-700 dark:text-slate-300 font-semibold">Nama Lengkap</Label>
                                    <Input id="nama_pemohon" name="nama_pemohon" required placeholder="Masukkan nama sesuai KTP" className="bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="nik" className="text-slate-700 dark:text-slate-300 font-semibold">NIK (Opsional)</Label>
                                        <Input id="nik" name="nik" placeholder="16 digit NIK" className="bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="nomor_wa" className="text-slate-700 dark:text-slate-300 font-semibold">Nomor WhatsApp</Label>
                                        <Input id="nomor_wa" name="nomor_wa" required placeholder="08xxx" className="bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500" />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="jenis_surat" className="text-slate-700 dark:text-slate-300 font-semibold">Jenis Surat</Label>
                                    <Input id="jenis_surat" name="jenis_surat" required placeholder="Contoh: SKTM, Surat Domisili, dll" className="bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="keperluan" className="text-slate-700 dark:text-slate-300 font-semibold">Keperluan / Tujuan</Label>
                                    <Textarea id="keperluan" name="keperluan" required placeholder="Jelaskan tujuan pembuatan surat ini" className="bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500 min-h-[100px]" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="dokumen" className="text-slate-700 dark:text-slate-300 font-semibold">Foto Persyaratan (KTP/KK) - Maks 7 File</Label>
                                    <Input
                                        id="dokumen"
                                        name="dokumen[]"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 file:text-slate-700 dark:file:text-slate-300 cursor-pointer"
                                        onChange={(e) => {
                                            if (e.target.files.length > 7) {
                                                alert("Maksimal upload adalah 7 file.");
                                                e.target.value = "";
                                            }
                                        }}
                                    />
                                    <p className="text-[11px] text-slate-500 font-medium">Pilih maksimal 7 file gambar.</p>
                                </div>
                                <Button type="submit" className="w-full bg-c-primary hover:bg-blue-700 text-white font-bold h-11 rounded-xl shadow-md" disabled={submitting}>
                                    {submitting ? "Mengirim..." : (
                                        <>
                                            <Send className="mr-2 h-4 w-4" /> Kirim Permohonan
                                        </>
                                    )}
                                </Button>
                                {success && (
                                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm font-medium flex items-center gap-3 border border-emerald-200 dark:border-emerald-900/50">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                        Permohonan berhasil dikirim! Silakan cek status di menu sebelah.
                                    </div>
                                )}
                                {error && (
                                    <div className="p-4 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 rounded-xl text-sm font-medium flex items-center gap-3 border border-red-200 dark:border-red-900/50">
                                        <XCircle className="h-5 w-5 text-red-500" />
                                        {error}
                                    </div>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Status Tracking */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-extrabold tracking-tight text-c-primary dark:text-white">Lacak Status Surat</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Masukkan NIK atau No. WA untuk melihat riwayat pengajuan.</p>
                    </div>

                    <Card className="border-none shadow-sm dark:shadow-none bg-white dark:bg-[#1E293B] rounded-2xl overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Ketik NIK atau WhatsApp"
                                        value={nik}
                                        onChange={(e) => setNik(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && checkStatus()}
                                        className="pl-9 bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500 h-11"
                                    />
                                </div>
                                <Button onClick={checkStatus} disabled={loadingStatus} className="h-11 px-6 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 font-bold rounded-xl shadow-sm">
                                    {loadingStatus ? <Clock className="animate-spin h-4 w-4" /> : "Cek Status"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4 pt-2">
                        <h3 className="font-bold text-slate-700 dark:text-slate-300 px-1 text-sm uppercase tracking-wider">Riwayat Pengajuan</h3>
                        {statusData.length > 0 ? (
                            statusData.map((item, idx) => (
                                <Card key={idx} className="overflow-hidden border-none shadow-sm dark:shadow-none bg-white dark:bg-[#1E293B] rounded-2xl relative">
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-c-secondary"></div>
                                    <CardContent className="p-5 pl-6 flex justify-between items-center">
                                        <div className="space-y-1.5">
                                            <div className="font-extrabold text-c-primary dark:text-white">{item.jenis_surat}</div>
                                            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                                <Clock className="h-3.5 w-3.5" />
                                                {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </div>
                                            <div className="mt-3">
                                                <span className={`px-2.5 py-1 rounded-full text-[11px] uppercase font-bold ${item.status === 'selesai' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' :
                                                    item.status === 'diproses' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400' :
                                                        item.status === 'ditolak' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' :
                                                            'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        </div>
                                        {item.status === 'selesai' && item.file_hasil && (
                                            <a
                                                href={`/storage/${item.file_hasil}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-blue-50 dark:bg-c-secondary/10 text-c-secondary dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-c-secondary/20 transition-colors"
                                            >
                                                <Download className="h-5 w-5" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">Unduh</span>
                                            </a>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-16 text-slate-500 dark:text-slate-400 font-medium border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                                {nik ? "Data permohonan tidak ditemukan." : "Masukkan data di atas untuk melacak."}
                            </div>
                        )}
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
