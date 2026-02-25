import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, MapPin, Search, Plus, MessageCircle, ArrowLeft, Sun, Moon, Info, Camera, Calendar, AlertTriangle } from "lucide-react";
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function BarangHilangPage({ isDark, toggleDark }) {
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
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4 mx-auto">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="p-2 hover:bg-muted rounded-full transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <span className="text-xl font-bold tracking-tight text-primary flex items-center gap-2">
                            <HelpCircle className="h-6 w-6" /> Papan Kehilangan & Penemuan
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="sm" className="gap-2">
                                    <Plus className="h-4 w-4" /> Bikin Laporan
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Buat Laporan Baru</DialogTitle>
                                    <DialogDescription>
                                        Laporkan barang yang hilang atau ditemukan. Admin akan meninjau sebelum dipublikasikan.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Jenis Laporan</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-muted font-medium transition-colors">
                                                <input type="radio" name="jenis_laporan" value="kehilangan" required defaultChecked className="text-primary" />
                                                Kehilangan
                                            </label>
                                            <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-muted font-medium transition-colors">
                                                <input type="radio" name="jenis_laporan" value="penemuan" required className="text-primary" />
                                                Penemuan
                                            </label>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="nik">NIK (Opsional)</Label>
                                            <Input id="nik" name="nik" placeholder="NIK KTP" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="nomor_wa">WhatsApp</Label>
                                            <Input id="nomor_wa" name="nomor_wa" required placeholder="08xxx" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="nama_barang">Nama Barang</Label>
                                        <Input id="nama_barang" name="nama_barang" required placeholder="Contoh: Dompet Kulit Cokelat" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lokasi">Lokasi Kejadian / Ditemukan</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input id="lokasi" name="lokasi" required placeholder="Contoh: Depan Masjid Al-Ikhlas" className="pl-10" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ciri_ciri">Ciri-ciri / Deskripsi</Label>
                                        <Textarea id="ciri_ciri" name="ciri_ciri" required placeholder="Sebutkan ciri-ciri mendetail agar mudah dikenali" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="foto">Foto Barang</Label>
                                        <Input id="foto" name="foto" type="file" accept="image/*" />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={submitting}>
                                        {submitting ? "Mengirim..." : "Kirim Laporan"}
                                    </Button>
                                    {success && (
                                        <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm text-center">
                                            Laporan berhasil terkirim! Sedang ditinjau Admin.
                                        </div>
                                    )}
                                    {error && (
                                        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
                                            {error}
                                        </div>
                                    )}
                                </form>
                            </DialogContent>
                        </Dialog>
                        <button onClick={toggleDark} className="p-2 rounded-full hover:bg-muted transition-colors">
                            {isDark ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 container px-4 py-8 mx-auto">
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
                    <div className="flex p-1 bg-muted rounded-lg w-fit">
                        <Button
                            variant={activeTab === 'semua' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('semua')}
                        >
                            Semua
                        </Button>
                        <Button
                            variant={activeTab === 'kehilangan' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('kehilangan')}
                            className="gap-2"
                        >
                            <AlertTriangle className="h-3 w-3 text-red-500" /> Kehilangan
                        </Button>
                        <Button
                            variant={activeTab === 'penemuan' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('penemuan')}
                            className="gap-2"
                        >
                            <Info className="h-3 w-3 text-blue-500" /> Penemuan
                        </Button>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Info className="h-4 w-4" /> Daftar ini hanya menampilkan laporan yang sudah terverifikasi.
                    </div>
                </div>

                {loading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map(i => (
                            <Card key={i} className="animate-pulse h-48 bg-muted" />
                        ))}
                    </div>
                ) : filteredReports.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredReports.map((report) => (
                            <Card key={report.id} className="overflow-hidden border-muted group">
                                <div className="h-48 bg-muted relative">
                                    {report.foto_barang ? (
                                        <img src={`/storage/${report.foto_barang}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Camera className="h-12 w-12 text-muted-foreground/20" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 left-2">
                                        <Badge className={`${report.jenis_laporan === 'kehilangan' ? 'bg-red-500' : 'bg-blue-500'} border-none uppercase text-[10px]`}>
                                            {report.jenis_laporan}
                                        </Badge>
                                    </div>
                                </div>
                                <CardHeader className="p-4 space-y-1">
                                    <CardTitle className="text-xl line-clamp-1">{report.nama_barang}</CardTitle>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <MapPin className="h-3 w-3" /> {report.lokasi_kejadian}
                                    </div>
                                </CardHeader>
                                <CardContent className="px-4 pb-4 pt-0">
                                    <p className="text-xs text-muted-foreground line-clamp-2 italic mb-3">
                                        "{report.deskripsi_ciri_ciri}"
                                    </p>
                                    <div className="text-[10px] text-muted-foreground flex items-center gap-1 pt-2 border-t">
                                        <Calendar className="h-3 w-3" />
                                        Dilaporkan pada {new Date(report.created_at).toLocaleDateString('id-ID')}
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                    <Button
                                        className="w-full gap-2"
                                        variant="outline"
                                        onClick={() => window.open(`https://wa.me/62${report.nomor_wa_kontak.replace(/^0/, '')}?text=Halo, saya menghubungi terkait laporan ${report.jenis_laporan} ${report.nama_barang} di Papan Pengumuman Desa.`, '_blank')}
                                    >
                                        <MessageCircle className="h-4 w-4" /> Hubungi Pelapor
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 border-2 border-dashed rounded-2xl bg-muted/5">
                        <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground/20" />
                        <h3 className="text-xl font-semibold">Tidak ada laporan aktif</h3>
                        <p className="text-muted-foreground">Belum ada laporan {activeTab !== 'semua' ? activeTab : ''} yang dipublikasikan saat ini.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
