<?php

namespace App\Filament\Resources\SocialAids\Pages;

use App\Filament\Resources\SocialAids\SocialAidResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListSocialAids extends ListRecords
{
    protected static string $resource = SocialAidResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
