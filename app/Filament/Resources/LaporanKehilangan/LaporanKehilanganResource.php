<?php

namespace App\Filament\Resources\LaporanKehilangan;

use App\Filament\Resources\LaporanKehilangan\Pages;
use App\Models\LaporanKehilangan;
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
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;

class LaporanKehilanganResource extends Resource
{
    protected static ?string $model = LaporanKehilangan::class;
    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-megaphone';
    protected static ?string $navigationLabel = 'Laporan Kehilangan';

    public static function getModelLabel(): string { return 'Laporan Kehilangan & Penemuan'; }
    public static function getPluralModelLabel(): string { return 'Laporan Kehilangan & Penemuan'; }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('jenis_laporan')->options(['kehilangan' => 'Kehilangan', 'penemuan' => 'Penemuan'])->required(),
            Select::make('citizen_id')->relationship('citizen', 'name')->label('Warga Pelapor')->searchable()->preload(),
            TextInput::make('nomor_wa_kontak')->label('Nomor WhatsApp yang bisa dihubungi')->required()->tel(),
            TextInput::make('nama_barang')->label('Nama Barang')->required(),
            TextInput::make('lokasi_kejadian')->label('Lokasi Terakhir / Ditemukan')->required(),
            Textarea::make('deskripsi_ciri_ciri')->label('Ciri-ciri / Keterangan')->required(),
            FileUpload::make('foto_barang')->label('Foto Barang')->directory('kehilangan')->image(),
            Toggle::make('is_verified')->label('Verifikasi Laporan (Tampilkan di Web)')->default(false),
            Select::make('status')->options(['aktif' => 'Aktif (Masih Dicari/Ditemukan)', 'selesai' => 'Selesai (Sudah Kembali)', 'diarsipkan' => 'Diarsipkan (Kadaluwarsa)'])->default('aktif')->required(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('foto_barang')->label('Foto'),
                TextColumn::make('jenis_laporan')->label('Tipe')->badge()->color(fn(string $state): string => match ($state) {
                    'kehilangan' => 'danger', 'penemuan' => 'info', default => 'gray',
                }),
                TextColumn::make('nama_barang')->label('Barang')->searchable(),
                TextColumn::make('lokasi_kejadian')->label('Lokasi')->searchable(),
                IconColumn::make('is_verified')->label('Terverifikasi')->boolean(),
                TextColumn::make('status')->label('Status')->badge()->color(fn(string $state): string => match ($state) {
                    'aktif' => 'warning', 'selesai' => 'success', 'diarsipkan' => 'gray', default => 'gray',
                }),
            ])
            ->filters([
                SelectFilter::make('jenis_laporan')->options(['kehilangan' => 'Kehilangan', 'penemuan' => 'Penemuan']),
                TernaryFilter::make('is_verified')->label('Verifikasi'),
            ])
            ->recordActions([EditAction::make(), DeleteAction::make()])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }

    public static function getRelations(): array { return []; }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListLaporanKehilangans::route('/'),
            'create' => Pages\CreateLaporanKehilangan::route('/create'),
            'edit' => Pages\EditLaporanKehilangan::route('/{record}/edit'),
        ];
    }
}