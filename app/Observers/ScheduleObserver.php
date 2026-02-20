<?php

namespace App\Observers;

use App\Models\Schedule;
use App\Services\WhatsAppNotificationService;
use Illuminate\Support\Facades\Log;

class ScheduleObserver
{
    protected $whatsappService;

    public function __construct(WhatsAppNotificationService $whatsappService)
    {
        $this->whatsappService = $whatsappService;
    }

    /**
     * Handle the Schedule "created" event.
     */
    public function created(Schedule $schedule): void
    {
        // Example: Notify relevant citizens or broadcast
        // For simplicity, we'll log it and pretend to broadcast.
        
        $message = "New Schedule: {$schedule->title} on {$schedule->start_time->format('d M Y H:i')}. Location: {$schedule->location}. Type: {$schedule->type}.";
        
        // In a real app, you'd fetch assigned citizens:
        // $phones = $schedule->citizens()->pluck('phone');
        // foreach ($phones as $phone) ...
        
        // Broadcast to "all" (simulated)
        $this->whatsappService->broadcast($message);
    }

    /**
     * Handle the Schedule "updated" event.
     */
    public function updated(Schedule $schedule): void
    {
        // Similar logic for updates
        if ($schedule->wasChanged('start_time') || $schedule->wasChanged('location')) {
             $message = "Update: {$schedule->title} moved to {$schedule->start_time->format('d M Y H:i')} at {$schedule->location}.";
             $this->whatsappService->broadcast($message);
        }
    }

    /**
     * Handle the Schedule "deleted" event.
     */
    public function deleted(Schedule $schedule): void
    {
        //
    }
}
