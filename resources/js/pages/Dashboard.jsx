import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    MessageSquare,
    FileText,
    TrendingUp,
    Users,
    ArrowRight,
    Wallet,
    Loader2,
    Calendar,
    Clock,
    MapPin,
    Home,
    Moon,
    Sun
} from "lucide-react";
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard({ isDark, toggleDark }) {
    const [stats, setStats] = useState({
        total_citizens: 0,
        total_households: 0,
        total_elderly: 0,
        total_poor: 0,
        total_reports: 0,
        cash_balance: 0,
        schedules: []
    });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = fetch('/api/stats').then(res => res.json());
        const fetchFinance = fetch('/api/finance').then(res => res.json());

        Promise.all([fetchStats, fetchFinance])
            .then(([statsData, financeData]) => {
                setStats(statsData);
                setChartData(financeData.chart_data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch dashboard data:", err);
                setLoading(false);
            });
    }, []);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4 mx-auto">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary p-1.5 rounded-lg">
                            <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">FIKSI Portal</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">Beranda</Link>
                        <Link to="/report" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Laporan Warga</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleDark}
                            className="p-2 rounded-full hover:bg-muted transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {isDark ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 container px-4 py-8 mx-auto space-y-8">
                {/* Welcome Hero */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Selamat Datang di Portal Warga</h1>
                    <p className="text-muted-foreground">Pantau informasi desa, jadwal kegiatan, dan transparansi keuangan secara real-time.</p>
                </div>

                {/* Stat Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-background">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Kas Desa (Saldo)</CardTitle>
                            <Wallet className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> :
                                <div className="text-2xl font-bold text-blue-700">{formatCurrency(stats.cash_balance)}</div>
                            }
                            <p className="text-xs text-muted-foreground">Saldo kas desa saat ini</p>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950 dark:to-background">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Warga</CardTitle>
                            <Users className="h-4 w-4 text-indigo-600" />
                        </CardHeader>
                        <CardContent>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> :
                                <div className="text-2xl font-bold text-indigo-700">{stats.total_citizens}</div>
                            }
                            <p className="text-xs text-muted-foreground">Jiwa terdaftar di sistem</p>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-purple-50 to-white dark:from-purple-950 dark:to-background">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total KK</CardTitle>
                            <Home className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> :
                                <div className="text-2xl font-bold text-purple-700">{stats.total_households}</div>
                            }
                            <p className="text-xs text-muted-foreground">Kepala Keluarga</p>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-orange-50 to-white dark:from-orange-950 dark:to-background">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Penerima Bantuan</CardTitle>
                            <Users className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> :
                                <div className="text-2xl font-bold text-orange-700">{stats.total_poor + stats.total_elderly}</div>
                            }
                            <p className="text-xs text-muted-foreground">Warga Lansia & Kurang Mampu</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Financial Chart */}
                    <Card className="md:col-span-2 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                                Pemasukan vs Pengeluaran (6 Bulan Terakhir)
                            </CardTitle>
                            <CardDescription>Grafik perbandingan arus kas keuangan desa.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                {loading ? (
                                    <div className="h-full flex items-center justify-center text-muted-foreground">
                                        <Loader2 className="h-8 w-8 animate-spin" />
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(value) => formatCurrency(value)}
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            />
                                            <Legend />
                                            <Bar dataKey="income" name="Pemasukan" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="expense" name="Pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Activity Schedule */}
                    <Card className="shadow-sm h-full flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-blue-600" />
                                Jadwal Kegiatan
                            </CardTitle>
                            <CardDescription>Agenda kegiatan desa mendatang.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                            ) : stats.schedules && stats.schedules.length > 0 ? (
                                <div className="space-y-4">
                                    {stats.schedules.map((schedule, idx) => (
                                        <div key={idx} className="flex gap-3 items-start p-3 rounded-lg bg-muted/40 border">
                                            <div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md p-2 flex flex-col items-center justify-center w-12 shrink-0">
                                                <span className="text-xs font-bold uppercase">{new Date(schedule.start_time).toLocaleString('id-ID', { month: 'short' })}</span>
                                                <span className="text-lg font-bold leading-none">{new Date(schedule.start_time).getDate()}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm">{schedule.title}</h4>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                                    <Clock className="h-3 w-3" />
                                                    {(() => {
                                                        const date = new Date(schedule.start_time);
                                                        const hours = date.getHours();
                                                        const minutes = date.getMinutes().toString().padStart(2, '0');
                                                        let period = 'Pagi';
                                                        if (hours >= 12 && hours < 15) period = 'Siang';
                                                        else if (hours >= 15 && hours < 19) period = 'Sore';
                                                        else if (hours >= 19) period = 'Malam';

                                                        return `${hours.toString().padStart(2, '0')}:${minutes} (${period})`;
                                                    })()}
                                                </div>
                                                {schedule.location && (
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                                        <MapPin className="h-3 w-3" />
                                                        {schedule.location}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    Tidak ada kegiatan mendatang.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Features Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="group hover:border-primary/50 transition-all cursor-pointer">
                        <Link to="/transparency">
                            <CardHeader>
                                <div className="p-2 w-fit rounded-lg bg-blue-100 dark:bg-blue-900 mb-2">
                                    <FileText className="h-6 w-6 text-blue-600" />
                                </div>
                                <CardTitle>Transparansi Keuangan</CardTitle>
                                <CardDescription>Pantau rincian penggunaan anggaran desa setiap bulannya secara terbuka.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="ghost" className="group-hover:translate-x-1 transition-transform p-0 hover:bg-transparent">
                                    Lihat Grafik & Detail <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Link>
                    </Card>

                    <Card className="group hover:border-primary/50 transition-all cursor-pointer">
                        <Link to="/social-aid">
                            <CardHeader>
                                <div className="p-2 w-fit rounded-lg bg-green-100 dark:bg-green-900 mb-2">
                                    <Users className="h-6 w-6 text-green-600" />
                                </div>
                                <CardTitle>Penerima Bantuan</CardTitle>
                                <CardDescription>Data warga yang terdaftar sebagai penerima bantuan sosial pemerintah.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="ghost" className="group-hover:translate-x-1 transition-transform p-0 hover:bg-transparent">
                                    Cek Daftar Warga <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Link>
                    </Card>

                    <Card className="group hover:border-primary/50 transition-all cursor-pointer">
                        <Link to="/report">
                            <CardHeader>
                                <div className="p-2 w-fit rounded-lg bg-orange-100 dark:bg-orange-900 mb-2">
                                    <MessageSquare className="h-6 w-6 text-orange-600" />
                                </div>
                                <CardTitle>Layanan Pengaduan</CardTitle>
                                <CardDescription>Sampaikan keluhan atau saran Anda dan pantau status pengerjaannya.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="ghost" className="group-hover:translate-x-1 transition-transform p-0 hover:bg-transparent">
                                    Pantau & Lapor <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Link>
                    </Card>
                </div>
            </main>


            {/* Footer */}
            <footer className="border-t py-6 bg-muted/30">
                <div className="container px-4 text-center text-sm text-muted-foreground mx-auto">
                    © 2026 FIKSI System. Dibuat untuk transparansi dan layanan warga.
                </div>
            </footer>
        </div>
    );
}
