import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    ArrowLeft, Send, AlertCircle, MessageCircle,
    Clock, Search, Loader2, History, ChevronDown,
    MapPin, Camera, X, Moon, Sun, LayoutGrid, CheckCircle2, ShieldAlert, Menu
} from "lucide-react";
import { Link } from 'react-router-dom';

const STATUS_COLOR = {
    pending: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/20 border-amber-200 dark:border-amber-900',
    in_process: 'text-c-secondary dark:text-blue-400 bg-blue-100 dark:bg-c-secondary/20 border-blue-200 dark:border-blue-900',
    resolved: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20 border-emerald-200 dark:border-emerald-900',
    rejected: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/20 border-red-200 dark:border-red-900',
};

const STATUS_LABEL = {
    pending: 'Menunggu',
    in_process: 'Sedang Diproses',
    resolved: 'Selesai',
    rejected: 'Ditolak',
};

export default function ReportPage({ isDark, toggleDark }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', subject: '', description: '', nik: '' });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [location, setLocation] = useState({ latitude: null, longitude: null, address: null, loading: false, error: null });

    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // NIK-based history tracking
    const [trackName, setTrackName] = useState('');
    const [reports, setReports] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [historyLoaded, setHistoryLoaded] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const chatEndRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (showHistory) {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [reports, showHistory]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setErrorMsg("Ukuran gambar terlalu besar (Maks 2MB)");
                return;
            }
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleGetLocation = () => {
        setLocation(prev => ({ ...prev, loading: true, error: null }));

        if (!navigator.geolocation) {
            setLocation(prev => ({ ...prev, loading: false, error: "Geolocation tidak didukung browser ini." }));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({
                    latitude,
                    longitude,
                    address: `Lat: ${latitude.toFixed(6)}, Long: ${longitude.toFixed(6)}`, // Placeholder until geocoding
                    loading: false,
                    error: null
                });
            },
            (error) => {
                let msg = "Gagal mengambil lokasi.";
                if (error.code === 1) msg = "Izin lokasi ditolak.";
                else if (error.code === 2) msg = "Lokasi tidak tersedia.";
                else if (error.code === 3) msg = "Waktu permintaan habis.";
                setLocation(prev => ({ ...prev, loading: false, error: msg }));
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSuccessMsg('');
        setErrorMsg('');

        const data = new FormData();
        data.append('name', formData.name);
        data.append('subject', formData.subject);
        data.append('description', formData.description);
        if (formData.nik) data.append('nik', formData.nik);
        if (image) data.append('image', image);
        if (location.latitude) data.append('latitude', location.latitude);
        if (location.longitude) data.append('longitude', location.longitude);
        if (location.address) data.append('location_address', location.address);

        fetch('/api/reports', {
            method: 'POST',
            body: data,
        })
            .then(async res => {
                const json = await res.json();
                if (!res.ok) {
                    // Handle validation errors (422) or other server errors
                    setErrorMsg(json.message || 'Gagal mengirim laporan. Periksa kembali data Anda.');
                    setSubmitting(false);
                    return;
                }
                if (json.report) {
                    setSuccessMsg('Laporan berhasil dikirim! Admin desa akan meninjau laporan Anda.');
                    setFormData({ name: '', subject: '', description: '', nik: '' });
                    removeImage();
                    setLocation({ latitude: null, longitude: null, address: null, loading: false, error: null });
                } else {
                    setErrorMsg(json.message || 'Gagal mengirim laporan.');
                }
                setSubmitting(false);
            })
            .catch(() => {
                setErrorMsg('Terjadi kesalahan koneksi. Silakan coba lagi.');
                setSubmitting(false);
            });
    };

    const handleTrackHistory = (e) => {
        e.preventDefault();
        setLoadingHistory(true);
        fetch(`/api/reports?name=${encodeURIComponent(trackName)}`)
            .then(res => res.json())
            .then(data => {
                setReports(Array.isArray(data) ? data : []);
                setHistoryLoaded(true);
                setLoadingHistory(false);
            })
            .catch(() => setLoadingHistory(false));
    };

    return (
        <div className="flex flex-col min-h-screen bg-c-bg dark:bg-[#0F172A] font-sans selection:bg-amber-500/30">
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

            <main className="flex-1 container max-w-4xl px-4 py-8 mx-auto space-y-8">
                <div className="space-y-2 text-center md:text-left mb-6">
                    <h1 className="text-3xl font-extrabold tracking-tight text-c-primary dark:text-white">Sampaikan Laporan Anda</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base">Laporkan masalah, keluhan, atau aspirasi Anda secara aman ke Pemerintah Desa.</p>
                </div>

                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Submit Report Form - Takes up 3 columns on large screens */}
                    <div className="lg:col-span-3 space-y-6">
                        <Card className="border-none shadow-sm dark:shadow-none bg-white dark:bg-[#1E293B] rounded-[1.5rem] overflow-hidden relative">
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 to-orange-500"></div>

                            <CardHeader className="p-6 md:p-8 pb-4">
                                <CardTitle className="text-xl font-bold text-c-primary dark:text-white flex items-center gap-2">
                                    <MessageCircle className="h-5 w-5 text-amber-500" />
                                    Formulir Laporan Baru
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="px-6 md:px-8 pb-4">
                                {successMsg ? (
                                    <div className="py-10 flex flex-col items-center justify-center gap-4 text-center">
                                        <div className="p-4 bg-emerald-100 dark:bg-emerald-900/50 rounded-full animate-in zoom-in duration-300">
                                            <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-c-primary dark:text-white">Laporan Berhasil Terkirim!</h3>
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 max-w-[300px] mx-auto leading-relaxed">{successMsg}</p>
                                        </div>
                                        <Button variant="outline" onClick={() => setSuccessMsg('')} className="mt-4 font-bold rounded-xl border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                                            Kirim Laporan Lain
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-semibold">Nama Lengkap <span className="text-red-500">*</span></Label>
                                                <Input
                                                    id="name"
                                                    placeholder="Masukkan nama Anda"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    required
                                                    className="bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 focus-visible:ring-amber-500 h-11 rounded-xl shadow-sm"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="subject" className="text-slate-700 dark:text-slate-300 font-semibold">Subjek / Judul <span className="text-red-500">*</span></Label>
                                                <Input
                                                    id="subject"
                                                    placeholder="Contoh: Jalan berlubang"
                                                    value={formData.subject}
                                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                                    required
                                                    className="bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 focus-visible:ring-amber-500 h-11 rounded-xl shadow-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description" className="text-slate-700 dark:text-slate-300 font-semibold">Keterangan Detail <span className="text-red-500">*</span></Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Ceritakan kejadian atau keluhan Anda secara rinci di sini..."
                                                className="min-h-[120px] resize-none bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 focus-visible:ring-amber-500 rounded-xl shadow-sm p-4 text-base"
                                                value={formData.description}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            {/* Image Upload */}
                                            <div className="space-y-2">
                                                <Label className="text-slate-700 dark:text-slate-300 font-semibold">Bukti Foto (Opsional)</Label>
                                                <div className="flex flex-col gap-2">
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="hidden"
                                                        id="image-upload"
                                                    />

                                                    {!imagePreview ? (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="w-full h-[100px] border-dashed border-2 flex flex-col gap-2 items-center justify-center text-slate-400 hover:text-amber-500 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-xl transition-all"
                                                            onClick={() => fileInputRef.current?.click()}
                                                        >
                                                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                                <Camera className="h-5 w-5" />
                                                            </div>
                                                            <span className="text-xs font-semibold">Pilih Foto</span>
                                                        </Button>
                                                    ) : (
                                                        <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 h-[100px] group shadow-sm">
                                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                                <Button
                                                                    type="button"
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    className="font-bold rounded-lg shadow-lg gap-2"
                                                                    onClick={removeImage}
                                                                >
                                                                    <X className="h-4 w-4" /> Hapus
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Location */}
                                            <div className="space-y-2">
                                                <Label className="text-slate-700 dark:text-slate-300 font-semibold">Lokasi Terkini (Opsional)</Label>
                                                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50 dark:bg-[#0F172A] h-[100px] flex flex-col justify-center">
                                                    {!location.latitude ? (
                                                        <div className="text-center space-y-3">
                                                            <p className="text-xs text-slate-500 font-medium">Bantu kami menemukan lokasi akurat</p>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={handleGetLocation}
                                                                disabled={location.loading}
                                                                className="h-9 gap-2 w-full font-bold rounded-lg border-slate-300 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-colors"
                                                            >
                                                                {location.loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MapPin className="h-3.5 w-3.5" />}
                                                                Bagikan Lokasi
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                                                    <CheckCircle2 className="h-3.5 w-3.5" /> Tersemat
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-6 px-2 text-[10px] uppercase font-bold text-slate-500 hover:text-c-primary"
                                                                    onClick={handleGetLocation}
                                                                >
                                                                    Perbarui
                                                                </Button>
                                                            </div>
                                                            <div className="text-[10px] bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 font-mono truncate text-slate-600 dark:text-slate-300 shadow-sm">
                                                                {location.latitude}, {location.longitude}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {location.error && (
                                                        <p className="text-[10px] text-red-500 font-medium mt-2 text-center">{location.error}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2 pt-2">
                                            <Label htmlFor="nik" className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                                                <span className="text-slate-700 dark:text-slate-300 font-semibold">NIK KTP Kamu</span>
                                                <span className="text-[11px] text-slate-500 font-medium">(Opsional — Diperlukan jika ingin melacak progres laporan)</span>
                                            </Label>
                                            <Input
                                                id="nik"
                                                name="nik"
                                                placeholder="Contoh: 3201..."
                                                value={formData.nik}
                                                onChange={e => setFormData({ ...formData, nik: e.target.value })}
                                                className="bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 focus-visible:ring-amber-500 h-11 rounded-xl shadow-sm"
                                            />
                                        </div>

                                        {errorMsg && (
                                            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-800 dark:text-red-400 text-sm font-medium">
                                                <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                                                <span className="leading-relaxed">{errorMsg}</span>
                                            </div>
                                        )}

                                        <Button type="submit" className="w-full gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold h-12 rounded-xl shadow-md mt-4 text-base" disabled={submitting}>
                                            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                                            {submitting ? 'Mengirim...' : 'Kirim Pengaduan'}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                            <CardFooter className="bg-slate-50 dark:bg-[#0F172A]/50 border-t border-slate-100 dark:border-slate-800/80 p-4">
                                <p className="text-xs text-slate-500 font-medium flex items-center justify-center w-full gap-2">
                                    <ShieldAlert className="h-3.5 w-3.5" />
                                    Data diri dan laporan dirahasiakan
                                </p>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Track Report Section - Takes up 2 columns */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-none shadow-sm dark:shadow-none bg-white dark:bg-[#1E293B] rounded-[1.5rem] overflow-hidden lg:sticky lg:top-24">
                            <CardHeader
                                className="p-6 border-b border-slate-100 dark:border-slate-800 cursor-pointer lg:cursor-default"
                                onClick={() => {
                                    // Make it collapsible only on mobile/tablet
                                    if (window.innerWidth < 1024) setShowHistory(!showHistory);
                                }}
                            >
                                <CardTitle className="text-lg font-bold text-c-primary dark:text-white flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <History className="h-5 w-5 text-slate-400" />
                                        Lacak Laporan
                                    </span>
                                    <ChevronDown className={`h-5 w-5 text-slate-400 lg:hidden transition-transform ${showHistory ? 'rotate-180' : ''}`} />
                                </CardTitle>
                                <p className="text-[13px] text-slate-500 font-medium mt-1">Cari berdasarkan Nama atau Judul.</p>
                            </CardHeader>

                            <div className={`p-6 ${!showHistory ? 'hidden lg:block' : 'block'}`}>
                                <form onSubmit={handleTrackHistory} className="flex gap-2 mb-6">
                                    <Input
                                        placeholder="Ketik kata kunci..."
                                        value={trackName}
                                        onChange={e => setTrackName(e.target.value)}
                                        required
                                        className="bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 focus-visible:ring-slate-400 rounded-xl"
                                    />
                                    <Button type="submit" disabled={loadingHistory} className="gap-2 shrink-0 rounded-xl bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 font-bold">
                                        {loadingHistory ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                    </Button>
                                </form>

                                {historyLoaded && (
                                    reports.length === 0 ? (
                                        <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-[#0F172A]/50">
                                            <Search className="h-10 w-10 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                                            <p className="text-[13px] font-medium text-slate-500">
                                                Tidak ada laporan yang cocok.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                            {reports.map((report, idx) => (
                                                <div key={idx} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1E293B] shadow-sm space-y-3 relative group">
                                                    <div className="absolute top-4 right-4">
                                                        <span className={`text-[10px] font-extrabold uppercase px-2 py-1 rounded-md border ${STATUS_COLOR[report.status] || 'text-slate-500 border-slate-200'}`}>
                                                            {STATUS_LABEL[report.status] || report.status}
                                                        </span>
                                                    </div>

                                                    <div className="pr-20">
                                                        <h4 className="font-bold text-c-primary dark:text-white text-sm line-clamp-1">{report.title}</h4>
                                                        <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{report.content}</p>
                                                    </div>

                                                    {report.admin_response && (
                                                        <div className="bg-slate-50 dark:bg-[#0F172A] border border-slate-100 dark:border-slate-800 rounded-xl p-3 text-sm mt-3 relative before:absolute before:left-3 before:-top-1.5 before:w-3 before:h-3 before:bg-slate-50 dark:before:bg-[#0F172A] before:border-t before:border-l before:border-slate-100 dark:before:border-slate-800 before:rotate-45">
                                                            <div className="font-bold text-slate-700 dark:text-slate-300 text-[11px] mb-1 flex items-center gap-1.5">
                                                                <ShieldAlert className="h-3 w-3" /> Balasan Admin:
                                                            </div>
                                                            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{report.admin_response}</p>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                                                        <Clock className="h-3 w-3" />
                                                        {new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </div>
                                                </div>
                                            ))}
                                            <div ref={chatEndRef} />
                                        </div>
                                    )
                                )}
                            </div>
                        </Card>
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

            {/* Styles for custom scrollbar hidden in normal classes */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 20px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #334155;
                }
            `}} />
        </div>
    );
}
