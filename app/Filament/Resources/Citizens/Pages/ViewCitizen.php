<?php

namespace App\Filament\Resources\Citizens\Pages;

use App\Filament\Resources\Citizens\CitizenResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewCitizen extends ViewRecord
{
    protected static string $resource = CitizenResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
