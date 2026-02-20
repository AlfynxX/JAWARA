<?php

namespace App\Filament\Resources\Schedules\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Table;

class SchedulesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                \Filament\Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->label('Kegiatan'),
                \Filament\Tables\Columns\TextColumn::make('type')
                    ->badge()
                    ->label('Jenis'),
                \Filament\Tables\Columns\TextColumn::make('start_time')
                    ->dateTime()
                    ->sortable()
                    ->label('Waktu Mulai'),
                \Filament\Tables\Columns\TextColumn::make('location')
                    ->searchable()
                    ->label('Lokasi'),
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
