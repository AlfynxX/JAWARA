import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, MapPin, Search, Plus, MessageCircle, ArrowLeft, Sun, Moon, Info, Camera, Calendar, AlertTriangle, LayoutGrid, CheckCircle2, XCircle, ChevronDown, Menu } from "lucide-react";
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function BarangHilangPage({ isDark, toggleDark }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('semua');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = () => {
        setLoading(true);
        fetch('/api/laporan-kehilangan')
            .then(res => res.json())
            .then(data => {
                setReports(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(false);
        const formData = new FormData(e.target);

        fetch('/api/laporan-kehilangan', {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: formData
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || 'Terjadi kesalahan saat mengirim laporan.');
                }
                return data;
            })
            .then(data => {
                setSubmitting(false);
                setSuccess(true);
                e.target.reset();
                fetchReports();
                setTimeout(() => setSuccess(false), 5000);
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
                setSubmitting(false);
            });
    };

    const filteredReports = activeTab === 'semua'
        ? reports
        : reports.filter(r => r.jenis_laporan === activeTab);

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

            <main className="flex-1 container px-4 sm:px-6 py-8 mx-auto max-w-7xl">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-8">
                    <div className="flex p-1.5 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl w-full md:w-fit overflow-x-auto">
                        <Button
                            variant={activeTab === 'semua' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('semua')}
                            className={`rounded-lg px-4 h-9 font-bold transition-all ${activeTab === 'semua' ? 'bg-white dark:bg-slate-700 text-c-primary dark:text-white shadow-sm' : 'text-slate-500 hover:text-c-primary dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'}`}
                        >
                            Semua
                        </Button>
                        <Button
                            variant={activeTab === 'kehilangan' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('kehilangan')}
                            className={`rounded-lg px-4 gap-2 h-9 font-bold transition-all ${activeTab === 'kehilangan' ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-sm' : 'text-slate-500 hover:text-c-primary dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'}`}
                        >
                            <AlertTriangle className="h-4 w-4" /> Kehilangan
                        </Button>
                        <Button
                            variant={activeTab === 'penemuan' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('penemuan')}
                            className={`rounded-lg px-4 gap-2 h-9 font-bold transition-all ${activeTab === 'penemuan' ? 'bg-white dark:bg-slate-700 text-c-secondary dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-c-primary dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'}`}
                        >
                            <Info className="h-4 w-4" /> Penemuan
                        </Button>
                    </div>
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2 bg-blue-50 dark:bg-c-secondary/10 px-4 py-2 rounded-xl text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                        <Info className="h-4 w-4 shrink-0" /> Daftar ini hanya menampilkan laporan yang sudah terverifikasi.
                    </div>
                </div>

                {loading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map(i => (
                            <Card key={i} className="animate-pulse border-none shadow-sm dark:shadow-none bg-white dark:bg-[#1E293B] rounded-2xl overflow-hidden">
                                <div className="h-48 bg-slate-100 dark:bg-slate-800" />
                                <div className="p-5 space-y-3">
                                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : filteredReports.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredReports.map((report) => (
                            <Card key={report.id} className="overflow-hidden border-none shadow-sm dark:shadow-none bg-white dark:bg-[#1E293B] rounded-[1.5rem] group hover:shadow-xl transition-all duration-300 flex flex-col relative">
                                <div className={`absolute top-0 left-0 right-0 h-1.5 z-10 ${report.jenis_laporan === 'kehilangan' ? 'bg-red-500' : 'bg-c-secondary'}`}></div>
                                <div className="h-52 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                                    {report.foto_barang ? (
                                        <img src={`/storage/${report.foto_barang}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Camera className="h-16 w-16 text-slate-300 dark:text-slate-600" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 z-20 shadow-md">
                                        <Badge className={`${report.jenis_laporan === 'kehilangan' ? 'bg-red-600 text-white' : 'bg-c-primary text-white'} border-none uppercase text-[10px] font-extrabold px-3 py-1.5 tracking-wider`}>
                                            {report.jenis_laporan}
                                        </Badge>
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10" />
                                    <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center gap-1.5 text-white/90 text-[11px] font-medium drop-shadow-md">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>Diunggah {new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                </div>
                                <CardHeader className="p-5 pb-2">
                                    <CardTitle className="text-xl font-bold text-c-primary dark:text-white line-clamp-1">{report.nama_barang}</CardTitle>
                                    <div className="flex items-center gap-1.5 text-[13px] text-c-secondary dark:text-blue-400 font-medium pt-1">
                                        <MapPin className="h-4 w-4" /> <span className="line-clamp-1">{report.lokasi_kejadian}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-5 pb-5 pt-2 flex-1">
                                    <p className="text-[13px] text-slate-600 dark:text-slate-400 line-clamp-3 italic mb-3 leading-relaxed">
                                        "{report.deskripsi_ciri_ciri}"
                                    </p>
                                </CardContent>
                                <CardFooter className="p-5 pt-0 mt-auto">
                                    <Button
                                        className="w-full gap-2 h-11 rounded-xl font-bold border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-c-secondary hover:text-white hover:border-blue-500 transition-all shadow-sm"
                                        variant="outline"
                                        onClick={() => window.open(`https://wa.me/62${report.nomor_wa_kontak.replace(/^0/, '')}?text=Halo, saya menghubungi terkait laporan ${report.jenis_laporan} ${report.nama_barang} di Papan Pengumuman Desa.`, '_blank')}
                                    >
                                        <MessageCircle className="h-4 w-4" /> Hubungi {report.jenis_laporan === 'kehilangan' ? 'Pemilik' : 'Penemu'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-[#1E293B]/50">
                        <Search className="h-16 w-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                        <h3 className="text-xl font-bold text-c-primary dark:text-white">Tidak ada laporan aktif</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Belum ada laporan {activeTab !== 'semua' ? activeTab : ''} yang dipublikasikan saat ini.</p>
                    </div>
                )}
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
