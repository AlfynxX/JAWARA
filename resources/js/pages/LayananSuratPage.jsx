import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LayoutDashboard, FileText, Send, Search, CheckCircle2, Clock, XCircle, Download, ArrowLeft, Sun, Moon } from "lucide-react";
import { Link } from 'react-router-dom';

export default function LayananSuratPage({ isDark, toggleDark }) {
    const [nik, setNik] = useState('');
    const [statusData, setStatusData] = useState([]);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const checkStatus = () => {
        if (!nik) return;
        setLoadingStatus(true);
        fetch(`/api/permohonan-surat?nik=${nik}`)
            .then(res => res.json())
            .then(data => {
                setStatusData(data);
                setLoadingStatus(false);
            })
            .catch(err => {
                console.error(err);
                setLoadingStatus(false);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(false);
        const formData = new FormData(e.target);

        fetch('/api/permohonan-surat', {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: formData
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || 'Terjadi kesalahan saat mengirim permohonan.');
                }
                return data;
            })
            .then(data => {
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
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4 mx-auto">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="p-2 hover:bg-muted rounded-full transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <span className="text-xl font-bold tracking-tight">Layanan Surat Online</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={toggleDark} className="p-2 rounded-full hover:bg-muted transition-colors">
                            {isDark ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 container px-4 py-8 mx-auto grid gap-8 md:grid-cols-2">
                {/* Form Request */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            Buat Permohonan Baru
                        </CardTitle>
                        <CardDescription>Pilih jenis surat dan lengkapi data diri Anda.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="nama_pemohon">Nama Lengkap</Label>
                                <Input id="nama_pemohon" name="nama_pemohon" required placeholder="Masukkan nama sesuai KTP" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="nik">NIK (Opsional)</Label>
                                    <Input id="nik" name="nik" placeholder="16 digit NIK" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="nomor_wa">Nomor WhatsApp</Label>
                                    <Input id="nomor_wa" name="nomor_wa" required placeholder="08xxx" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="jenis_surat">Jenis Surat</Label>
                                <Input id="jenis_surat" name="jenis_surat" required placeholder="Contoh: SKTM, Surat Domisili, dll" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="keperluan">Keperluan / Tujuan</Label>
                                <Textarea id="keperluan" name="keperluan" required placeholder="Jelaskan tujuan pembuatan surat ini" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="dokumen">Foto Persyaratan (KTP/KK) - Maks 7 File</Label>
                                <Input
                                    id="dokumen"
                                    name="dokumen[]"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files.length > 7) {
                                            alert("Maksimal upload adalah 7 file.");
                                            e.target.value = "";
                                        }
                                    }}
                                />
                                <p className="text-[10px] text-muted-foreground">Pilih maksimal 7 file gambar.</p>
                            </div>
                            <Button type="submit" className="w-full" disabled={submitting}>
                                {submitting ? "Mengirim..." : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" /> Kirim Permohonan
                                    </>
                                )}
                            </Button>
                            {success && (
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Permohonan berhasil dikirim! Silakan cek status di menu sebelah.
                                </div>
                            )}
                            {error && (
                                <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm flex items-center gap-2">
                                    <XCircle className="h-4 w-4" />
                                    {error}
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>

                {/* Status Tracking */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Search className="h-5 w-5 text-primary" />
                                Lacak Status Surat
                            </CardTitle>
                            <CardDescription>Masukkan NIK atau No. WA untuk melihat riwayat pengajuan.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Masukkan NIK atau No. WhatsApp"
                                    value={nik}
                                    onChange={(e) => setNik(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && checkStatus()}
                                />
                                <Button onClick={checkStatus} disabled={loadingStatus}>
                                    {loadingStatus ? <Clock className="animate-spin h-4 w-4" /> : "Cek"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <h3 className="font-semibold px-1">Riwayat Pengajuan</h3>
                        {statusData.length > 0 ? (
                            statusData.map((item, idx) => (
                                <Card key={idx} className="overflow-hidden border-l-4 border-l-primary">
                                    <CardContent className="p-4 flex justify-between items-center">
                                        <div className="space-y-1">
                                            <div className="font-bold">{item.jenis_surat}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </div>
                                            <div className="mt-2">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${item.status === 'selesai' ? 'bg-green-100 text-green-700' :
                                                    item.status === 'diproses' ? 'bg-orange-100 text-orange-700' :
                                                        item.status === 'ditolak' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        </div>
                                        {item.status === 'selesai' && item.file_hasil && (
                                            <a
                                                href={`/storage/${item.file_hasil}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex flex-col items-center gap-1 text-primary hover:text-primary/80"
                                            >
                                                <Download className="h-6 w-6" />
                                                <span className="text-[10px] font-medium">Download</span>
                                            </a>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-12 text-muted-foreground border rounded-lg bg-muted/20">
                                {nik ? "Data tidak ditemukan." : "Masukkan data di atas untuk melacak."}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
