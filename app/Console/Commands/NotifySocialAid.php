<?php

namespace App\Console\Commands;

use App\Models\SocialAid;
use App\Services\WhatsAppService;
use Illuminate\Console\Command;

class NotifySocialAid extends Command
{
    protected $signature = 'wa:notify-social-aid';

    protected $description = 'Send WhatsApp reminders H-1 before social aid distribution';

    public function handle(WhatsAppService $wa): void
    {
        $tomorrow = now()->addDay()->toDateString();

        // Get social aids with distribution date tomorrow
        $aids = SocialAid::whereDate('distribution_date', $tomorrow)->get();

        if ($aids->isEmpty()) {
            $this->info('No social aid distributions tomorrow. No messages sent.');
            return;
        }

        foreach ($aids as $aid) {
            $date = \Carbon\Carbon::parse($aid->distribution_date)->translatedFormat('l, d F Y');

            $message = "🎁 *Pengingat Pengambilan Bantuan Sosial*\n\n"
                . "Yth. Warga Penerima Manfaat,\n\n"
                . "Informasi bahwa besok adalah jadwal pengambilan:"
                . "\n\n📋 *{$aid->name}*\n"
                . "📅 Tanggal: {$date}\n";

            if ($aid->location) {
                $message .= "📍 Lokasi: {$aid->location}\n";
            }

            if ($aid->amount) {
                $amount = number_format($aid->amount, 0, ',', '.');
                $message .= "💰 Nominal: Rp {$amount}\n";
            }

            if ($aid->requirements) {
                $message .= "\n📎 Persyaratan:\n{$aid->requirements}\n";
            }

            $message .= "\nHarap membawa dokumen yang diperlukan dan hadir tepat waktu.\n_Sistem FIKSI Desa_";

            // Get recipients with phone numbers via citizens relationship
            $recipients = $aid->recipients()->whereNotNull('phone')->get();

            $this->info("Social aid '{$aid->name}': sending to " . $recipients->count() . " recipients.");

            foreach ($recipients as $citizen) {
                $personalizedMessage = "Yth. *{$citizen->name}*,\n\n"
                    . "🎁 *Pengingat Pengambilan Bantuan Sosial*\n\n"
                    . "Anda terdaftar sebagai penerima:\n"
                    . "📋 *{$aid->name}*\n"
                    . "📅 Tanggal Pengambilan: {$date}\n";

                if ($aid->location) {
                    $personalizedMessage .= "📍 Tempat: {$aid->location}\n";
                }

                if ($aid->amount) {
                    $amount = number_format($aid->amount, 0, ',', '.');
                    $personalizedMessage .= "💰 Nominal: Rp {$amount}\n";
                }

                if ($aid->requirements) {
                    $personalizedMessage .= "\n📎 Persyaratan:\n{$aid->requirements}\n";
                }

                $personalizedMessage .= "\nHarap membawa dokumen yang diperlukan. Terima kasih.\n_Sistem FIKSI Desa_";

                $wa->send($citizen->phone, $personalizedMessage);
            }
        }

        $this->info('Done sending social aid reminders.');
    }
}
