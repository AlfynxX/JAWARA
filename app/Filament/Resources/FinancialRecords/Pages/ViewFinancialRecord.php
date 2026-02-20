<?php

namespace App\Filament\Resources\FinancialRecords\Pages;

use App\Filament\Resources\FinancialRecords\FinancialRecordResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewFinancialRecord extends ViewRecord
{
    protected static string $resource = FinancialRecordResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
