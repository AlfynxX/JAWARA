<?php

namespace App\Filament\Resources\FinancialRecords\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Table;

class FinancialRecordsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                \Filament\Tables\Columns\TextColumn::make('transaction_date')
                    ->date()
                    ->sortable()
                    ->label('Tanggal'),
                \Filament\Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->label('Keterangan'),
                \Filament\Tables\Columns\TextColumn::make('type')
                    ->badge()
                    ->colors([
                        'success' => 'income',
                        'danger' => 'expense',
                    ])
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'income' => 'Pemasukan',
                        'expense' => 'Pengeluaran',
                    })
                    ->label('Jenis'),
                \Filament\Tables\Columns\TextColumn::make('amount')
                    ->money('IDR')
                    ->sortable()
                    ->label('Jumlah'),
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
