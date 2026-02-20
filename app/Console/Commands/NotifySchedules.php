<?php

namespace App\Console\Commands;

use App\Models\Schedule;
use App\Models\Citizen;
use App\Services\WhatsAppService;
use Illuminate\Console\Command;

class NotifySchedules extends Command
{
    protected $signature = 'wa:notify-schedules';

    protected $description = 'Send WhatsApp reminders to citizens with schedules today';

    public function handle(WhatsAppService $wa): void
    {
        $today = now()->toDateString();

        // Get schedules happening today
        $schedules = Schedule::whereDate('start_time', $today)->get();

        if ($schedules->isEmpty()) {
            $this->info('No schedules today. No messages sent.');
            return;
        }

        foreach ($schedules as $schedule) {
            $time = \Carbon\Carbon::parse($schedule->start_time)->format('H:i');
            $date = \Carbon\Carbon::parse($schedule->start_time)->translatedFormat('l, d F Y');

            $message = "🔔 *Pengingat Jadwal Kegiatan Desa*\n\n"
                . "Yth. Warga,\n"
                . "Anda memiliki jadwal kegiatan hari ini:\n\n"
                . "📌 *{$schedule->title}*\n"
                . "📅 {$date}, Pukul {$time} WIB\n";

            if ($schedule->location) {
                $message .= "📍 Lokasi: {$schedule->location}\n";
            }

            if ($schedule->description) {
                $message .= "\n📝 {$schedule->description}\n";
            }

            $message .= "\nHarap hadir tepat waktu. Terima kasih.\n_Sistem FIKSI Desa_";

            if ($schedule->recipient_type === 'all') {
                // Send to ALL citizens with phone numbers
                $phones = Citizen::whereNotNull('phone')->pluck('phone')->toArray();
                $this->info("Schedule '{$schedule->title}': sending to " . count($phones) . " citizens (all).");
                $wa->sendBulk($phones, $message);
            } else {
                // Send only to selected citizens
                $phones = $schedule->citizens()->whereNotNull('phone')->pluck('phone')->toArray();
                $this->info("Schedule '{$schedule->title}': sending to " . count($phones) . " selected citizens.");
                $wa->sendBulk($phones, $message);
            }
        }

        $this->info('Done sending schedule reminders.');
    }
}
