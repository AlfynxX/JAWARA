<?php

namespace App\Filament\Resources\DataPosyandu\Pages;

use App\Filament\Resources\DataPosyandu\DataPosyanduResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditDataPosyandu extends EditRecord
{
    protected static string $resource = DataPosyanduResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
