<?php

namespace App\Filament\Resources\SocialAids\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Table;

class SocialAidsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                \Filament\Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->label('Nama Bantuan'),
                \Filament\Tables\Columns\TextColumn::make('amount')
                    ->money('IDR')
                    ->label('Nominal'),
                \Filament\Tables\Columns\TextColumn::make('distribution_date')
                    ->date()
                    ->label('Tgl Penyaluran'),
                \Filament\Tables\Columns\TextColumn::make('recipients_count')
                    ->counts('recipients')
                    ->label('Jml Penerima'),
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
