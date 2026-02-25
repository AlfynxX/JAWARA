<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('data_posyandus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('citizen_id')->nullable()->constrained()->nullOnDelete();
            $table->string('nama_sasaran');
            $table->enum('kategori', ['balita', 'lansia']);
            $table->date('tanggal_lahir')->nullable();
            $table->string('nama_orang_tua_wali')->nullable();
            $table->string('nomor_wa_notifikasi');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('data_posyandus');
    }
};
