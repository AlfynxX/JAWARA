<?php

namespace App\Filament\Resources\DataPosyandu\Pages;

use App\Filament\Resources\DataPosyandu\DataPosyanduResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListDataPosyandus extends ListRecords
{
    protected static string $resource = DataPosyanduResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
