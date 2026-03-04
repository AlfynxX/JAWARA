<?php

use App\Http\Controllers\Api\PublicApiController;
use Illuminate\Support\Facades\Route;

Route::get('/stats', [PublicApiController::class, 'getStats']);
Route::get('/finance', [PublicApiController::class, 'getFinanceData']);
Route::get('/social-aid', [PublicApiController::class, 'getSocialAidData']);
Route::get('/reports', [PublicApiController::class, 'getReports']);
Route::post('/reports', [PublicApiController::class, 'submitReport']);

// New Features
Route::get('/permohonan-surat', [PublicApiController::class, 'getPermohonanSurat']);
Route::post('/permohonan-surat', [PublicApiController::class, 'submitPermohonanSurat']);

Route::get('/produk-umkm', [PublicApiController::class, 'getProdukUmkm']);
Route::post('/produk-umkm', [PublicApiController::class, 'submitProdukUmkm']);

Route::get('/inventaris', [PublicApiController::class, 'getInventaris']);
Route::post('/inventaris/booking', [PublicApiController::class, 'submitBookingInventaris']);

Route::post('/posyandu/register', [PublicApiController::class, 'registerPosyandu']);

Route::get('/laporan-kehilangan', [PublicApiController::class, 'getLaporanKehilangan']);
Route::post('/laporan-kehilangan', [PublicApiController::class, 'submitLaporanKehilangan']);

Route::get('/gallery', [PublicApiController::class, 'getGallery']);
