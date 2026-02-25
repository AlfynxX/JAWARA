<?php

namespace App\Filament\Resources\Reports\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ReportsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('citizen.name')
                    ->label('Warga Terdaftar')
                    ->searchable(),
                TextColumn::make('reporter_name')
                    ->label('Nama Pelapor (Tamu)')
                    ->searchable(),
                TextColumn::make('reporter_phone')
                    ->label('No. HP Pelapor')
                    ->searchable(),
                TextColumn::make('title')
                    ->label('Judul Laporan')
                    ->searchable(),
                ImageColumn::make('image')
                    ->label('Foto Bukti')
                    ->action(
                        \Filament\Actions\Action::make('viewImage')
                            ->label('Lihat Foto')
                            ->modalContent(fn($record) => view('filament.components.image-preview', ['url' => asset('storage/' . $record->image)]))
                            ->modalSubmitAction(false)
                            ->modalCancelAction(false)
                    ),
                TextColumn::make('location_address')
                    ->label('Lokasi')
                    ->limit(30)
                    ->toggleable(),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge(),
                TextColumn::make('created_at')
                    ->label('Tanggal Lapor')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->label('Terakhir Diupdate')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
