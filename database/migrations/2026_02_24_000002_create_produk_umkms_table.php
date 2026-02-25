<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produk_umkms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('citizen_id')->constrained()->cascadeOnDelete();
            $table->string('nama_toko');
            $table->string('nama_produk');
            $table->text('deskripsi');
            $table->decimal('harga', 15, 2);
            $table->string('foto_produk')->nullable();
            $table->string('nomor_wa');
            $table->boolean('is_active')->default(false); // Validasi admin
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produk_umkms');
    }
};
