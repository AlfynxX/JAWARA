<?php

namespace App\Filament\Resources\Schedules\Pages;

use App\Filament\Resources\Schedules\ScheduleResource;
use Filament\Resources\Pages\CreateRecord;

class CreateSchedule extends CreateRecord
{
    protected static string $resource = \App\Filament\Resources\Schedules\ScheduleResource::class;
    // protected function afterCreate(): void
    // {
    //     $schedule = $this->record;

    //     if ($schedule->recipient_type === 'all') {
    //         // Placeholder: Call API to send message to all citizens
    //         \Illuminate\Support\Facades\Log::info("API Placeholder: Sending schedule '{$schedule->title}' to all citizens.");
    //     }
    // }
}
