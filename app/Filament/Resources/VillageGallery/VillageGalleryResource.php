<?php

namespace App\Filament\Resources\VillageGallery;

use App\Filament\Resources\VillageGallery\VillageGalleryResource\Pages;
use App\Models\VillageGallery;
use BackedEnum;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables;
use Filament\Tables\Table;

class VillageGalleryResource extends Resource
{
    protected static ?string $model = VillageGallery::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-photo';

    protected static ?string $recordTitleAttribute = 'title';

    public static function getModelLabel(): string
    {
        return 'Galeri';
    }

    public static function getNavigationLabel(): string
    {
        return 'Galeri Desa';
    }

    public static function getNavigationGroup(): ?string
    {
        return null;
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('title')
                ->label('Judul / Nama Kegiatan')
                ->required()
                ->maxLength(255)
                ->columnSpanFull(),

            Textarea::make('description')
                ->label('Deskripsi Gambar')
                ->helperText('Deskripsi ini akan muncul saat gambar di-hover oleh warga di portal.')
                ->rows(3)
                ->columnSpanFull(),

            FileUpload::make('image_path')
                ->label('Foto Kegiatan')
                ->image()
                ->directory('gallery')
                ->disk('public')
                ->maxSize(5120)
                ->required()
                ->helperText('Ukuran rekomendasi: 1280x720px (16:9). Maks 5MB.')
                ->columnSpanFull(),

            TextInput::make('sort_order')
                ->label('Urutan Tampil')
                ->numeric()
                ->default(0)
                ->helperText('Angka kecil tampil lebih dulu.'),

            Toggle::make('is_active')
                ->label('Tampilkan di Portal Warga')
                ->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image_path')
                    ->label('Foto')
                    ->disk('public')
                    ->width(120)
                    ->height(68),

                Tables\Columns\TextColumn::make('title')
                    ->label('Judul')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('description')
                    ->label('Deskripsi')
                    ->limit(60),

                Tables\Columns\TextColumn::make('sort_order')
                    ->label('Urutan')
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_active')
                    ->label('Aktif')
                    ->boolean(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Ditambahkan')
                    ->dateTime('d M Y')
                    ->sortable(),
            ])
            ->defaultSort('sort_order', 'asc')
            ->recordActions([
                \Filament\Actions\EditAction::make(),
                \Filament\Actions\DeleteAction::make(),
            ])
            ->toolbarActions([
                \Filament\Actions\BulkActionGroup::make([
                    \Filament\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListVillageGalleries::route('/'),
            'create' => Pages\CreateVillageGallery::route('/create'),
            'edit' => Pages\EditVillageGallery::route('/{record}/edit'),
        ];
    }
}
