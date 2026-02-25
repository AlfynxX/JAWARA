import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingBag, Store, Plus, Search, MessageCircle, ArrowLeft, Sun, Moon, Info, Tag } from "lucide-react";
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function LapakDesaPage({ isDark, toggleDark }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        setLoading(true);
        fetch('/api/produk-umkm')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(false);
        const formData = new FormData(e.target);

        fetch('/api/produk-umkm', {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: formData
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || 'Terjadi kesalahan saat mendaftar.');
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

    const filteredProducts = products.filter(p =>
        p.nama_produk.toLowerCase().includes(search.toLowerCase()) ||
        p.nama_toko.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4 mx-auto">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="p-2 hover:bg-muted rounded-full transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <span className="text-xl font-bold tracking-tight text-primary flex items-center gap-2">
                            <ShoppingBag className="h-6 w-6" /> Lapak Desa
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="sm" className="gap-2">
                                    <Plus className="h-4 w-4" /> Daftar Usaha
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Daftarkan Produk/Jasa UMKM</DialogTitle>
                                    <DialogDescription>
                                        Pasarkan produk Anda di platform desa. Data akan divalidasi oleh admin sebelum tayang.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleRegister} className="space-y-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="nik">NIK Pemilik</Label>
                                            <Input id="nik" name="nik" required placeholder="NIK sesuai KTP" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="nomor_wa">WhatsApp</Label>
                                            <Input id="nomor_wa" name="nomor_wa" required placeholder="08xxx" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="nama_toko">Nama Toko / Usaha</Label>
                                        <Input id="nama_toko" name="nama_toko" required placeholder="Contoh: Warung Berkah" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="nama_produk">Nama Produk/Jasa</Label>
                                        <Input id="nama_produk" name="nama_produk" required placeholder="Contoh: Keripik Singkong" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="harga">Harga (IDR)</Label>
                                        <Input id="harga" name="harga" type="number" required placeholder="5000" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="deskripsi">Deskripsi</Label>
                                        <Textarea id="deskripsi" name="deskripsi" required placeholder="Jelaskan keunggulan produk Anda" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="foto">Foto Produk</Label>
                                        <Input id="foto" name="foto" type="file" accept="image/*" />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={submitting}>
                                        {submitting ? "Mengirim..." : "Kirim Pendaftaran"}
                                    </Button>
                                    {success && (
                                        <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm text-center">
                                            Pendaftaran berhasil! Tunggu konfirmasi admin.
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
                <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Produk Unggulan Desa</h2>
                        <p className="text-muted-foreground">Mendukung ekonomi lokal melalui pemasaran digital.</p>
                    </div>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-9"
                            placeholder="Cari produk atau toko..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
                        {[1, 2, 3, 4].map(i => (
                            <Card key={i} className="animate-pulse">
                                <div className="aspect-square bg-muted" />
                                <CardHeader className="space-y-2">
                                    <div className="h-4 bg-muted rounded w-3/4" />
                                    <div className="h-3 bg-muted rounded w-1/2" />
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
                        {filteredProducts.map((product) => (
                            <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-muted">
                                <div className="aspect-square relative overflow-hidden bg-muted">
                                    {product.foto_produk ? (
                                        <img
                                            src={`/storage/${product.foto_produk}`}
                                            alt={product.nama_produk}
                                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                            UMKM
                                        </span>
                                    </div>
                                </div>
                                <CardHeader className="p-4 space-y-1">
                                    <div className="flex items-center gap-1 text-[10px] font-medium text-primary uppercase tracking-tighter">
                                        <Store className="h-3 w-3" /> {product.nama_toko}
                                    </div>
                                    <CardTitle className="text-lg line-clamp-1">{product.nama_produk}</CardTitle>
                                    <div className="text-xl font-bold text-primary">
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.harga)}
                                    </div>
                                </CardHeader>
                                <CardContent className="px-4 pb-4 pt-0">
                                    <p className="text-xs text-muted-foreground line-clamp-2 h-8">
                                        {product.deskripsi}
                                    </p>
                                </CardContent>
                                <CardFooter className="p-4 pt-0 border-t bg-muted/5 group-hover:bg-primary/5 transition-colors">
                                    <Button
                                        variant="outline"
                                        className="w-full gap-2 border-primary/20 hover:bg-primary hover:text-white"
                                        onClick={() => window.open(`https://wa.me/62${product.nomor_wa.replace(/^0/, '')}?text=Halo, saya tertarik dengan produk ${product.nama_produk} di Lapak Desa.`, '_blank')}
                                    >
                                        <MessageCircle className="h-4 w-4" /> Hubungi Penjual
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed rounded-xl bg-muted/10">
                        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                        <h3 className="text-xl font-semibold">Belum ada produk</h3>
                        <p className="text-muted-foreground">Produk UMKM akan tampil di sini setelah divalidasi admin.</p>
                        <Button variant="link" className="mt-2">Pelajari cara mendaftar</Button>
                    </div>
                )}
            </main>
        </div>
    );
}
