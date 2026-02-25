<?php

namespace App\Filament\Resources\Inventaris\Pages;

use App\Filament\Resources\Inventaris\InventarisResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditInventaris extends EditRecord
{
    protected static string $resource = InventarisResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
