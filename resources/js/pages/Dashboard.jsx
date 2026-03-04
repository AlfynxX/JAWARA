import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    MessageSquare,
    FileText,
    TrendingUp,
    ArrowRight,
    Wallet,
    Loader2,
    Calendar as CalendarIcon,
    Moon,
    Sun,
    Package,
    Heart,
    HelpCircle,
    LayoutGrid,
    UsersRound,
    Network,
    UserCheck,
    Store,
    X,
    Clock,
    MapPin,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ImageIcon,
    Send,
    AlertCircle,
    CheckCircle2,
    ShieldAlert
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
    const [galleries, setGalleries] = useState([]); // New gallery state
    const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0); // For slider
    const [loading, setLoading] = useState(true);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEvents, setSelectedEvents] = useState([]);

    useEffect(() => {
        const fetchStats = fetch('/api/stats').then(res => res.json());
        const fetchFinance = fetch('/api/finance').then(res => res.json());
        const fetchGallery = fetch('/api/gallery').then(res => res.json());

        Promise.all([fetchStats, fetchFinance, fetchGallery])
            .then(([statsData, financeData, galleryData]) => {
                setStats(statsData);
                setChartData(financeData.chart_data || []);
                setGalleries(galleryData || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch dashboard data:", err);
                setLoading(false);
            });
    }, []);

    // Slider auto-slide effect
    useEffect(() => {
        if (galleries.length === 0) return;
        const interval = setInterval(() => {
            setCurrentGalleryIndex((prev) => (prev + 1) % galleries.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [galleries.length]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    };

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    // Assign a color class to each event based on its title/type
    const EVENT_COLORS = [
        { dot: 'bg-orange-500', badge: 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800', ring: 'ring-orange-400' },
        { dot: 'bg-blue-500', badge: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800', ring: 'ring-blue-400' },
        { dot: 'bg-emerald-500', badge: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800', ring: 'ring-emerald-400' },
        { dot: 'bg-rose-500', badge: 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800', ring: 'ring-rose-400' },
        { dot: 'bg-violet-500', badge: 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800', ring: 'ring-violet-400' },
        { dot: 'bg-amber-500', badge: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800', ring: 'ring-amber-400' },
    ];

    // Build a map: "YYYY-MM-DD" => list of {schedule, colorIndex}
    const schedulesByDate = React.useMemo(() => {
        const map = {};
        const schedules = stats.schedules || [];
        const usedColors = {}; // track color per unique title so same type = same color
        let colorCounter = 0;

        schedules.forEach(s => {
            if (!s.start_time) return;
            const d = new Date(s.start_time);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            if (!map[key]) map[key] = [];

            // Assign consistent color per event title category
            const titleKey = (s.title || '').toLowerCase().split(' ')[0];
            if (usedColors[titleKey] === undefined) {
                usedColors[titleKey] = colorCounter % EVENT_COLORS.length;
                colorCounter++;
            }
            map[key].push({ schedule: s, colorIndex: usedColors[titleKey] });
        });
        return map;
    }, [stats.schedules]);

    const handleDayClick = (year, month, day) => {
        const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const eventsForDay = schedulesByDate[key] || [];
        if (eventsForDay.length === 0) {
            setSelectedDate(null);
            setSelectedEvents([]);
            return;
        }
        setSelectedDate({ year, month, day, key });
        setSelectedEvents(eventsForDay);
    };

    const [formData, setFormData] = useState({ name: '', subject: '', description: '', nik: '' });
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const today = new Date();
        const weekDays = ['Mi', 'Se', 'Se', 'Ra', 'Ka', 'Ju', 'Sa'];

        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`}></div>);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const isToday = today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
            const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const dayEvents = schedulesByDate[key] || [];
            const hasEvents = dayEvents.length > 0;
            const isSelected = selectedDate?.key === key;

            days.push(
                <div
                    key={d}
                    className={`relative flex flex-col items-center cursor-pointer group`}
                    onClick={() => handleDayClick(year, month, d)}
                >
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-all font-semibold
                        ${isToday
                            ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30 ring-2 ring-orange-500 ring-offset-1 ring-offset-white dark:ring-offset-[#1E293B]'
                            : isSelected
                                ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 shadow-md'
                                : hasEvents
                                    ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700/70 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                                    : 'text-slate-500 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }
                    `}>
                        {d}
                    </div>
                    {/* Event dots */}
                    {hasEvents && (
                        <div className="flex gap-0.5 mt-0.5 justify-center">
                            {dayEvents.slice(0, 3).map((ev, idx) => (
                                <span key={idx} className={`w-1.5 h-1.5 rounded-full ${EVENT_COLORS[ev.colorIndex].dot} shadow-sm`}></span>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className="w-full space-y-4">
                {/* Month navigation */}
                <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                        {currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
                    </span>
                    <div className="flex gap-1">
                        <button
                            onClick={() => { setCurrentDate(new Date(year, month - 1, 1)); setSelectedDate(null); setSelectedEvents([]); }}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => { setCurrentDate(new Date(year, month + 1, 1)); setSelectedDate(null); setSelectedEvents([]); }}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Day labels */}
                <div className="grid grid-cols-7 gap-1">
                    {weekDays.map((day, i) => (
                        <div key={i} className="text-center text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{day}</div>
                    ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-y-2 gap-x-1">
                    {days}
                </div>

                {/* Selected day event detail panel */}
                {selectedDate && selectedEvents.length > 0 && (
                    <div className="mt-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/80">
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 tracking-wide uppercase">
                                {new Date(selectedDate.year, selectedDate.month, selectedDate.day).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </span>
                            <button
                                onClick={() => { setSelectedDate(null); setSelectedEvents([]); }}
                                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-700/60 max-h-48 overflow-y-auto">
                            {selectedEvents.map((ev, idx) => {
                                const s = ev.schedule;
                                const color = EVENT_COLORS[ev.colorIndex];
                                const startTime = new Date(s.start_time);
                                return (
                                    <div key={idx} className="px-4 py-3 flex items-start gap-3">
                                        <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${color.dot} shadow-sm`}></span>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-[13px] text-slate-900 dark:text-white truncate">{s.title}</p>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                                <span className={`text-[10px] font-bold flex items-center gap-1 ${color.badge.split(' ').filter(c => c.startsWith('text')).join(' ')}`}>
                                                    <Clock className="h-3 w-3" />
                                                    {startTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                                </span>
                                                {s.location && (
                                                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
                                                        <MapPin className="h-3 w-3 shrink-0" />
                                                        {s.location}
                                                    </span>
                                                )}
                                            </div>
                                            {s.description && (
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2">{s.description}</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Legend */}
                {Object.keys(schedulesByDate).length > 0 && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Klik tanggal bermark untuk detail</p>
                        <div className="flex flex-wrap gap-2">
                            {[...new Set(Object.values(schedulesByDate).flat().map(ev => ev.colorIndex))].map(ci => {
                                // Find first event with this colorIndex to get title
                                const sample = Object.values(schedulesByDate).flat().find(ev => ev.colorIndex === ci);
                                if (!sample) return null;
                                const titleWord = (sample.schedule.title || '').split(' ').slice(0, 2).join(' ');
                                return (
                                    <div key={ci} className="flex items-center gap-1.5">
                                        <span className={`w-2 h-2 rounded-full ${EVENT_COLORS[ci].dot}`}></span>
                                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate max-w-[80px]">{titleWord}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col min-h-screen bg-c-bg dark:bg-slate-900 font-sans selection:bg-c-secondary/30">
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

            <main className="flex-1 container px-4 sm:px-6 py-10 mx-auto space-y-10">
                {/* Welcome Hero */}
                <div className="flex flex-col gap-2 max-w-2xl">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-c-primary dark:text-white">Selamat Datang di Portal Warga</h1>
                    <p className="text-c-secondary dark:text-slate-400 font-medium text-[15px] mt-1 leading-relaxed">
                        Pantau informasi desa, jadwal kegiatan, dan transparansi keuangan secara real-time.
                    </p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <Card className="overflow-hidden border-none shadow-xl shadow-c-primary/10 bg-gradient-to-br from-c-primary to-c-primary/90 text-white rounded-[1.5rem] relative flex flex-col justify-between p-5 md:p-6 min-h-[160px]">
                        <div className="flex justify-between items-start w-full">
                            <span className="text-xs font-bold uppercase tracking-wider text-c-tertiary font-sans">Kas Desa</span>
                            <Wallet className="h-5 w-5 text-c-tertiary stroke-[2] opacity-80" />
                        </div>
                        <div className="mt-4">
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> :
                                <div className="text-2xl md:text-3xl font-black tracking-tight drop-shadow-sm text-c-bg">{formatCurrency(stats.cash_balance)}</div>
                            }
                            <p className="text-xs text-c-tertiary/80 mt-1 font-medium">Saldo saat ini</p>
                        </div>
                    </Card>

                    <Card className="overflow-hidden border-none shadow-xl shadow-c-secondary/10 bg-gradient-to-br from-c-tertiary to-c-tertiary/90 text-c-primary rounded-[1.5rem] relative flex flex-col justify-between p-5 md:p-6 min-h-[160px]">
                        <div className="flex justify-between items-start w-full">
                            <span className="text-xs font-bold uppercase tracking-wider text-c-primary/80 font-sans">Total Warga</span>
                            <UsersRound className="h-5 w-5 text-c-primary stroke-[2] opacity-80" />
                        </div>
                        <div className="mt-4">
                            {loading ? <Loader2 className="h-6 w-6 animate-spin text-c-primary" /> :
                                <div className="text-2xl md:text-3xl font-black tracking-tight drop-shadow-sm text-c-primary">{stats.total_citizens}</div>
                            }
                            <p className="text-xs text-c-primary/70 mt-1 font-medium">Jiwa terdaftar</p>
                        </div>
                    </Card>

                    <Card className="overflow-hidden border-none shadow-xl shadow-c-secondary/10 bg-gradient-to-br from-c-tertiary to-c-tertiary/90 text-c-primary rounded-[1.5rem] relative flex flex-col justify-between p-5 md:p-6 min-h-[160px]">
                        <div className="flex justify-between items-start w-full">
                            <span className="text-xs font-bold uppercase tracking-wider text-c-primary/80 font-sans">Total KK</span>
                            <Network className="h-5 w-5 text-c-primary stroke-[2] opacity-80" />
                        </div>
                        <div className="mt-4">
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> :
                                <div className="text-2xl md:text-3xl font-black tracking-tight drop-shadow-sm text-c-primary">{stats.total_households}</div>
                            }
                            <p className="text-xs text-c-primary/70 mt-1 font-medium">Kepala Keluarga</p>
                        </div>
                    </Card>

                    <Card className="overflow-hidden border-none shadow-xl shadow-c-primary/10 bg-gradient-to-br from-c-primary to-c-primary/90 text-white rounded-[1.5rem] relative flex flex-col justify-between p-5 md:p-6 min-h-[160px]">
                        <div className="flex justify-between items-start w-full">
                            <span className="text-xs font-bold uppercase tracking-wider text-c-tertiary font-sans">Penerima Bantuan</span>
                            <UserCheck className="h-5 w-5 text-c-tertiary stroke-[2] opacity-80" />
                        </div>
                        <div className="mt-4">
                            {loading ? <Loader2 className="h-6 w-6 animate-spin text-c-bg" /> :
                                <div className="text-2xl md:text-3xl font-black tracking-tight drop-shadow-sm text-c-bg">{stats.total_poor + stats.total_elderly}</div>
                            }
                            <p className="text-xs text-c-tertiary/80 mt-1 font-medium">Lansia & Kurang Mampu</p>
                        </div>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Financial Chart */}
                    <Card className="md:col-span-2 shadow-sm rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B]">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                    <TrendingUp className="h-5 w-5 text-green-500" />
                                    Pemasukan vs Pengeluaran (6 Bulan Terakhir)
                                </CardTitle>
                                <CardDescription className="dark:text-slate-400 font-medium">Grafik perbandingan arus kas keuangan desa.</CardDescription>
                            </div>
                            <div className="hidden sm:flex gap-2">
                                <span className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer shadow-sm hover:ring-1 hover:ring-slate-300 dark:hover:ring-slate-600 transition-all">Pemasukan</span>
                                <span className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer shadow-sm hover:ring-1 hover:ring-slate-300 dark:hover:ring-slate-600 transition-all">Pengeluaran</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[320px] w-full pt-4">
                                {loading ? (
                                    <div className="h-full flex items-center justify-center text-slate-400">
                                        <Loader2 className="h-8 w-8 animate-spin" />
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
                                                dy={10}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#64748b', fontSize: 13 }}
                                                tickFormatter={(value) => value >= 1000000 ? `${(value / 1000000).toFixed(0)}M` : value}
                                                width={50}
                                            />
                                            <Tooltip
                                                formatter={(value) => formatCurrency(value)}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', backgroundColor: '#0F172A', color: '#fff', fontWeight: 500 }}
                                                itemStyle={{ color: '#fff' }}
                                                cursor={{ fill: 'rgba(51, 65, 85, 0.1)' }}
                                            />
                                            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                                            <Bar dataKey="income" name="Pemasukan" fill="#22c55e" radius={[6, 6, 0, 0]} maxBarSize={40} />
                                            <Bar dataKey="expense" name="Pengeluaran" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Activity Schedule Component */}
                    <Card className="shadow-sm rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] h-full flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                <CalendarIcon className="h-5 w-5 text-blue-500" />
                                Jadwal Kegiatan
                            </CardTitle>
                            <CardDescription className="dark:text-slate-400 font-medium">Kalender agenda desa mendatang.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            {renderCalendar()}
                        </CardContent>
                    </Card>
                </div>

                {/* Custom Gallery Slider taking place of digital services grid */}
                <div className="space-y-6">
                    <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#355872] dark:text-white">Galeri Kegiatan Desa</h2>

                    {loading ? (
                        <div className="h-[400px] bg-white dark:bg-[#1E293B] rounded-[1.5rem] flex justify-center items-center shadow-sm">
                            <Loader2 className="h-8 w-8 text-[#7AAACE] animate-spin" />
                        </div>
                    ) : galleries.length > 0 ? (
                        <div className="relative overflow-hidden rounded-[1.5rem] shadow-lg group bg-slate-900 h-[400px] md:h-[500px]">
                            {/* Slides */}
                            <div className="flex transition-transform duration-700 ease-in-out h-full" style={{ transform: `translateX(-${currentGalleryIndex * 100}%)` }}>
                                {galleries.map((gallery, idx) => (
                                    <div key={idx} className="min-w-full h-full relative border-none">
                                        <img src={gallery.image_url} alt={gallery.title} className="w-full h-full object-cover opacity-90" />
                                        {/* Overlay Hover Details */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#355872] via-[#355872]/40 to-transparent flex flex-col justify-end p-6 md:p-10 transition-opacity">
                                            <div className="max-w-3xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                <h3 className="text-2xl md:text-3xl font-extrabold text-[#F7F8F0] mb-2">{gallery.title}</h3>
                                                <p className="text-[#9CD5FF] text-sm md:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-3">
                                                    {gallery.description || "Tidak ada deskripsi untuk kegiatan ini."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Slider Navigation */}
                            {galleries.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setCurrentGalleryIndex((prev) => (prev === 0 ? galleries.length - 1 : prev - 1))}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={() => setCurrentGalleryIndex((prev) => (prev + 1) % galleries.length)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                        {galleries.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentGalleryIndex(idx)}
                                                className={`h-2 rounded-full transition-all ${currentGalleryIndex === idx ? 'w-6 bg-[#9CD5FF]' : 'w-2 bg-white/50'}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="h-[200px] border-2 border-dashed border-[#7AAACE]/30 rounded-[1.5rem] flex items-center justify-center flex-col gap-2 text-[#7AAACE]">
                            <ImageIcon className="h-8 w-8 opacity-50" />
                            <p className="font-medium text-sm">Belum ada foto galeri.</p>
                        </div>
                    )}
                </div>

                {/* Embedded Report Form (Layanan Pengaduan) */}
                <div className="py-6 pt-10 border-t border-slate-200 dark:border-slate-800">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="text-center space-y-2 mb-8">
                            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#355872] dark:text-white">Layanan Pengaduan Masyarakat</h2>
                            <p className="text-[#7AAACE] dark:text-slate-400 font-medium text-sm md:text-base">Laporkan masalah, keluhan, atau aspirasi Anda secara aman ke Pemerintah Desa.</p>
                        </div>

                        <Card className="border-none shadow-xl shadow-[#355872]/5 dark:shadow-none bg-white dark:bg-[#1E293B] rounded-[1.5rem] overflow-hidden relative">
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#7AAACE] to-[#355872]"></div>
                            <CardHeader className="p-6 md:p-8 pb-4">
                                <CardTitle className="text-xl font-bold text-[#355872] dark:text-white flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5 text-[#7AAACE]" />
                                    Formulir Laporan
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="px-6 md:px-8 pb-4">
                                {successMsg ? (
                                    <div className="py-10 flex flex-col items-center justify-center gap-4 text-center">
                                        <div className="p-4 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                                            <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Laporan Berhasil Terkirim!</h3>
                                            <p className="text-sm font-medium text-slate-500 mt-2 max-w-[300px] mx-auto">{successMsg}</p>
                                        </div>
                                        <Button variant="outline" onClick={() => setSuccessMsg('')} className="mt-4 font-bold rounded-xl border-slate-300 text-slate-700 dark:text-slate-300">Kirim Laporan Lain</Button>
                                    </div>
                                ) : (
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        setSubmitting(true);
                                        const data = new FormData();
                                        data.append('name', formData.name);
                                        data.append('subject', formData.subject);
                                        data.append('description', formData.description);
                                        if (formData.nik) data.append('nik', formData.nik);

                                        fetch('/api/reports', { method: 'POST', body: data })
                                            .then(async res => {
                                                const json = await res.json();
                                                if (!res.ok) throw new Error(json.message);
                                                setSuccessMsg('Laporan berhasil dikirim! Admin/Operator desa akan segera meninjau laporan Anda.');
                                                setFormData({ name: '', subject: '', description: '', nik: '' });
                                                setSubmitting(false);
                                            })
                                            .catch(err => {
                                                console.error(err);
                                                setErrorMsg(err.message || 'Gagal mengirim laporan.');
                                                setSubmitting(false);
                                            });
                                    }} className="space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm text-[#355872] dark:text-slate-300 font-semibold">Nama Lengkap <span className="text-red-500">*</span></label>
                                                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#F7F8F0]/50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 h-11 px-4 rounded-xl text-sm" placeholder="Masukkan nama Anda" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm text-[#355872] dark:text-slate-300 font-semibold">Subjek / Judul <span className="text-red-500">*</span></label>
                                                <input required value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} className="w-full bg-[#F7F8F0]/50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 h-11 px-4 rounded-xl text-sm" placeholder="Contoh: Jalan berlubang" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-[#355872] dark:text-slate-300 font-semibold">Keterangan Detail <span className="text-red-500">*</span></label>
                                            <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full min-h-[120px] resize-none bg-[#F7F8F0]/50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 p-4 rounded-xl text-sm" placeholder="Ceritakan rinci keluhan Anda..." />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-[#355872] dark:text-slate-300 font-semibold">NIK KTP Kamu <span className="text-[11px] font-normal">(Opsional)</span></label>
                                            <input value={formData.nik} onChange={e => setFormData({ ...formData, nik: e.target.value })} className="w-full bg-[#F7F8F0]/50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 h-11 px-4 rounded-xl text-sm" placeholder="Contoh: 3201..." />
                                        </div>
                                        {errorMsg && (
                                            <div className="flex gap-3 p-4 rounded-xl bg-red-50 text-red-800 text-sm font-medium"><AlertCircle className="h-5 w-5 mt-0.5" /> <span>{errorMsg}</span></div>
                                        )}
                                        <Button type="submit" disabled={submitting} className="w-full gap-2 bg-[#355872] hover:bg-[#2A475C] text-white font-bold h-12 rounded-xl mt-4">
                                            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                                            {submitting ? 'Mengirim...' : 'Kirim Pengaduan'}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                            <div className="bg-slate-50 dark:bg-[#0F172A]/50 border-t border-slate-100 dark:border-slate-800/80 p-4">
                                <p className="text-xs text-slate-500 font-medium flex items-center justify-center w-full gap-2"><ShieldAlert className="h-3.5 w-3.5" /> Data diri dan laporan dirahasiakan</p>
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
        </div>
    );
}
