<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    protected string $token;
    protected string $apiUrl = 'https://api.fonnte.com/send';

    public function __construct()
    {
        $this->token = config('services.fonnte.token');
    }

    /**
     * Send a WhatsApp message to a phone number.
     *
     * @param string $phone Indonesian phone number (e.g. 08123456789 or 628123456789)
     * @param string $message Message body
     * @return bool
     */
    public function send(string $phone, string $message): bool
    {
        // Normalize phone number to 628xxx format
        $phone = $this->normalizePhone($phone);

        if (!$phone) {
            Log::warning('[WA] Skipped: invalid phone number.');
            return false;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => $this->token,
            ])->post($this->apiUrl, [
                'target'  => $phone,
                'message' => $message,
            ]);

            if ($response->successful()) {
                Log::info("[WA] Message sent to {$phone}.");
                return true;
            }

            Log::error("[WA] Failed to send to {$phone}: " . $response->body());
            return false;
        } catch (\Throwable $e) {
            Log::error("[WA] Exception: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Send to multiple phone numbers.
     *
     * @param array $phones
     * @param string $message
     * @return void
     */
    public function sendBulk(array $phones, string $message): void
    {
        foreach ($phones as $phone) {
            $this->send($phone, $message);
        }
    }

    /**
     * Normalize Indonesian phone number to international format.
     */
    public function normalizePhone(string $phone): ?string
    {
        $phone = preg_replace('/\D/', '', $phone);

        if (empty($phone)) return null;

        if (str_starts_with($phone, '0')) {
            $phone = '62' . substr($phone, 1);
        } elseif (!str_starts_with($phone, '62')) {
            $phone = '62' . $phone;
        }

        // Minimum valid phone length
        if (strlen($phone) < 10) return null;

        return $phone;
    }
}
