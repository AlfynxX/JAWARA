<?php

namespace App\Filament\Resources\PermohonanSurat\Pages;

use App\Filament\Resources\PermohonanSurat\PermohonanSuratResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewPermohonanSurat extends ViewRecord
{
    protected static string $resource = PermohonanSuratResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }
}
