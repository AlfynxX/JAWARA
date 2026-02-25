<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventaris', function (Blueprint $table) {
            $table->id();
            $table->string('nama_barang');
            $table->string('kode_barang')->unique()->nullable();
            $table->integer('jumlah_total');
            $table->integer('jumlah_tersedia');
            $table->string('foto_barang')->nullable();
            $table->timestamps();
        });

        Schema::create('peminjaman_inventaris', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inventaris_id')->constrained('inventaris')->cascadeOnDelete();
            $table->foreignId('citizen_id')->nullable()->constrained()->nullOnDelete();
            $table->string('nama_peminjam');
            $table->string('identitas_peminjam'); // File path image KTP
            $table->integer('jumlah');
            $table->date('tanggal_pinjam');
            $table->date('tanggal_kembali');
            $table->enum('status', ['menunggu', 'disetujui', 'ditolak', 'dikembalikan'])->default('menunggu');
            $table->text('catatan_admin')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('peminjaman_inventaris');
        Schema::dropIfExists('inventaris');
    }
};
