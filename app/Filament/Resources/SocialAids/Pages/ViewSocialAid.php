<?php

namespace App\Filament\Resources\SocialAids\Pages;

use App\Filament\Resources\SocialAids\SocialAidResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewSocialAid extends ViewRecord
{
    protected static string $resource = SocialAidResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
