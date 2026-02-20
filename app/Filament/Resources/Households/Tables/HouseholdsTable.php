<?php

namespace App\Filament\Resources\Households\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Table;

class HouseholdsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                \Filament\Tables\Columns\TextColumn::make('kk_number')
                    ->searchable()
                    ->sortable()
                    ->label('Nomor KK'),
                \Filament\Tables\Columns\TextColumn::make('head_of_family')
                    ->searchable()
                    ->sortable()
                    ->label('Kepala Keluarga'),
                \Filament\Tables\Columns\TextColumn::make('address')
                    ->searchable()
                    ->label('Alamat'),
                \Filament\Tables\Columns\TextColumn::make('rt')
                    ->sortable()
                    ->label('RT'),
                \Filament\Tables\Columns\TextColumn::make('rw')
                    ->sortable()
                    ->label('RW'),
                \Filament\Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                \Filament\Tables\Columns\TextColumn::make('updated_at')
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
