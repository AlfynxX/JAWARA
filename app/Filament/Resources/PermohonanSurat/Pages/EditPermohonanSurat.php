<?php

namespace App\Filament\Resources\PermohonanSurat\Pages;

use App\Filament\Resources\PermohonanSurat\PermohonanSuratResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPermohonanSurat extends EditRecord
{
    protected static string $resource = PermohonanSuratResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
        ];
    }
}
