<?php

namespace App\Filament\Resources\PermohonanSurat\Pages;

use App\Filament\Resources\PermohonanSurat\PermohonanSuratResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPermohonanSurats extends ListRecords
{
    protected static string $resource = PermohonanSuratResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
