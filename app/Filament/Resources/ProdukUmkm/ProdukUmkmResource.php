<?php

namespace App\Filament\Resources\ProdukUmkm;

use App\Filament\Resources\ProdukUmkm\Pages;
use App\Models\ProdukUmkm;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;

class ProdukUmkmResource extends Resource
{
    protected static ?string $model = ProdukUmkm::class;
    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-shopping-bag';
    protected static ?string $navigationLabel = 'Lapak UMKM';

    public static function getModelLabel(): string { return 'Produk UMKM'; }
    public static function getPluralModelLabel(): string { return 'Produk UMKM'; }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('citizen_id')->relationship('citizen', 'name')->label('Warga Penjual')->searchable()->preload()->required(),
            TextInput::make('nomor_wa')->label('Nomor WhatsApp Aktif')->required()->tel()->placeholder('08123456789'),
            TextInput::make('nama_toko')->label('Nama Toko/Usaha')->required(),
            TextInput::make('nama_produk')->label('Nama Produk/Jasa')->required(),
            TextInput::make('harga')->label('Harga')->numeric()->prefix('IDR')->required(),
            Textarea::make('deskripsi')->label('Deskripsi Produk')->required(),
            FileUpload::make('foto_produk')->label('Foto Produk')->directory('umkm/produk')->image(),
            Toggle::make('is_active')->label('Tayangkan di Web (Validasi Admin)')->default(false),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('foto_produk')->label('Foto'),
                TextColumn::make('nama_produk')->label('Produk')->searchable(),
                TextColumn::make('nama_toko')->label('Toko')->searchable(),
                TextColumn::make('harga')->label('Harga')->money('IDR')->sortable(),
                IconColumn::make('is_active')->label('Tayang')->boolean(),
                TextColumn::make('created_at')->label('Terdaftar Pada')->dateTime()->sortable()->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([TernaryFilter::make('is_active')->label('Status Tayang')])
            ->recordActions([EditAction::make(), DeleteAction::make()])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }

    public static function getRelations(): array { return []; }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProdukUmkms::route('/'),
            'create' => Pages\CreateProdukUmkm::route('/create'),
            'edit' => Pages\EditProdukUmkm::route('/{record}/edit'),
        ];
    }
}