<?php

namespace App\Filament\Resources\Inventaris\Pages;

use App\Filament\Resources\Inventaris\InventarisResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListInventaris extends ListRecords
{
    protected static string $resource = InventarisResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
