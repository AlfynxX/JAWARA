<?php

namespace Database\Seeders;

use App\Models\Citizen;
use App\Models\Document;
use App\Models\FinancialRecord;
use App\Models\Household;
use App\Models\Report;
use App\Models\Schedule;
use App\Models\SocialAid;
use Illuminate\Database\Seeder;

class VillageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create a Household (Kartu Keluarga)
        $household = Household::create([
            'kk_number' => '3500000000000001',
            'head_of_family' => 'Budi Santoso',
            'address' => 'Jl. Merdeka No. 1, RT 01 RW 01',
            'rt' => '001',
            'rw' => '001',
        ]);

        // 2. Create Citizens (Warga)
        $father = Citizen::create([
            'household_id' => $household->id,
            'nik' => '3500000000000001',
            'name' => 'Budi Santoso',
            'phone' => '081234567890',
            'gender' => 'male',
            'birth_date' => '1980-01-01',
            'marital_status' => 'married',
            'job' => 'Wiraswasta',
            'is_head_of_household' => true,
        ]);

        $mother = Citizen::create([
            'household_id' => $household->id,
            'nik' => '3500000000000002',
            'name' => 'Siti Aminah',
            'phone' => '081234567891',
            'gender' => 'female',
            'birth_date' => '1982-05-15',
            'marital_status' => 'married',
            'job' => 'Ibu Rumah Tangga',
        ]);

        Citizen::create([
            'household_id' => $household->id,
            'nik' => '3500000000000003',
            'name' => 'Andi Santoso',
            'gender' => 'male',
            'birth_date' => '2010-08-17',
            'marital_status' => 'single',
            'status' => 'permanent',
        ]);

        // Elderly citizen (Lansia)
        $grandfather = Citizen::create([
            'household_id' => $household->id,
            'nik' => '3500000000000004',
            'name' => 'Kakek Joyo',
            'gender' => 'male',
            'birth_date' => '1950-01-01',
            'status' => 'permanent',
            'is_elderly' => true,
            'is_poor' => true,
        ]);

        // 3. Create Schedules (Jadwal)
        // Kamling
        $kamling = Schedule::create([
            'title' => 'Jadwal Ronda Malam RT 01',
            'type' => 'kamling',
            'start_time' => now()->addDay()->setTime(21, 0),
            'end_time' => now()->addDay()->setTime(23, 0), // 2 hours shift
            'location' => 'Pos Kamling RT 01',
            'description' => 'Giliran jaga malam Bapak-bapak RT 01',
        ]);
        $kamling->citizens()->attach($father->id);

        // Rutinan
        Schedule::create([
            'title' => 'Rutinan Yasinan Bapak-bapak',
            'type' => 'rutinan',
            'start_time' => now()->next('Thursday')->setTime(18, 30),
            'location' => 'Rumah Pak RT',
            'description' => 'Membaca Yasin dan Tahlil',
        ]);

        // 4. Create Social Aids (Bansos)
        $bansos = SocialAid::create([
            'name' => 'Bantuan Langsung Tunai (BLT)',
            'amount' => 300000,
            'distribution_date' => now()->addDays(5),
            'location' => 'Balai Desa',
            'requirements' => 'Membawa KTP dan KK Asli',
        ]);
        
        $bansos->recipients()->attach($grandfather->id, ['status' => 'pending']);

        // 5. Create Financial Records (Laporan Keuangan)
        FinancialRecord::create([
            'type' => 'income',
            'amount' => 5000000,
            'title' => 'Dana Desa Tahap 1',
            'description' => 'Pencairan dana desa untuk operasional',
            'transaction_date' => now()->subDays(10),
        ]);

        FinancialRecord::create([
            'type' => 'expense',
            'amount' => 150000,
            'title' => 'Beli Alat Tulis Kantor',
            'transaction_date' => now()->subDays(5),
        ]);

        // 6. Create Report (Laporan Warga)
        Report::create([
            'citizen_id' => $father->id,
            'reporter_name' => $father->name,
            'reporter_phone' => $father->phone,
            'title' => 'Lampu Penerangan Jalan Mati',
            'content' => 'Lampu di pertigaan jalan merdeka mati sudah 3 hari, mohon diperbaiki.',
            'status' => 'pending',
        ]);

        // 7. Create Document (Arsip)
        Document::create([
            'title' => 'Peraturan Desa No 1 Tahun 2024',
            'description' => 'Tentang Ketertiban Umum',
            'file_path' => 'documents/perdes_01_2024.pdf', // Example path
            'is_public' => true,
        ]);
    }
}
