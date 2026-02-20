import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Users, Loader2, Moon, Sun } from "lucide-react";
import { Link } from 'react-router-dom';

const STATUS_LABEL = {
    pending: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-700' },
    received: { label: 'Diterima', color: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-700' },
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
        <div className="flex flex-col min-h-screen bg-muted/20">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
                <div className="container flex h-16 items-center gap-4 px-4 mx-auto">
                    <Link to="/">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft className="h-4 w-4" /> Kembali
                        </Button>
                    </Link>
                    <div>
                        <h1 className="font-bold text-lg leading-none">Data Penerima Bantuan Sosial</h1>
                        <p className="text-xs text-muted-foreground">Daftar warga yang menerima bantuan resmi dari desa</p>
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

            <main className="flex-1 container px-4 py-8 mx-auto">
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>Daftar Penerima Bansos</CardTitle>
                        <CardDescription>Cari nama warga atau jenis bantuan untuk memeriksa status penerimaan.</CardDescription>
                        <div className="relative mt-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama warga atau jenis bantuan..."
                                className="pl-9"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center items-center h-48">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                                <Users className="h-10 w-10 mb-2 opacity-20" />
                                <p>{search ? 'Warga tidak ditemukan.' : 'Belum ada data penerima bantuan.'}</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filtered.map((r, i) => {
                                    const statusInfo = STATUS_LABEL[r.status] || { label: r.status, color: 'bg-gray-100 text-gray-700' };
                                    return (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-lg border bg-background hover:bg-muted/30 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-green-100 p-2 rounded-full">
                                                    <Users className="h-4 w-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm">{r.citizen?.name || '-'}</p>
                                                    <p className="text-xs text-muted-foreground">{r.social_aid?.name || '-'}</p>
                                                </div>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusInfo.color}`}>
                                                    {statusInfo.label}
                                                </span>
                                                {r.social_aid?.amount && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Rp {Number(r.social_aid.amount).toLocaleString('id-ID')}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
