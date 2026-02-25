<?php

namespace App\Filament\Resources\DataPosyandu;

use App\Filament\Resources\DataPosyandu\Pages;
use App\Models\DataPosyandu;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\DatePicker;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;

class DataPosyanduResource extends Resource
{
    protected static ?string $model = DataPosyandu::class;
    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-heart';
    protected static ?string $navigationLabel = 'Data Posyandu';

    public static function getModelLabel(): string { return 'Data Sasaran Posyandu'; }
    public static function getPluralModelLabel(): string { return 'Data Sasaran Posyandu'; }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('citizen_id')->relationship('citizen', 'name')->label('Warga Terdaftar')->searchable()->preload(),
            TextInput::make('nama_sasaran')->label('Nama Balita/Lansia')->required(),
            Select::make('kategori')->options(['balita' => 'Balita', 'lansia' => 'Lansia'])->required(),
            DatePicker::make('tanggal_lahir')->label('Tanggal Lahir'),
            TextInput::make('nama_orang_tua_wali')->label('Nama Orang Tua / Wali'),
            TextInput::make('nomor_wa_notifikasi')->label('Nomor WhatsApp untuk Notifikasi')->required()->tel()->placeholder('08123456789'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('nama_sasaran')->label('Nama')->searchable(),
                TextColumn::make('kategori')->label('Kategori')->badge()->color(fn(string $state): string => match ($state) { 'balita' => 'info', 'lansia' => 'success', default => 'gray' }),
                TextColumn::make('nama_orang_tua_wali')->label('Wali'),
                TextColumn::make('nomor_wa_notifikasi')->label('No. WhatsApp'),
                TextColumn::make('tanggal_lahir')->label('Tgl Lahir')->date()->sortable()->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([SelectFilter::make('kategori')->options(['balita' => 'Balita', 'lansia' => 'Lansia'])])
            ->recordActions([EditAction::make(), DeleteAction::make()])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }

    public static function getRelations(): array { return []; }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListDataPosyandus::route('/'),
            'create' => Pages\CreateDataPosyandu::route('/create'),
            'edit' => Pages\EditDataPosyandu::route('/{record}/edit'),
        ];
    }
}