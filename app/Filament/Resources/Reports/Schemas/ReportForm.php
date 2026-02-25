<?php

namespace App\Filament\Resources\Reports\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class ReportForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('citizen_id')
                    ->relationship('citizen', 'name')
                    ->label('Pelapor (Dari Data Warga)')
                    ->searchable()
                    ->preload()
                    ->default(null),
                TextInput::make('reporter_name')
                    ->label('Nama Pelapor (Manual)')
                    ->required(),
                TextInput::make('reporter_phone')
                    ->label('No. HP Pelapor')
                    ->tel()
                    ->default(null),
                TextInput::make('title')
                    ->label('Judul Laporan')
                    ->required()
                    ->columnSpanFull(),
                Textarea::make('content')
                    ->label('Isi Laporan')
                    ->required()
                    ->columnSpanFull(),
                FileUpload::make('image')
                    ->label('Foto Bukti (JPG, JPEG, PNG, WEBP)')
                    ->image()
                    ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
                    ->directory('report-images')
                    ->columnSpanFull(),

                // Location Fields (Read Only / Hidden mostly)
                TextInput::make('location_address')
                    ->label('Alamat Lokasi')
                    ->default(null),
                TextInput::make('latitude')
                    ->label('Lintang (Latitude)')
                    ->numeric()
                    ->default(null),
                TextInput::make('longitude')
                    ->label('Bujur (Longitude)')
                    ->numeric()
                    ->default(null),

                Select::make('status')
                    ->label('Status')
                    ->options([
                        'pending' => 'Menunggu',
                        'in_process' => 'Sedang Diproses',
                        'resolved' => 'Selesai',
                        'rejected' => 'Ditolak',
                    ])
                    ->default('pending')
                    ->required(),
                Textarea::make('admin_response')
                    ->label('Tanggapan Admin')
                    ->default(null)
                    ->columnSpanFull(),
            ]);
    }
}
