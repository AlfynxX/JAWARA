<?php

namespace App\Filament\Resources\VillageGallery\VillageGalleryResource\Pages;

use App\Filament\Resources\VillageGallery\VillageGalleryResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListVillageGalleries extends ListRecords
{
    protected static string $resource = VillageGalleryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
