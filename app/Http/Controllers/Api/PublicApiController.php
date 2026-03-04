<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Citizen;
use App\Models\Household;
use App\Models\Report;
use Illuminate\Http\Request;

class PublicApiController extends Controller
{
    public function getStats()
    {
        $totalIncome = \App\Models\FinancialRecord::where('type', 'income')->sum('amount');
        $totalExpense = \App\Models\FinancialRecord::where('type', 'expense')->sum('amount');

        // Get upcoming or ongoing schedules (not yet ended or no end time specified)
        $schedules = \App\Models\Schedule::where(function ($query) {
            $query->where('start_time', '>=', now())
                ->orWhere(function ($q) {
                    $q->where('start_time', '<=', now())
                        ->where(function ($sq) {
                            $sq->where('end_time', '>=', now())
                                ->orWhereNull('end_time');
                        });
                });
        })
            ->orderBy('start_time', 'asc')
            ->take(5)
            ->get();

        return response()->json([
            'total_citizens' => Citizen::count(),
            'total_households' => Household::count(),
            'total_elderly' => Citizen::where('is_elderly', true)->count(),
            'total_poor' => Citizen::where('is_poor', true)->count(),
            'total_reports' => Report::count(),
            'cash_balance' => $totalIncome - $totalExpense,
            'total_income' => $totalIncome,
            'total_expense' => $totalExpense,
            'schedules' => $schedules,
        ]);
    }

    public function getGallery()
    {
        $galleries = \App\Models\VillageGallery::where('is_active', true)
            ->orderBy('sort_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($gallery) {
                return [
                    'id' => $gallery->id,
                    'title' => $gallery->title,
                    'description' => $gallery->description,
                    'image_url' => $gallery->image_url,
                ];
            });

        return response()->json($galleries);
    }

    public function getFinanceData()
    {
        $records = \App\Models\FinancialRecord::latest()->take(50)->get();

        // Group by month for chart (last 6 months)
        $chartData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $monthName = $month->format('M');
            $income = \App\Models\FinancialRecord::where('type', 'income')
                ->whereYear('transaction_date', $month->year)
                ->whereMonth('transaction_date', $month->month)
                ->sum('amount');
            $expense = \App\Models\FinancialRecord::where('type', 'expense')
                ->whereYear('transaction_date', $month->year)
                ->whereMonth('transaction_date', $month->month)
                ->sum('amount');

            $chartData[] = [
                'name' => $monthName,
                'income' => (float)$income,
                'expense' => (float)$expense,
            ];
        }

        return response()->json([
            'chart_data' => $chartData,
            'recent_transactions' => $records
        ]);
    }

    public function getSocialAidData()
    {
        $recipients = \App\Models\SocialAidRecipient::with(['citizen', 'socialAid'])
            ->latest()
            ->take(100)
            ->get();

        return response()->json($recipients);
    }

    public function getReports(Request $request)
    {
        $name = $request->query('name');

        if (!$name) {
            return response()->json([]);
        }

        $reports = Report::where('reporter_name', 'like', '%' . $name . '%')
            ->orWhereHas('citizen', function ($query) use ($name) {
                $query->where('name', 'like', '%' . $name . '%');
            })
            ->latest()
            ->get();

        return response()->json($reports);
    }

    public function submitReport(Request $request)
    {
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'name'             => 'required|string',
            'subject'          => 'required|string',
            'description'      => 'required|string',
            'nik'              => 'nullable|string',
            'image'            => 'nullable|file|mimes:jpg,jpeg,png,webp,gif|max:5120', // 5MB Max, explicit mimes
            'latitude'         => 'nullable|numeric',
            'longitude'        => 'nullable|numeric',
            'location_address' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first(),
                'errors'  => $validator->errors(),
            ], 422);
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('reports', 'public');
        }

        $citizenId = null;
        if ($request->nik) {
            $citizen = Citizen::where('nik', $request->nik)->first();
            if ($citizen) {
                $citizenId = $citizen->id;
            }
        }

        $report = Report::create([
            'citizen_id' => $citizenId,
            'reporter_name' => $request->name,
            'reporter_phone' => $request->nik,
            'title' => $request->subject,
            'content' => $request->description,
            'image' => $imagePath,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'location_address' => $request->location_address,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Laporan berhasil dikirim.',
            'report' => $report
        ]);
    }

    // 1. Permohonan Surat
    public function getPermohonanSurat(Request $request)
    {
        $nik = $request->query('nik');
        if (!$nik) return response()->json([]);

        $reports = \App\Models\PermohonanSurat::whereHas('citizen', function ($q) use ($nik) {
            $q->where('nik', $nik);
        })->orWhere('nomor_wa', $nik)->latest()->get();

        return response()->json($reports);
    }

    public function submitPermohonanSurat(Request $request)
    {
        $request->validate([
            'nama_pemohon' => 'required|string',
            'nomor_wa' => 'required|string',
            'jenis_surat' => 'required|string',
            'keperluan' => 'required|string',
            'nik' => 'nullable|string',
            'dokumen' => 'nullable|array|max:7',
            'dokumen.*' => 'file|image|max:5120',
        ], [
            'dokumen.max' => 'Maksimal upload adalah 7 file.',
        ]);

        $citizen = null;
        if ($request->nik) {
            $citizen = Citizen::where('nik', $request->nik)->first();
        }

        $files = [];
        if ($request->hasFile('dokumen')) {
            foreach ($request->file('dokumen') as $file) {
                $files[] = $file->store('permohonan-surat/syarat', 'public');
            }
        }

        $request_surat = \App\Models\PermohonanSurat::create([
            'citizen_id' => $citizen?->id,
            'nama_pemohon' => $request->nama_pemohon,
            'nomor_wa' => $request->nomor_wa,
            'jenis_surat' => $request->jenis_surat,
            'keperluan' => $request->keperluan,
            'dokumen_persyaratan' => $files,
            'status' => 'menunggu',
        ]);

        return response()->json(['message' => 'Permohonan surat berhasil dikirim.', 'data' => $request_surat]);
    }

    // 2. Produk UMKM
    public function getProdukUmkm()
    {
        $products = \App\Models\ProdukUmkm::where('is_active', true)->latest()->get();
        return response()->json($products);
    }

    public function submitProdukUmkm(Request $request)
    {
        $request->validate([
            'nama_toko' => 'required|string',
            'nama_produk' => 'required|string',
            'harga' => 'required|numeric',
            'deskripsi' => 'required|string',
            'nomor_wa' => 'required|string',
            'nik' => 'required|string',
            'foto' => 'nullable|file|image|max:5120',
        ]);

        $citizen = Citizen::where('nik', $request->nik)->first();
        if (!$citizen) {
            return response()->json(['message' => 'NIK tidak terdaftar sebagai warga desa.'], 422);
        }

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('umkm/produk', 'public');
        }

        $product = \App\Models\ProdukUmkm::create([
            'citizen_id' => $citizen->id,
            'nama_toko' => $request->nama_toko,
            'nama_produk' => $request->nama_produk,
            'harga' => $request->harga,
            'deskripsi' => $request->deskripsi,
            'nomor_wa' => $request->nomor_wa,
            'foto_produk' => $fotoPath,
            'is_active' => false, // Menunggu validasi admin
        ]);

        return response()->json(['message' => 'Pendaftaran UMKM berhasil, menunggu validasi admin.', 'data' => $product]);
    }

    // 3. Inventaris
    public function getInventaris()
    {
        $items = \App\Models\Inventaris::all();
        $bookings = \App\Models\PeminjamanInventaris::whereIn('status', ['menunggu', 'disetujui'])->get();

        return response()->json([
            'items' => $items,
            'bookings' => $bookings
        ]);
    }

    public function submitBookingInventaris(Request $request)
    {
        $request->validate([
            'inventaris_id' => 'required|exists:inventaris,id',
            'nama_peminjam' => 'required|string',
            'jumlah' => 'required|numeric|min:1',
            'tanggal_pinjam' => 'required|date',
            'tanggal_kembali' => 'required|date|after_or_equal:tanggal_pinjam',
            'nik' => 'nullable|string',
            'identitas' => 'required|array|max:7',
            'identitas.*' => 'file|image|max:5120',
        ], [
            'identitas.max' => 'Maksimal upload adalah 7 file identitas.',
        ]);

        $citizen = null;
        if ($request->nik) {
            $citizen = Citizen::where('nik', $request->nik)->first();
        }

        $identitasPaths = [];
        if ($request->hasFile('identitas')) {
            foreach ($request->file('identitas') as $file) {
                $identitasPaths[] = $file->store('peminjaman/identitas', 'public');
            }
        }

        $booking = \App\Models\PeminjamanInventaris::create([
            'inventaris_id' => $request->inventaris_id,
            'citizen_id' => $citizen?->id,
            'nama_peminjam' => $request->nama_peminjam,
            'identitas_peminjam' => $identitasPaths,
            'jumlah' => $request->jumlah,
            'tanggal_pinjam' => $request->tanggal_pinjam,
            'tanggal_kembali' => $request->tanggal_kembali,
            'status' => 'menunggu',
        ]);

        return response()->json(['message' => 'Booking berhasil diajukan.', 'data' => $booking]);
    }

    // 4. Data Posyandu
    public function registerPosyandu(Request $request)
    {
        $request->validate([
            'nama_sasaran' => 'required|string',
            'kategori' => 'required|in:balita,lansia',
            'nomor_wa' => 'required|string',
            'tanggal_lahir' => 'nullable|date',
            'wali' => 'nullable|string',
            'nik' => 'nullable|string',
        ]);

        $citizen = null;
        if ($request->nik) {
            $citizen = Citizen::where('nik', $request->nik)->first();
        }

        $data = \App\Models\DataPosyandu::create([
            'citizen_id' => $citizen?->id,
            'nama_sasaran' => $request->nama_sasaran,
            'kategori' => $request->kategori,
            'tanggal_lahir' => $request->tanggal_lahir,
            'nama_orang_tua_wali' => $request->wali,
            'nomor_wa_notifikasi' => $request->nomor_wa,
        ]);

        return response()->json(['message' => 'Data sasaran berhasil didaftarkan.', 'data' => $data]);
    }

    // 5. Laporan Kehilangan
    public function getLaporanKehilangan()
    {
        $reports = \App\Models\LaporanKehilangan::where('is_verified', true)
            ->where('status', 'aktif')
            ->latest()
            ->get();
        return response()->json($reports);
    }

    public function submitLaporanKehilangan(Request $request)
    {
        $request->validate([
            'jenis_laporan' => 'required|in:kehilangan,penemuan',
            'nama_barang' => 'required|string',
            'ciri_ciri' => 'required|string',
            'lokasi' => 'required|string',
            'nomor_wa' => 'required|string',
            'nik' => 'nullable|string',
            'foto' => 'nullable|file|image|max:5120',
        ]);

        $citizen = null;
        if ($request->nik) {
            $citizen = Citizen::where('nik', $request->nik)->first();
        }

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('kehilangan', 'public');
        }

        $report = \App\Models\LaporanKehilangan::create([
            'citizen_id' => $citizen?->id,
            'jenis_laporan' => $request->jenis_laporan,
            'nama_barang' => $request->nama_barang,
            'deskripsi_ciri_ciri' => $request->ciri_ciri,
            'lokasi_kejadian' => $request->lokasi,
            'nomor_wa_kontak' => $request->nomor_wa,
            'foto_barang' => $fotoPath,
            'status' => 'aktif',
            'is_verified' => false, // Moderasi admin
        ]);

        return response()->json(['message' => 'Laporan berhasil dikirim, akan ditinjau oleh admin.', 'data' => $report]);
    }
}
