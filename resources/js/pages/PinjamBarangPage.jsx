import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Package, Plus, Search, ArrowLeft, Sun, Moon, Info, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function PinjamBarangPage({ isDark, toggleDark }) {
    const [items, setItems] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        setLoading(true);
        fetch('/api/inventaris')
            .then(res => res.json())
            .then(data => {
                setItems(data.items);
                setBookings(data.bookings);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const handleBooking = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(false);
        const formData = new FormData(e.target);

        fetch('/api/inventaris/booking', {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: formData
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || 'Terjadi kesalahan saat membooking.');
                }
                return data;
            })
            .then(data => {
                setSubmitting(false);
                setSuccess(true);
                e.target.reset();
                fetchData();
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
                            <Package className="h-6 w-6" /> Peminjaman Inventaris
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={toggleDark} className="p-2 rounded-full hover:bg-muted transition-colors">
                            {isDark ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 container px-4 py-8 mx-auto">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold">Barang & Peralatan Desa</h2>
                    <p className="text-muted-foreground">Warga dapat meminjam peralatan desa untuk keperluan sosial/kemasyarakatan.</p>
                </div>

                {loading ? (
                    <div className="grid gap-6 md:grid-cols-3">
                        {[1, 2, 3].map(i => (
                            <Card key={i} className="animate-pulse">
                                <div className="h-48 bg-muted" />
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-muted rounded w-3/4" />
                                    <div className="h-3 bg-muted rounded w-1/2" />
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {items.map((item) => (
                            <Card key={item.id} className="overflow-hidden border-muted flex flex-col">
                                <div className="h-48 bg-muted relative">
                                    {item.foto_barang ? (
                                        <img src={`/storage/${item.foto_barang}`} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Package className="h-16 w-16 text-muted-foreground/20" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-1">
                                        <Badge variant={item.jumlah_tersedia > 0 ? "success" : "destructive"} className="bg-white/90 backdrop-blur text-black border-none">
                                            {item.jumlah_tersedia} Tersedia
                                        </Badge>
                                    </div>
                                </div>
                                <CardHeader className="p-4 space-y-1">
                                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{item.kode_barang}</div>
                                    <CardTitle className="text-xl">{item.nama_barang}</CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 pb-4 pt-0 flex-1">
                                    <div className="space-y-3">
                                        <div className="p-3 bg-muted/30 rounded-lg text-xs space-y-2">
                                            <div className="font-semibold flex items-center gap-1">
                                                <Calendar className="h-3 w-3" /> Agenda Booking Terdekat:
                                            </div>
                                            {bookings.filter(b => b.inventaris_id === item.id).length > 0 ? (
                                                <div className="space-y-1">
                                                    {bookings.filter(b => b.inventaris_id === item.id).slice(0, 2).map((b, i) => (
                                                        <div key={i} className="flex justify-between items-center text-[10px]">
                                                            <span>{new Date(b.tanggal_pinjam).toLocaleDateString()} - {new Date(b.tanggal_kembali).toLocaleDateString()}</span>
                                                            <span className="font-bold">({b.jumlah} Unit)</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-muted-foreground italic tracking-tight">Belum ada agenda booking.</div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                className="w-full gap-2"
                                                disabled={item.jumlah_tersedia <= 0}
                                                onClick={() => setSelectedItem(item)}
                                            >
                                                <Calendar className="h-4 w-4" /> Booking Sekarang
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[500px]">
                                            <DialogHeader>
                                                <DialogTitle>Formulir Peminjaman: {selectedItem?.nama_barang}</DialogTitle>
                                                <DialogDescription>
                                                    Isi detail peminjaman. Anda perlu mengupload foto KTP sebagai jaminan.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={handleBooking} className="space-y-4 py-4">
                                                <input type="hidden" name="inventaris_id" value={selectedItem?.id || ''} />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="nik">NIK Peminjam</Label>
                                                        <Input id="nik" name="nik" placeholder="NIK sesuai KTP" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="nama_peminjam">Nama Lengkap</Label>
                                                        <Input id="nama_peminjam" name="nama_peminjam" required placeholder="Nama Lengkap" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="jumlah">Jumlah</Label>
                                                        <Input id="jumlah" name="jumlah" type="number" defaultValue="1" min="1" max={selectedItem?.jumlah_tersedia} required />
                                                    </div>
                                                    <div className="space-y-2 col-span-2">
                                                        <Label htmlFor="identitas">Foto Kartu Identitas (KTP) - Maks 7 File</Label>
                                                        <Input
                                                            id="identitas"
                                                            name="identitas[]"
                                                            type="file"
                                                            multiple
                                                            accept="image/*"
                                                            required
                                                            onChange={(e) => {
                                                                if (e.target.files.length > 7) {
                                                                    alert("Maksimal upload adalah 7 file.");
                                                                    e.target.value = "";
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="tanggal_pinjam">Tgl Mulai</Label>
                                                        <Input id="tanggal_pinjam" name="tanggal_pinjam" type="date" required />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="tanggal_kembali">Tgl Kembali</Label>
                                                        <Input id="tanggal_kembali" name="tanggal_kembali" type="date" required />
                                                    </div>
                                                </div>
                                                <Button type="submit" className="w-full" disabled={submitting}>
                                                    {submitting ? "Mengirim..." : "Ajukan Peminjaman"}
                                                </Button>
                                                {success && (
                                                    <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm text-center flex items-center justify-center gap-2">
                                                        <CheckCircle2 className="h-4 w-4" /> Berhasil diajukan! Tunggu konfirmasi.
                                                    </div>
                                                )}
                                                {error && (
                                                    <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center flex items-center justify-center gap-2">
                                                        <AlertCircle className="h-4 w-4" /> {error}
                                                    </div>
                                                )}
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                <div className="mt-12 p-6 bg-primary/5 rounded-2xl border border-primary/10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <Info className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-1 text-center md:text-left">
                        <h4 className="font-bold text-lg">Prosedur Peminjaman</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            1. Ajukan booking online melalui form di atas.<br />
                            2. Admin akan melakukan pengecekan ketersediaan dan validasi data.<br />
                            3. Ambil barang di kantor desa pada hari yang ditentukan dengan membawa KTP asli.<br />
                            4. Pastikan barang dikembalikan sesuai jadwal dalam kondisi baik.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
