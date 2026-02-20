<?php

namespace App\Filament\Resources\SocialAids\Schemas;

use Filament\Schemas\Schema;

class SocialAidForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                \Filament\Forms\Components\TextInput::make('name')
                    ->required()
                    ->label('Nama Bantuan'),
                \Filament\Forms\Components\TextInput::make('amount')
                    ->numeric()
                    ->prefix('Rp')
                    ->label('Nominal (Per Penerima)'),
                \Filament\Forms\Components\DatePicker::make('distribution_date')
                    ->label('Tanggal Penyaluran'),
                \Filament\Forms\Components\TextInput::make('location')
                    ->label('Lokasi Penyaluran'),
                \Filament\Forms\Components\Textarea::make('requirements')
                    ->label('Persyaratan')
                    ->columnSpanFull(),
                \Filament\Forms\Components\Select::make('recipients')
                    ->relationship('recipients', 'name')
                    ->label('Penerima Bantuan')
                    ->multiple()
                    ->preload()
                    ->searchable()
                    ->allowHtml()
                    ->getOptionLabelFromRecordUsing(fn($record) => "
                        <div style='display: flex; align-items: center; gap: 8px;'>
                            <img src='" . ($record->profile_photo_path ? \Illuminate\Support\Facades\Storage::url($record->profile_photo_path) : 'https://ui-avatars.com/api/?name=' . urlencode($record->name)) . "' style='width: 32px; height: 32px; border-radius: 50%; object-fit: cover;'>
                            <span>{$record->name} (" . ($record->is_head_of_household ? 'Kepala Keluarga' : 'Anggota') . ")</span>
                        </div>
                    ")
                    ->columnSpanFull(),
            ]);
    }
}
