<?php

namespace App\Filament\Resources\ProdukUmkm\Pages;

use App\Filament\Resources\ProdukUmkm\ProdukUmkmResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListProdukUmkms extends ListRecords
{
    protected static string $resource = ProdukUmkmResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
