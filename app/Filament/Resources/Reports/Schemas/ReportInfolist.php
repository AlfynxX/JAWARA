<?php

namespace App\Filament\Resources\Reports\Schemas;

use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\Section;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class ReportInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                // Temporarily disabled to prevent white screen crash
                // Section::make('Informasi Pelapor')
                //     ->schema([
                //         TextEntry::make('citizen.name')
                //             ->label('Warga Terdaftar')
                //             ->placeholder('Pelapor Tamu / Tidak Terdaftar'),
                //         TextEntry::make('reporter_name')
                //             ->label('Nama Pelapor'),
                //         TextEntry::make('reporter_phone')
                //             ->label('No. HP')
                //             ->placeholder('-'),
                //         TextEntry::make('created_at')
                //             ->label('Tanggal Lapor')
                //             ->dateTime('d M Y, H:i'),
                //     ])->columns(2),

                // Section::make('Detail Laporan')
                //     ->schema([
                //         TextEntry::make('title')
                //             ->label('Judul / Subjek')
                //             ->weight('bold')
                //             ->size('lg'),
                //         TextEntry::make('status')
                //             ->badge()
                //             ->color(fn(string $state): string => match ($state) {
                //                 'pending' => 'warning',
                //                 'in_process' => 'info',
                //                 'resolved' => 'success',
                //                 'rejected' => 'danger',
                //             }),
                //         TextEntry::make('content')
                //             ->label('Isi Laporan')
                //             ->columnSpanFull(),
                //     ])->columns(2),

                // Section::make('Bukti & Lokasi')
                //     ->schema([
                //         ImageEntry::make('image')
                //             ->label('Foto Bukti')
                //             ->height(300)
                //             ->columnSpanFull()
                //             ->visible(fn($record) => $record->image),
                //         TextEntry::make('location_address')
                //             ->label('Alamat Lokasi')
                //             ->icon('heroicon-m-map-pin')
                //             ->placeholder('Tidak ada data lokasi'),
                //         TextEntry::make('coordinates')
                //             ->label('Koordinat Peta')
                //             ->getStateUsing(fn($record) => $record->latitude ? "{$record->latitude}, {$record->longitude}" : null)
                //             ->url(fn($record) => $record->latitude ? "https://www.google.com/maps/search/?api=1&query={$record->latitude},{$record->longitude}" : null)
                //             ->openUrlInNewTab()
                //             ->color('primary')
                //             ->icon('heroicon-m-globe-alt')
                //             ->vocab('Buka di Google Maps')
                //             ->visible(fn($record) => $record->latitude && $record->longitude),
                //     ])->columns(2),

                // Section::make('Tanggapan Admin')
                //     ->schema([
                //         TextEntry::make('admin_response')
                //             ->label('Respon')
                //             ->placeholder('Belum ada tanggapan')
                //             ->columnSpanFull(),
                //         TextEntry::make('updated_at')
                //             ->label('Terakhir Diupdate')
                //             ->dateTime('d M Y, H:i'),
                //     ]),
            ]);
    }
}
