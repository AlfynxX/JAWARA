import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, TrendingDown, Loader2, Wallet, Moon, Sun } from "lucide-react";
import { Link } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const formatRp = (val) => 'Rp ' + Number(val).toLocaleString('id-ID');

export default function FinancePage({ isDark, toggleDark }) {
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
        <div className="flex flex-col min-h-screen bg-muted/20">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
                <div className="container flex h-16 items-center gap-4 px-4 mx-auto">
                    <Link to="/">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft className="h-4 w-4" /> Kembali
                        </Button>
                    </Link>
                    <div>
                        <h1 className="font-bold text-lg leading-none">Transparansi Keuangan Desa</h1>
                        <p className="text-xs text-muted-foreground">Data keuangan dipublikasikan secara transparan</p>
                    </div>
                    <button
                        onClick={toggleDark}
                        className="ml-auto p-2 rounded-full hover:bg-muted transition-colors"
                        aria-label="Toggle dark mode"
                    >
                        {isDark ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
                    </button>
                </div>
            </header>

            <main className="flex-1 container px-4 py-8 mx-auto space-y-8">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        {/* Chart Section */}
                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle>Grafik Keuangan 6 Bulan Terakhir</CardTitle>
                                <CardDescription>Perbandingan pemasukan dan pengeluaran desa per bulan</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {data?.chart_data?.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={320}>
                                        <BarChart data={data.chart_data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                                            <XAxis dataKey="name" />
                                            <YAxis tickFormatter={(v) => 'Rp ' + (v / 1000000).toFixed(0) + 'jt'} />
                                            <Tooltip formatter={(value) => formatRp(value)} />
                                            <Legend />
                                            <Bar dataKey="income" name="Pemasukan" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="expense" name="Pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                                        <Wallet className="h-10 w-10 mb-2 opacity-20" />
                                        <p>Belum ada data keuangan tersedia.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Transaction List */}
                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle>Rincian Transaksi</CardTitle>
                                <div className="flex gap-2 mt-2">
                                    {['all', 'income', 'expense'].map(tab => (
                                        <Button
                                            key={tab}
                                            variant={activeTab === tab ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setActiveTab(tab)}
                                        >
                                            {tab === 'all' ? 'Semua' : tab === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                                        </Button>
                                    ))}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {filtered.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-8">Tidak ada transaksi.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {filtered.map((t, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-background hover:bg-muted/30 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-full ${t.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                                                        {t.type === 'income'
                                                            ? <TrendingUp className="h-4 w-4 text-green-600" />
                                                            : <TrendingDown className="h-4 w-4 text-red-600" />
                                                        }
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">{t.title}</p>
                                                        <p className="text-xs text-muted-foreground">{t.description || '-'} • {t.transaction_date}</p>
                                                    </div>
                                                </div>
                                                <span className={`font-bold text-sm ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
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
        </div>
    );
}
