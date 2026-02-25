<?php

namespace App\Filament\Resources\PeminjamanInventaris\Pages;

use App\Filament\Resources\PeminjamanInventaris\PeminjamanInventarisResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPeminjamanInventaris extends ListRecords
{
    protected static string $resource = PeminjamanInventarisResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
