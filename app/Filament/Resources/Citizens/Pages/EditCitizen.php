<?php

namespace App\Filament\Resources\Citizens\Pages;

use App\Filament\Resources\Citizens\CitizenResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditCitizen extends EditRecord
{
    protected static string $resource = CitizenResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
