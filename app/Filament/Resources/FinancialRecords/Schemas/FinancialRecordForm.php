<?php

namespace App\Filament\Resources\FinancialRecords\Schemas;

use Filament\Schemas\Schema;

class FinancialRecordForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                \Filament\Forms\Components\Select::make('type')
                    ->options([
                        'income' => 'Pemasukan',
                        'expense' => 'Pengeluaran',
                    ])
                    ->required()
                    ->label('Jenis Pencatatan'),
                \Filament\Forms\Components\TextInput::make('amount')
                    ->numeric()
                    ->required()
                    ->prefix('Rp')
                    ->label('Jumlah (Rp)'),
                \Filament\Forms\Components\TextInput::make('title')
                    ->required()
                    ->label('Judul / Keterangan Singkat'),
                \Filament\Forms\Components\Textarea::make('description')
                    ->label('Deskripsi Lengkap')
                    ->columnSpanFull(),
                \Filament\Forms\Components\DatePicker::make('transaction_date')
                    ->required()
                    ->default(now())
                    ->label('Tanggal Transaksi'),
            ]);
    }
}
