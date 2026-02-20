<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Households (Kartu Keluarga)
        Schema::create('households', function (Blueprint $table) {
            $table->id();
            $table->string('kk_number')->unique();
            $table->string('head_of_family');
            $table->text('address')->nullable();
            $table->string('rt')->nullable();
            $table->string('rw')->nullable();
            $table->timestamps();
        });

        // 2. Citizens (Warga)
        Schema::create('citizens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('household_id')->constrained()->cascadeOnDelete();
            $table->string('nik')->unique();
            $table->string('name');
            $table->string('phone')->nullable();
            $table->enum('gender', ['male', 'female']);
            $table->date('birth_date')->nullable();
            $table->enum('marital_status', ['single', 'married', 'divorced', 'widowed'])->nullable();
            $table->string('job')->nullable();
            $table->boolean('is_head_of_household')->default(false);
            $table->enum('status', ['permanent', 'contract', 'temporary'])->default('permanent');
             // For "data orang (lansia pengangguran penerima bansos orang miskin)" feature
            $table->boolean('is_poor')->default(false);
             $table->boolean('is_elderly')->default(false);
             $table->boolean('is_unemployed')->default(false);
            $table->timestamps();
        });

        // 3. Schedules (Jadwal: Kamling, Rutinan, Kerja Bakti, Acara Desa)
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('type', ['kamling', 'rutinan', 'kerja_bakti', 'event']);
            $table->dateTime('start_time');
            $table->dateTime('end_time')->nullable();
            $table->string('location')->nullable();
            $table->text('description')->nullable();
             // For Rutinan: "next host" logic might be handled in description or a separate relation, keeping it simple for now
            $table->timestamps();
        });

        // Pivot table for assigning citizens to schedules (e.g., Kamling roster)
        Schema::create('schedule_citizens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('schedule_id')->constrained()->cascadeOnDelete();
            $table->foreignId('citizen_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_present')->default(false);
            $table->timestamps();
        });

        // 4. Reports (Laporan Warga)
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            // Optional: link to citizen if logged in, otherwise use arbitrary name/phone
            $table->foreignId('citizen_id')->nullable()->constrained()->nullOnDelete();
            $table->string('reporter_name');
            $table->string('reporter_phone')->nullable();
            $table->string('title');
            $table->text('content');
            $table->string('image')->nullable();
            $table->enum('status', ['pending', 'in_process', 'resolved', 'rejected'])->default('pending');
            $table->text('admin_response')->nullable();
            $table->timestamps();
        });

        // 5. Social Aids (Bansos)
        Schema::create('social_aids', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "BLT Dana Desa"
            $table->string('description')->nullable();
            $table->decimal('amount', 15, 2)->nullable(); // Monetary value if applicable
            $table->date('distribution_date')->nullable();
            $table->string('location')->nullable(); // Where to pick up
            $table->text('requirements')->nullable(); // "Apa saja yang perlu dibawa"
            $table->timestamps();
        });

        // Recipients of Social Aid
        Schema::create('social_aid_recipients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('social_aid_id')->constrained()->cascadeOnDelete();
            $table->foreignId('citizen_id')->constrained()->cascadeOnDelete();
            $table->enum('status', ['pending', 'received', 'cancelled'])->default('pending');
            $table->dateTime('received_at')->nullable();
            $table->timestamps();
        });

        // 6. Financial Records (Laporan Keuangan)
        Schema::create('financial_records', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['income', 'expense']); // Pemasukan / Pengeluaran
            $table->decimal('amount', 15, 2);
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('transaction_date');
            $table->string('receipt_image')->nullable(); // Bukti transaksi
            $table->timestamps();
        });

        // 7. Documents (Arsip Data Digital)
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('file_path');
            $table->boolean('is_public')->default(false); // True = accessible by residents, False = Admin only
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
        Schema::dropIfExists('financial_records');
        Schema::dropIfExists('social_aid_recipients');
        Schema::dropIfExists('social_aids');
        Schema::dropIfExists('reports');
        Schema::dropIfExists('schedule_citizens');
        Schema::dropIfExists('schedules');
        Schema::dropIfExists('citizens');
        Schema::dropIfExists('households');
    }
};
