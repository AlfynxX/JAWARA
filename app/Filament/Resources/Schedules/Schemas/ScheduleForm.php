<?php

namespace App\Filament\Resources\Schedules\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Radio;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class ScheduleForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->required()
                    ->label('Judul Kegiatan'),
                Select::make('type')
                    ->options([
                        'kamling'    => 'Pos Kamling',
                        'rutinan'    => 'Rutinan',
                        'kerja_bakti' => 'Kerja Bakti',
                        'event'      => 'Acara Desa',
                    ])
                    ->required()
                    ->label('Jenis Kegiatan'),
                DateTimePicker::make('start_time')
                    ->required()
                    ->label('Waktu Mulai'),
                DateTimePicker::make('end_time')
                    ->label('Waktu Selesai'),
                TextInput::make('location')
                    ->label('Lokasi'),
                Textarea::make('description')
                    ->label('Deskripsi')
                    ->columnSpanFull(),
                Radio::make('recipient_type')
                    ->label('Target Penerima')
                    ->options([
                        'all'      => 'Semua Warga (Kirim WA Broadcast)',
                        'selected' => 'Beberapa Warga Saja',
                    ])
                    ->default('selected')
                    ->required()
                    ->live(),
                Select::make('citizens')
                    ->relationship('citizens', 'name')
                    ->label('Pilih Warga')
                    ->multiple()
                    ->preload()
                    ->searchable()
                    ->getOptionLabelFromRecordUsing(fn($record) => "{$record->name} (" . ($record->is_head_of_household ? 'Kepala Keluarga' : 'Anggota Keluarga') . ")")
                    ->visible(fn($get) => $get('recipient_type') === 'selected'),
            ]);
    }
}
