<?php

use App\Console\Commands\NotifySchedules;
use App\Console\Commands\NotifySocialAid;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Setiap hari jam 06:00 - kirim WA pengingat jadwal kegiatan
Schedule::command('wa:notify-schedules')->dailyAt('06:00');

// Setiap hari jam 09:00 - kirim WA H-1 sebelum distribusi bansos
Schedule::command('wa:notify-social-aid')->dailyAt('09:00');
