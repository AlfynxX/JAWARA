<?php

namespace App\Filament\Resources\LaporanKehilangan\Pages;

use App\Filament\Resources\LaporanKehilangan\LaporanKehilanganResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditLaporanKehilangan extends EditRecord
{
    protected static string $resource = LaporanKehilanganResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
