import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    ArrowLeft, Send, AlertCircle, MessageCircle,
    Clock, Search, Loader2, History, ChevronDown,
    MapPin, Camera, X, Moon, Sun
} from "lucide-react";
import { Link } from 'react-router-dom';

const STATUS_COLOR = {
    pending: 'text-yellow-600',
    in_process: 'text-blue-600',
    resolved: 'text-green-600',
    rejected: 'text-red-600',
};
const STATUS_LABEL = {
    pending: 'Menunggu',
    in_process: 'Sedang Diproses',
    resolved: 'Selesai',
    rejected: 'Ditolak',
};

export default function ReportPage({ isDark, toggleDark }) {
    const [formData, setFormData] = useState({ name: '', subject: '', description: '', nik: '' });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [location, setLocation] = useState({ latitude: null, longitude: null, address: null, loading: false, error: null });

    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // NIK-based history tracking
    const [trackName, setTrackName] = useState('');
    const [reports, setReports] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [historyLoaded, setHistoryLoaded] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const chatEndRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [reports]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setErrorMsg("Ukuran gambar terlalu besar (Maks 2MB)");
                return;
            }
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleGetLocation = () => {
        setLocation(prev => ({ ...prev, loading: true, error: null }));

        if (!navigator.geolocation) {
            setLocation(prev => ({ ...prev, loading: false, error: "Geolocation tidak didukung browser ini." }));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({
                    latitude,
                    longitude,
                    address: `Lat: ${latitude.toFixed(6)}, Long: ${longitude.toFixed(6)}`, // Placeholder until geocoding
                    loading: false,
                    error: null
                });
            },
            (error) => {
                let msg = "Gagal mengambil lokasi.";
                if (error.code === 1) msg = "Izin lokasi ditolak.";
                else if (error.code === 2) msg = "Lokasi tidak tersedia.";
                else if (error.code === 3) msg = "Waktu permintaan habis.";
                setLocation(prev => ({ ...prev, loading: false, error: msg }));
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSuccessMsg('');
        setErrorMsg('');

        const data = new FormData();
        data.append('name', formData.name);
        data.append('subject', formData.subject);
        data.append('description', formData.description);
        if (formData.nik) data.append('nik', formData.nik);
        if (image) data.append('image', image);
        if (location.latitude) data.append('latitude', location.latitude);
        if (location.longitude) data.append('longitude', location.longitude);
        if (location.address) data.append('location_address', location.address);

        fetch('/api/reports', {
            method: 'POST',
            body: data,
        })
            .then(async res => {
                const json = await res.json();
                if (!res.ok) {
                    // Handle validation errors (422) or other server errors
                    setErrorMsg(json.message || 'Gagal mengirim laporan. Periksa kembali data Anda.');
                    setSubmitting(false);
                    return;
                }
                if (json.report) {
                    setSuccessMsg('Laporan berhasil dikirim! Admin desa akan meninjau laporan Anda.');
                    setFormData({ name: '', subject: '', description: '', nik: '' });
                    removeImage();
                    setLocation({ latitude: null, longitude: null, address: null, loading: false, error: null });
                } else {
                    setErrorMsg(json.message || 'Gagal mengirim laporan.');
                }
                setSubmitting(false);
            })
            .catch(() => {
                setErrorMsg('Terjadi kesalahan koneksi. Silakan coba lagi.');
                setSubmitting(false);
            });
    };

    const handleTrackHistory = (e) => {
        e.preventDefault();
        setLoadingHistory(true);
        fetch(`/api/reports?name=${encodeURIComponent(trackName)}`)
            .then(res => res.json())
            .then(data => {
                setReports(Array.isArray(data) ? data : []);
                setHistoryLoaded(true);
                setLoadingHistory(false);
            })
            .catch(() => setLoadingHistory(false));
    };

    return (
        <div className="flex flex-col min-h-screen bg-muted/20">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
                <div className="container flex h-16 items-center gap-4 px-4 mx-auto">
                    <Link to="/">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft className="h-4 w-4" /> Kembali
                        </Button>
                    </Link>
                    <div>
                        <h1 className="font-bold text-lg leading-none">Layanan Pengaduan Warga</h1>
                        <p className="text-xs text-muted-foreground">Sampaikan laporan Anda langsung ke Admin Desa</p>
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

            <main className="flex-1 container max-w-3xl px-4 py-8 mx-auto space-y-6">

                {/* Submit Report Form */}
                <Card className="shadow-md border-t-4 border-t-primary">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5 text-primary" />
                            Kirim Laporan Baru
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name">Nama Lengkap <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="name"
                                        placeholder="Masukkan nama Anda"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="subject">Subjek / Judul <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="subject"
                                        placeholder="Contoh: Jalan rusak RT 03"
                                        value={formData.subject}
                                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="description">Isi Laporan <span className="text-red-500">*</span></Label>
                                <Textarea
                                    id="description"
                                    placeholder="Jelaskan laporan Anda secara rinci..."
                                    className="min-h-[100px] resize-none"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Image Upload */}
                                <div className="space-y-1.5">
                                    <Label>Lampirkan Foto (Opsional)</Label>
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="image-upload"
                                        />

                                        {!imagePreview ? (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-full h-20 border-dashed border-2 flex flex-col gap-1 items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <Camera className="h-5 w-5" />
                                                <span className="text-xs">Klik untuk tambah foto</span>
                                            </Button>
                                        ) : (
                                            <div className="relative rounded-md overflow-hidden border h-40 group">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={removeImage}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="space-y-1.5">
                                    <Label>Lokasi Laporan (Opsional)</Label>
                                    <div className="border rounded-md p-3 space-y-2 bg-muted/10">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                {location.latitude ? "Lokasi Disematkan" : "Belum ada lokasi"}
                                            </span>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleGetLocation}
                                                disabled={location.loading}
                                                className="h-8 gap-1.5"
                                            >
                                                {location.loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <MapPin className="h-3.5 w-3.5 text-red-500" />}
                                                {location.latitude ? "Perbarui" : "Bagikan Lokasi"}
                                            </Button>
                                        </div>

                                        {location.error && (
                                            <p className="text-xs text-red-500">{location.error}</p>
                                        )}

                                        {location.latitude && (
                                            <div className="text-xs bg-background p-2 rounded border font-mono truncate">
                                                {location.latitude}, {location.longitude}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="nik" className="flex items-center gap-1">
                                    NIK <span className="text-xs text-muted-foreground">(opsional — agar laporan bisa dilacak)</span>
                                </Label>
                                <Input
                                    id="nik"
                                    placeholder="NIK 16 digit (opsional)"
                                    value={formData.nik}
                                    onChange={e => setFormData({ ...formData, nik: e.target.value })}
                                />
                            </div>

                            {successMsg && (
                                <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
                                    <MessageCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                    {successMsg}
                                </div>
                            )}
                            {errorMsg && (
                                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
                                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                    {errorMsg}
                                </div>
                            )}

                            <Button type="submit" className="w-full gap-2" size="lg" disabled={submitting}>
                                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                Kirim Laporan
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="bg-muted/30 text-xs text-muted-foreground flex items-center gap-1.5 py-3">
                        <AlertCircle className="h-3 w-3" />
                        Laporan dikirim secara privat dan hanya dapat dilihat oleh Admin Desa.
                    </CardFooter>
                </Card>

                {/* Track Report Section */}
                <Card className="shadow-sm">
                    <CardHeader
                        className="cursor-pointer select-none"
                        onClick={() => setShowHistory(!showHistory)}
                    >
                        <CardTitle className="flex items-center justify-between text-base">
                            <span className="flex items-center gap-2">
                                <History className="h-4 w-4 text-muted-foreground" />
                                Lacak Riwayat Laporan (cari nama)
                            </span>
                            <ChevronDown className={`h-4 w-4 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
                        </CardTitle>
                    </CardHeader>
                    {showHistory && (
                        <CardContent className="space-y-4 pt-0">
                            <form onSubmit={handleTrackHistory} className="flex gap-2">
                                <Input
                                    placeholder="Masukkan nama pelapor"
                                    value={trackName}
                                    onChange={e => setTrackName(e.target.value)}
                                    required
                                />
                                <Button type="submit" disabled={loadingHistory} className="gap-2 shrink-0">
                                    {loadingHistory ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                    Cek
                                </Button>
                            </form>

                            {historyLoaded && (
                                reports.length === 0 ? (
                                    <p className="text-center text-sm text-muted-foreground py-4">
                                        Tidak ada laporan yang ditemukan untuk NIK ini.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {reports.map((report, idx) => (
                                            <div key={idx} className="p-4 rounded-lg border bg-background space-y-2">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <p className="font-semibold text-sm">{report.title}</p>
                                                        <p className="text-xs text-muted-foreground mt-0.5">{report.content}</p>
                                                    </div>
                                                    <span className={`text-xs font-bold shrink-0 ${STATUS_COLOR[report.status] || 'text-gray-500'}`}>
                                                        {STATUS_LABEL[report.status] || report.status}
                                                    </span>
                                                </div>
                                                {report.admin_response && (
                                                    <div className="bg-blue-50 border border-blue-100 rounded p-2 text-xs text-blue-800">
                                                        <strong>Balasan Admin:</strong> {report.admin_response}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={chatEndRef} />
                                    </div>
                                )
                            )}
                        </CardContent>
                    )}
                </Card>
            </main>
        </div>
    );
}
