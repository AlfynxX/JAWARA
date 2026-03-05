import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Calendar, Users, Phone, Bell, ArrowLeft, Sun, Moon, CheckCircle2, Activity, Clock, XCircle, LayoutGrid, ChevronDown, Menu, X } from "lucide-react";
import { Link } from 'react-router-dom';

export default function PosyanduPage({ isDark, toggleDark }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [stats, setStats] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch stats (reuse generic stats for schedules)
        fetch('/api/stats')
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error(err));
    }, []);

    const handleRegister = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(false);
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        // Add manual select values since they are not standard form elements in Shadcn
        data.kategori = e.target.querySelector('[name="kategori"]')?.value || 'balita';

        fetch('/api/posyandu/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || 'Terjadi kesalahan saat mendaftar.');
                }
                return data;
            })
            .then(res => {
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
        <div className="flex flex-col min-h-screen bg-c-bg dark:bg-[#0F172A] font-sans selection:bg-rose-500/30">
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

            <main className="flex-1 container px-4 py-10 mx-auto grid gap-10 lg:grid-cols-2 max-w-6xl">
                {/* Info Section */}
                <div className="space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-extrabold tracking-tight text-c-primary dark:text-white leading-tight">Kesehatan Warga <br className="hidden md:block" /> Adalah Prioritas</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-md">Daftarkan balita atau lansia untuk mendapatkan pemantauan kesehatan rutin dan notifikasi jadwal posyandu via WhatsApp.</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="bg-white dark:bg-[#1E293B] border-none shadow-sm dark:shadow-none rounded-2xl overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="h-1.5 w-full bg-c-secondary"></div>
                            <CardHeader className="pb-2 p-5">
                                <div className="p-2.5 bg-blue-50 dark:bg-c-secondary/10 rounded-xl w-fit mb-2">
                                    <Users className="h-6 w-6 text-c-secondary" />
                                </div>
                                <CardTitle className="text-lg font-bold text-c-primary dark:text-white">Balita</CardTitle>
                            </CardHeader>
                            <CardContent className="px-5 pb-5 pt-0">
                                <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Imunisasi, timbang berat badan, dan konsultasi gizi rutin setiap bulan.</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-[#1E293B] border-none shadow-sm dark:shadow-none rounded-2xl overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="h-1.5 w-full bg-emerald-500"></div>
                            <CardHeader className="pb-2 p-5">
                                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl w-fit mb-2">
                                    <Activity className="h-6 w-6 text-emerald-500" />
                                </div>
                                <CardTitle className="text-lg font-bold text-c-primary dark:text-white">Lansia</CardTitle>
                            </CardHeader>
                            <CardContent className="px-5 pb-5 pt-0">
                                <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Pengecekan tekanan darah, gula darah, dan senam lansia rutin.</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="border-none shadow-sm dark:shadow-none bg-white dark:bg-[#1E293B] rounded-[1.5rem] overflow-hidden">
                        <CardHeader className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 p-5">
                            <CardTitle className="flex items-center gap-3 text-lg font-bold text-c-primary dark:text-white">
                                <Calendar className="h-5 w-5 text-rose-500" /> Jadwal Mendatang
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 space-y-4">
                            {stats?.schedules?.filter(s => s.recipient_type === 'citizen').length > 0 ? (
                                stats.schedules.map((s, i) => (
                                    <div key={i} className="flex gap-4 p-4 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-rose-200 dark:hover:border-rose-900/50 hover:bg-rose-50/30 dark:hover:bg-rose-900/10 transition-colors group">
                                        <div className="flex flex-col items-center justify-center bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl min-w-[65px] h-[65px] shrink-0">
                                            <span className="text-[10px] font-bold uppercase tracking-widest">{new Date(s.start_time).toLocaleDateString('id-ID', { month: 'short' })}</span>
                                            <span className="text-2xl font-black leading-none">{new Date(s.start_time).getDate()}</span>
                                        </div>
                                        <div className="space-y-1.5 pt-0.5">
                                            <div className="font-bold text-[15px] text-c-primary dark:text-white leading-tight">{s.title}</div>
                                            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                                                <Clock className="h-3.5 w-3.5" />
                                                {new Date(s.start_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                            </div>
                                            <div className="text-[12px] text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
                                                <LayoutGrid className="h-3 w-3" />
                                                {s.location || 'Posyandu Desa'}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 px-4 text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl font-medium">
                                    Belum ada jadwal posyandu mendatang. <br className="hidden sm:block" /> Silakan cek kembali nanti.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Registration Form */}
                <div className="lg:sticky lg:top-28 h-fit">
                    <Card className="border-none shadow-sm dark:shadow-none bg-white dark:bg-[#1E293B] rounded-3xl overflow-hidden relative">
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 to-pink-500"></div>
                        <CardHeader className="pb-4 pt-8 px-6 md:px-8">
                            <CardTitle className="flex items-center gap-3 text-xl font-bold text-c-primary dark:text-white">
                                <div className="p-2 bg-rose-100 dark:bg-rose-500/20 rounded-lg">
                                    <Bell className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                                </div>
                                Daftar Notifikasi Posyandu
                            </CardTitle>
                            <CardDescription className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                                Dapatkan pengingat H-1 melalui WhatsApp untuk jadwal posyandu, cek status kesehatan, dan agenda imunisasi.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 md:px-8 pb-8">
                            {success ? (
                                <div className="py-8 flex flex-col items-center justify-center gap-4 text-center bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
                                    <div className="p-4 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                                        <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-c-primary dark:text-white">Pendaftaran Berhasil!</h3>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 max-w-[250px] mx-auto">Sistem akan mengirimkan pesan konfirmasi ke nomor WhatsApp Anda.</p>
                                    </div>
                                    <Button variant="outline" onClick={() => setSuccess(false)} className="mt-2 font-bold rounded-xl border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                                        Daftar Lagi
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="nama_sasaran" className="text-slate-700 dark:text-slate-300 font-semibold">Nama Balita / Lansia</Label>
                                        <Input id="nama_sasaran" name="nama_sasaran" required placeholder="Nama lengkap" className="bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 focus-visible:ring-rose-500 h-11 rounded-xl" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="kategori" className="text-slate-700 dark:text-slate-300 font-semibold">Kategori</Label>
                                            <select name="kategori" id="kategori" className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 text-c-primary dark:text-slate-100">
                                                <option value="balita">Balita</option>
                                                <option value="lansia">Lansia</option>
                                            </select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="tanggal_lahir" className="text-slate-700 dark:text-slate-300 font-semibold">Tanggal Lahir</Label>
                                            <Input id="tanggal_lahir" name="tanggal_lahir" type="date" required className="bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 focus-visible:ring-rose-500 h-11 rounded-xl text-c-primary dark:text-slate-100" />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="wali" className="text-slate-700 dark:text-slate-300 font-semibold">Nama Orang Tua / Wali</Label>
                                        <Input id="wali" name="wali" placeholder="Nama penanggung jawab" className="bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 focus-visible:ring-rose-500 h-11 rounded-xl" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="nomor_wa" className="text-slate-700 dark:text-slate-300 font-semibold">Nomor WhatsApp Aktif</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input id="nomor_wa" name="nomor_wa" required placeholder="08xxxxxxxxxx" className="pl-10 bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 focus-visible:ring-rose-500 h-11 rounded-xl" />
                                        </div>
                                        <p className="text-[11px] text-slate-500 font-medium">Pastikan nomor aktif untuk menerima pengingat otomatis.</p>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="nik" className="text-slate-700 dark:text-slate-300 font-semibold">NIK Pendaftar (Opsional)</Label>
                                        <Input id="nik" name="nik" placeholder="Untuk pendataan otomatis warga" className="bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 focus-visible:ring-rose-500 h-11 rounded-xl" />
                                    </div>
                                    <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold h-12 rounded-xl shadow-md mt-4" disabled={submitting}>
                                        {submitting ? "Mendaftarkan..." : "Daftarkan Sekarang"}
                                    </Button>

                                    {error && (
                                        <div className="p-4 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 rounded-xl text-sm font-medium border border-red-200 dark:border-red-900/50 flex items-start gap-3 mt-4">
                                            <XCircle className="h-5 w-5 mt-0.5 shrink-0 text-red-500" />
                                            <span>
                                                <strong className="block mb-0.5">Pendaftaran Gagal</strong>
                                                {error}
                                            </span>
                                        </div>
                                    )}
                                </form>
                            )}
                        </CardContent>
                    </Card>
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
