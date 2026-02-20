<?php

namespace App\Filament\Resources\Schedules\Schemas;

use Filament\Schemas\Schema;

class ScheduleInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                // Temporarily disabled to prevent white screen crash
                // \Filament\Infolists\Components\TextEntry::make('title')
                //     ->label('Judul Kegiatan')
                //     ->weight('bold'),
                // \Filament\Infolists\Components\TextEntry::make('type')
                //     ->label('Jenis')
                //     ->badge(),
                // \Filament\Infolists\Components\TextEntry::make('start_time')
                //     ->label('Mulai')
                //     ->dateTime('d M Y, H:i'),
                // \Filament\Infolists\Components\TextEntry::make('end_time')
                //     ->label('Selesai')
                //     ->dateTime('d M Y, H:i')
                //     ->placeholder('-'),
                // \Filament\Infolists\Components\TextEntry::make('location')
                //     ->label('Lokasi'),
                // \Filament\Infolists\Components\TextEntry::make('description')
                //     ->label('Deskripsi')
                //     ->columnSpanFull(),
            ]);
    }
}
