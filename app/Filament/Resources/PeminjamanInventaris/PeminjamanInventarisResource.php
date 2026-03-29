<?php

namespace App\Filament\Resources\PeminjamanInventaris;

use App\Filament\Resources\PeminjamanInventaris\Pages;
use App\Models\PeminjamanInventaris;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;

class PeminjamanInventarisResource extends Resource
{
    protected static ?string $model = PeminjamanInventaris::class;
    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-calendar-days';
    protected static ?string $navigationLabel = 'Peminjaman Barang';

    public static function getModelLabel(): string { return 'Peminjaman Barang'; }
    public static function getPluralModelLabel(): string { return 'Peminjaman Barang'; }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('inventaris_id')->relationship('inventaris', 'nama_barang')->label('Barang yang Dipinjam')->required()->searchable()->preload(),
            Select::make('citizen_id')->relationship('citizen', 'name')->label('Warga Terdaftar')->searchable()->preload(),
            TextInput::make('nama_peminjam')->label('Nama Peminjam (Jika manual)')->required(),
            FileUpload::make('identitas_peminjam')
                ->label('Foto KTP Peminjam')
                ->directory('peminjaman/identitas')
                ->image()
                ->imageEditor()
                ->maxSize(5120)
                ->required()
                ->helperText('Maks 5MB asli.'),
            TextInput::make('jumlah')->label('Jumlah Pinjam')->numeric()->required()->minValue(1),
            DatePicker::make('tanggal_pinjam')->label('Tanggal Mulai Pinjam')->required()->default(now()),
            DatePicker::make('tanggal_kembali')->label('Tanggal Rencana Kembali')->required(),
            Select::make('status')->options(['menunggu' => 'Menunggu Konfirmasi', 'disetujui' => 'Disetujui (Barang Diambil)', 'ditolak' => 'Ditolak', 'dikembalikan' => 'Sudah Dikembalikan'])->default('menunggu')->required(),
            Textarea::make('catatan_admin')->label('Catatan Admin (Kondisi barang, dll)')->placeholder('Contoh: Barang dikembalikan dalam kondisi baik.'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('inventaris.nama_barang')->label('Barang')->searchable(),
                TextColumn::make('nama_peminjam')->label('Peminjam')->searchable(),
                TextColumn::make('jumlah')->label('Jml'),
                TextColumn::make('tanggal_pinjam')->label('Tgl Pinjam')->date()->sortable(),
                TextColumn::make('tanggal_kembali')->label('Tgl Kembali')->date()->sortable(),
                TextColumn::make('status')->badge()->color(fn(string $state): string => match ($state) {
                    'menunggu' => 'gray', 'disetujui' => 'primary', 'ditolak' => 'danger', 'dikembalikan' => 'success', default => 'gray',
                }),
            ])
            ->filters([SelectFilter::make('status')->options(['menunggu' => 'Menunggu', 'disetujui' => 'Disetujui', 'ditolak' => 'Ditolak', 'dikembalikan' => 'Dikembalikan'])])
            ->recordActions([EditAction::make(), DeleteAction::make()])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }

    public static function getRelations(): array { return []; }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPeminjamanInventaris::route('/'),
            'create' => Pages\CreatePeminjamanInventaris::route('/create'),
            'edit' => Pages\EditPeminjamanInventaris::route('/{record}/edit'),
        ];
    }
}