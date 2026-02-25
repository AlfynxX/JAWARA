<?php

namespace App\Filament\Resources\Inventaris;

use App\Filament\Resources\Inventaris\Pages;
use App\Models\Inventaris;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\FileUpload;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;

class InventarisResource extends Resource
{
    protected static ?string $model = Inventaris::class;
    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-archive-box';
    protected static ?string $navigationLabel = 'Inventaris Desa';

    public static function getModelLabel(): string { return 'Inventaris Barang'; }
    public static function getPluralModelLabel(): string { return 'Inventaris Barang'; }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('nama_barang')->label('Nama Barang')->required(),
            TextInput::make('kode_barang')->label('Kode/Label Barang')->unique(ignoreRecord: true),
            TextInput::make('jumlah_total')->label('Jumlah Total Unit')->numeric()->required(),
            TextInput::make('jumlah_tersedia')->label('Jumlah Tersedia (Saat Ini)')->numeric()->required(),
            FileUpload::make('foto_barang')->label('Foto Barang')->directory('inventaris')->image(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('foto_barang')->label('Foto'),
                TextColumn::make('nama_barang')->label('Nama Barang')->searchable(),
                TextColumn::make('kode_barang')->label('Kode')->searchable(),
                TextColumn::make('jumlah_total')->label('Total'),
                TextColumn::make('jumlah_tersedia')->label('Tersedia')->color(fn($state) => $state > 0 ? 'success' : 'danger'),
            ])
            ->filters([])
            ->recordActions([EditAction::make(), DeleteAction::make()])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }

    public static function getRelations(): array { return []; }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListInventaris::route('/'),
            'create' => Pages\CreateInventaris::route('/create'),
            'edit' => Pages\EditInventaris::route('/{record}/edit'),
        ];
    }
}