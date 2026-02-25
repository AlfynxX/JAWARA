<?php

namespace App\Filament\Resources\PeminjamanInventaris\Pages;

use App\Filament\Resources\PeminjamanInventaris\PeminjamanInventarisResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPeminjamanInventaris extends EditRecord
{
    protected static string $resource = PeminjamanInventarisResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
