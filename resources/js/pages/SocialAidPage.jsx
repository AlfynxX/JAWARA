import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Users, Loader2, Moon, Sun, LayoutGrid, CheckCircle2, Clock, XCircle, ShieldCheck, ChevronDown } from "lucide-react";
import { Link } from 'react-router-dom';

const STATUS_LABEL = {
    pending: { label: 'Menunggu', color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-900', icon: Clock },
    received: { label: 'Diterima', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900', icon: CheckCircle2 },
    cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-900', icon: XCircle },
};

export default function SocialAidPage({ isDark, toggleDark }) {
    const [recipients, setRecipients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetch('/api/social-aid')
            .then(res => res.json())
            .then(data => { setRecipients(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const filtered = recipients.filter(r => {
        const name = r.citizen?.name?.toLowerCase() || '';
        const aid = r.social_aid?.name?.toLowerCase() || '';
        const q = search.toLowerCase();
        return name.includes(q) || aid.includes(q);
    });

    return (
        <div className="flex flex-col min-h-screen bg-c-bg dark:bg-[#0F172A] font-sans selection:bg-indigo-500/30">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800/60 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md">
                <div className="container flex h-[72px] items-center justify-between px-6 mx-auto">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain fallback-logo bg-c-tertiary p-1 rounded-full" />
                        <span className="text-xl font-extrabold tracking-tight text-c-primary dark:text-white">Jawara Portal</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-sm font-semibold text-c-primary border-b-2 border-c-primary pb-1 pt-1">Beranda</Link>

                        <div className="relative group pt-1">
                            <button className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-c-primary dark:text-slate-400 dark:hover:text-white transition-colors pb-1">
                                Layanan Digital <ChevronDown className="h-4 w-4" />
                            </button>
                            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-2.5 overflow-hidden translate-y-2 group-hover:translate-y-0">
                                <Link to="/layanan-surat" className="block px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-c-secondary dark:hover:text-blue-400 transition-colors">Administrasi Surat</Link>
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
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleDark}
                            className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 container px-4 py-8 mx-auto max-w-5xl space-y-8">
                <div className="space-y-2 text-center md:text-left mb-6">
                    <h1 className="text-3xl font-extrabold tracking-tight text-c-primary dark:text-white">Data Penerima Bantuan Sosial</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base">Daftar warga yang menerima bantuan resmi dari pemerintah desa, disajikan secara transparan.</p>
                </div>

                <Card className="border-none shadow-sm dark:shadow-none bg-white dark:bg-[#1E293B] rounded-3xl overflow-hidden">
                    <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-violet-500"></div>
                    <CardHeader className="p-6 md:p-8 pb-4">
                        <CardTitle className="text-xl font-bold text-c-primary dark:text-white flex items-center gap-2">
                            <ShieldCheck className="h-6 w-6 text-indigo-500" />
                            Daftar Penerima Terverifikasi
                        </CardTitle>
                        <CardDescription className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">Cari nama warga atau jenis bantuan untuk memeriksa status penerimaan.</CardDescription>

                        <div className="relative mt-6 max-w-2xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input
                                placeholder="Cari nama warga atau jenis bantuan..."
                                className="pl-12 h-12 bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500 rounded-xl text-base shadow-sm"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </CardHeader>

                    <CardContent className="p-6 md:p-8 pt-4">
                        {loading ? (
                            <div className="flex flex-col justify-center items-center h-64 gap-4">
                                <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                                <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Memuat data penerima...</p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-[#1E293B]/50">
                                <Users className="h-12 w-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                                <h3 className="text-lg font-bold text-c-primary dark:text-white mb-1">Tidak ada data ditemukan</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">{search ? `Tidak ada hasil untuk pencarian "${search}"` : 'Belum ada data penerima bantuan yang terdaftar.'}</p>
                            </div>
                        ) : (
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                                {filtered.map((r, i) => {
                                    const statusInfo = STATUS_LABEL[r.status] || { label: r.status, color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700', icon: Clock };
                                    const StatusIcon = statusInfo.icon;

                                    return (
                                        <div key={i} className="flex flex-col lg:flex-row lg:items-center justify-between p-4 md:p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1E293B] hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors gap-4 group">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-indigo-50 dark:bg-indigo-500/10 p-3.5 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                                                    <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-c-primary dark:text-white text-base md:text-lg tracking-tight mb-0.5">{r.citizen?.name || 'Nama Tidak Tersedia'}</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                            {r.social_aid?.name || 'Jenis Bantuan Tidak Tersedia'}
                                                        </span>
                                                        {r.social_aid?.amount && (
                                                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                                                Rp {Number(r.social_aid.amount).toLocaleString('id-ID')}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center lg:justify-end border-t border-slate-100 dark:border-slate-800 lg:border-0 pt-3 lg:pt-0 mt-1 lg:mt-0">
                                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold shadow-sm ${statusInfo.color}`}>
                                                    <StatusIcon className="h-3.5 w-3.5" />
                                                    {statusInfo.label}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
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
