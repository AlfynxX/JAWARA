<?php

namespace App\Filament\Resources\SocialAids\Pages;

use App\Filament\Resources\SocialAids\SocialAidResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditSocialAid extends EditRecord
{
    protected static string $resource = SocialAidResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
