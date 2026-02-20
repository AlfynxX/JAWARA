<?php

namespace App\Filament\Resources\Citizens\Pages;

use App\Filament\Resources\Citizens\CitizenResource;
use Filament\Resources\Pages\CreateRecord;

class CreateCitizen extends CreateRecord
{
    protected static string $resource = CitizenResource::class;
}
