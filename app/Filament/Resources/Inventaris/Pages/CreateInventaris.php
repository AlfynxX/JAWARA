<?php

namespace App\Filament\Resources\Inventaris\Pages;

use App\Filament\Resources\Inventaris\InventarisResource;
use Filament\Resources\Pages\CreateRecord;

class CreateInventaris extends CreateRecord
{
    protected static string $resource = InventarisResource::class;
}

// Separate file for Edit usually, but for speed I'm putting it in my thought process and writing separately.
