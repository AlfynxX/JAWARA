<?php

namespace App\Filament\Resources\ProdukUmkm\Pages;

use App\Filament\Resources\ProdukUmkm\ProdukUmkmResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditProdukUmkm extends EditRecord
{
    protected static string $resource = ProdukUmkmResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
