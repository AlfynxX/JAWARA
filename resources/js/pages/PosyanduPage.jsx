import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Calendar, Users, Phone, Bell, ArrowLeft, Sun, Moon, Info, CheckCircle2, Activity } from "lucide-react";
import { Link } from 'react-router-dom';

export default function PosyanduPage({ isDark, toggleDark }) {
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
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4 mx-auto">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="p-2 hover:bg-muted rounded-full transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <span className="text-xl font-bold tracking-tight text-primary flex items-center gap-2">
                            <Heart className="h-6 w-6 text-red-500" /> Layanan Posyandu
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={toggleDark} className="p-2 rounded-full hover:bg-muted transition-colors">
                            {isDark ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 container px-4 py-8 mx-auto grid gap-8 lg:grid-cols-2">
                {/* Info Section */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Kesehatan Warga Adalah Prioritas</h2>
                        <p className="text-muted-foreground mt-2">Daftarkan balita atau lansia untuk mendapatkan pemantauan kesehatan rutin dan notifikasi jadwal posyandu via WhatsApp.</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900">
                            <CardHeader className="pb-2">
                                <Users className="h-5 w-5 text-blue-500" />
                                <CardTitle className="text-lg">Balita</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">Imunisasi, timbang berat badan, dan konsultasi gizi rutin setiap bulan.</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-green-50/50 dark:bg-green-950/20 border-green-100 dark:border-green-900">
                            <CardHeader className="pb-2">
                                <Activity className="h-5 w-5 text-green-500" />
                                <CardTitle className="text-lg">Lansia</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">Pengecekan tekanan darah, gula darah, dan senam lansia rutin.</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" /> Jadwal Mendatang
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {stats?.schedules?.filter(s => s.recipient_type === 'citizen').length > 0 ? (
                                stats.schedules.map((s, i) => (
                                    <div key={i} className="flex gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="flex flex-col items-center justify-center p-2 bg-primary/10 rounded-lg min-w-[60px] h-[60px]">
                                            <span className="text-[10px] font-bold uppercase">{new Date(s.start_time).toLocaleDateString('id-ID', { month: 'short' })}</span>
                                            <span className="text-xl font-black">{new Date(s.start_time).getDate()}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="font-bold leading-tight">{s.title}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {new Date(s.start_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                            </div>
                                            <div className="text-[10px] text-primary font-medium">{s.location || 'Posyandu Desa'}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-muted-foreground italic border-2 border-dashed rounded-xl">
                                    Belum ada jadwal khusus posyandu yang diinput.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Registration Form */}
                <Card className="h-fit sticky top-24">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-primary" /> Daftar Notifikasi Posyandu
                        </CardTitle>
                        <CardDescription>Dapatkan pengingat H-1 melalui WhatsApp untuk jadwal posyandu.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="nama_sasaran">Nama Balita / Lansia</Label>
                                <Input id="nama_sasaran" name="nama_sasaran" required placeholder="Nama lengkap" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="kategori">Kategori</Label>
                                    <select name="kategori" id="kategori" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                        <option value="balita">Balita</option>
                                        <option value="lansia">Lansia</option>
                                    </select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                                    <Input id="tanggal_lahir" name="tanggal_lahir" type="date" required />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="wali">Nama Orang Tua / Wali</Label>
                                <Input id="wali" name="wali" placeholder="Nama penanggung jawab" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nomor_wa">Nomor WhatsApp Aktif</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="nomor_wa" name="nomor_wa" required placeholder="08xxxxxxxxxx" className="pl-9" />
                                </div>
                                <p className="text-[10px] text-muted-foreground italic">Pastikan nomor aktif untuk menerima pengingat otomatis.</p>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nik">NIK Pendaftar (Opsional)</Label>
                                <Input id="nik" name="nik" placeholder="Untuk pendataan otomatis warga" />
                            </div>
                            <Button type="submit" className="w-full" disabled={submitting}>
                                {submitting ? "Mendaftarkan..." : "Daftar Notifikasi"}
                            </Button>
                            {success && (
                                <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-xl text-sm border border-green-200 dark:border-green-800 flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
                                    <span>
                                        <strong>Pendaftaran Berhasil!</strong><br />
                                        Sistem akan mengirimkan pesan konfirmasi ke nomor WhatsApp Anda sebentar lagi.
                                    </span>
                                </div>
                            )}
                            {error && (
                                <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl text-sm border border-red-200 dark:border-red-800 flex items-start gap-3">
                                    <XCircle className="h-5 w-5 mt-0.5 shrink-0" />
                                    <span>
                                        <strong>Pendaftaran Gagal</strong><br />
                                        {error}
                                    </span>
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
