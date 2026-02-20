<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class WhatsAppNotificationService
{
    /**
     * Send a WhatsApp notification to a specific phone number.
     *
     * @param string $phone
     * @param string $message
     * @return bool
     */
    public function sendNotification(string $phone, string $message): bool
    {
        // Placeholder: Log the notification instead of sending
        // In production, integrate with Fonnte, Twilio, or other WA gateways.
        Log::info("WA Notification to [{$phone}]: {$message}");

        return true;
    }

    /**
     * Broadcast a message to all citizens (or a specific group).
     *
     * @param string $message
     * @return void
     */
    public function broadcast(string $message): void
    {
        // Example: Get all citizens with phone numbers
        // $phones = Citizen::whereNotNull('phone')->pluck('phone');
        // foreach ($phones as $phone) ...
        
        Log::info("WA Broadcast: {$message}");
    }
}
