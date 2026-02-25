<?php

namespace App\Filament\Resources\LaporanKehilangan\Pages;

use App\Filament\Resources\LaporanKehilangan\LaporanKehilanganResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListLaporanKehilangans extends ListRecords
{
    protected static string $resource = LaporanKehilanganResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
