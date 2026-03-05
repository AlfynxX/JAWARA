import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, TrendingDown, Loader2, Wallet, Moon, Sun, LayoutGrid, ChevronDown, Menu, X } from "lucide-react";
import { Link } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const formatRp = (val) => 'Rp ' + Number(val).toLocaleString('id-ID');

export default function FinancePage({ isDark, toggleDark }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        fetch('/api/finance')
            .then(res => res.json())
            .then(d => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const transactions = data?.recent_transactions || [];
    const filtered = activeTab === 'all' ? transactions
        : transactions.filter(t => t.type === activeTab);

    return (
        <div className="flex flex-col min-h-screen bg-c-bg dark:bg-[#0F172A] font-sans selection:bg-emerald-500/30">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800/60 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md">
                <div className="container flex h-[72px] items-center px-4 md:px-6 mx-auto relative">
                    <button className="md:hidden p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mr-2" onClick={() => setMobileOpen(o => !o)} aria-label="Toggle menu">
                        <Menu className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    </button>
                    <div className="flex items-center gap-3 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:left-auto">
                        <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain fallback-logo bg-c-tertiary p-1 rounded-full" />
                        <span className="text-xl font-extrabold tracking-tight text-c-primary dark:text-white">Jawara Portal</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-8 ml-10">
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
                    <div className="hidden md:flex items-center ml-auto">
                        <button onClick={toggleDark} className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Toggle dark mode">
                            {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
                        </button>
                    </div>
                </div>
            </header>
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

            <main className="flex-1 container px-4 py-8 mx-auto max-w-5xl space-y-8">
                <div className="space-y-2 text-center md:text-left mb-6">
                    <h1 className="text-3xl font-extrabold tracking-tight text-c-primary dark:text-white">Transparansi Keuangan Desa</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base">Mewujudkan tata pemerintahan yang baik melalui keterbukaan data keuangan desa.</p>
                </div>

                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64 gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
                        <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Memuat data keuangan...</p>
                    </div>
                ) : (
                    <>
                        {/* Chart Section */}
                        <Card className="border-none shadow-sm dark:shadow-none bg-white dark:bg-[#1E293B] rounded-3xl overflow-hidden">
                            <CardHeader className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/30">
                                <CardTitle className="text-xl font-bold text-c-primary dark:text-white flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                                    Grafik Keuangan 6 Bulan Terakhir
                                </CardTitle>
                                <CardDescription className="text-slate-500 dark:text-slate-400 font-medium">
                                    Perbandingan pemasukan dan pengeluaran desa per bulan
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8">
                                {data?.chart_data?.length > 0 ? (
                                    <div className="h-[350px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={data.chart_data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                                                <XAxis
                                                    dataKey="name"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12, fontWeight: 600 }}
                                                    dy={10}
                                                />
                                                <YAxis
                                                    tickFormatter={(v) => (v / 1000000).toFixed(0) + 'jt'}
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12, fontWeight: 500 }}
                                                />
                                                <Tooltip
                                                    formatter={(value) => [formatRp(value), ""]}
                                                    cursor={{ fill: isDark ? '#334155' : '#f1f5f9' }}
                                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', backgroundColor: isDark ? '#0F172A' : '#ffffff', color: isDark ? '#f8fafc' : '#0f172a', fontWeight: 'bold' }}
                                                />
                                                <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: '600' }} />
                                                <Bar dataKey="income" name="Pemasukan" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={40} />
                                                <Bar dataKey="expense" name="Pengeluaran" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={40} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                                        <Wallet className="h-12 w-12 mb-3 text-slate-300 dark:text-slate-600" />
                                        <p className="text-slate-500 dark:text-slate-400 font-medium">Belum ada data keuangan tersedia.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Transaction List */}
                        <Card className="border-none shadow-sm dark:shadow-none bg-white dark:bg-[#1E293B] rounded-3xl overflow-hidden mt-8">
                            <CardHeader className="p-6 md:p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <CardTitle className="text-xl font-bold text-c-primary dark:text-white">Rincian Transaksi</CardTitle>
                                    <CardDescription className="text-slate-500 dark:text-slate-400 font-medium mt-1">Daftar transaksi Pemasukan dan Pengeluaran</CardDescription>
                                </div>
                                <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl w-fit">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setActiveTab('all')}
                                        className={`rounded-lg px-4 font-bold transition-all h-9 ${activeTab === 'all' ? 'bg-white dark:bg-slate-700 text-c-primary dark:text-white shadow-sm' : 'text-slate-500 hover:text-c-primary dark:hover:text-white'}`}
                                    >
                                        Semua
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setActiveTab('income')}
                                        className={`rounded-lg px-4 font-bold transition-all h-9 ${activeTab === 'income' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-c-primary dark:hover:text-white'}`}
                                    >
                                        Pemasukan
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setActiveTab('expense')}
                                        className={`rounded-lg px-4 font-bold transition-all h-9 ${activeTab === 'expense' ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-sm' : 'text-slate-500 hover:text-c-primary dark:hover:text-white'}`}
                                    >
                                        Pengeluaran
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8 pt-6">
                                {filtered.length === 0 ? (
                                    <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-[#1E293B]/50">
                                        <Wallet className="h-10 w-10 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                                        <p className="text-slate-500 dark:text-slate-400 font-medium">Tidak ada transaksi yang sesuai.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {filtered.map((t, i) => (
                                            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1E293B] hover:border-emerald-200 dark:hover:border-emerald-900/50 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors gap-3">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-3 rounded-xl shrink-0 ${t.type === 'income' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                                                        {t.type === 'income'
                                                            ? <TrendingUp className="h-5 w-5" />
                                                            : <TrendingDown className="h-5 w-5" />
                                                        }
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-c-primary dark:text-white text-[15px]">{t.title}</p>
                                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                                                            <span className="truncate max-w-[150px] md:max-w-[300px]">{t.description || '-'}</span>
                                                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0"></span>
                                                            <span className="whitespace-nowrap">{t.transaction_date}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={`font-extrabold sm:text-right text-[15px] mt-2 sm:mt-0 ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                                    {t.type === 'income' ? '+' : '-'} {formatRp(t.amount)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </>
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
