<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('laporan_kehilangans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('citizen_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('jenis_laporan', ['kehilangan', 'penemuan']);
            $table->string('nama_barang');
            $table->text('deskripsi_ciri_ciri');
            $table->string('lokasi_kejadian');
            $table->string('foto_barang')->nullable();
            $table->string('nomor_wa_kontak');
            $table->enum('status', ['aktif', 'selesai', 'diarsipkan'])->default('aktif');
            $table->boolean('is_verified')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laporan_kehilangans');
    }
};
