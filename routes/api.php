<?php

use App\Http\Controllers\Api\PublicApiController;
use Illuminate\Support\Facades\Route;

Route::get('/stats', [PublicApiController::class, 'getStats']);
Route::get('/finance', [PublicApiController::class, 'getFinanceData']);
Route::get('/social-aid', [PublicApiController::class, 'getSocialAidData']);
Route::get('/reports', [PublicApiController::class, 'getReports']);
Route::post('/reports', [PublicApiController::class, 'submitReport']);
