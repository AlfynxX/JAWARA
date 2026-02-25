<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('permohonan_surats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('citizen_id')->nullable()->constrained()->nullOnDelete();
            $table->string('nama_pemohon');
            $table->string('nomor_wa');
            $table->string('jenis_surat');
            $table->text('keperluan')->nullable();
            $table->json('dokumen_persyaratan')->nullable(); // Paths to uploaded images
            $table->string('file_hasil')->nullable(); // Path to generated PDF
            $table->enum('status', ['menunggu', 'diproses', 'selesai', 'ditolak'])->default('menunggu');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('permohonan_surats');
    }
};
