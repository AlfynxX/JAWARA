<?php

namespace App\Filament\Resources\PermohonanSurat;

use App\Filament\Resources\PermohonanSurat\Pages;
use App\Models\PermohonanSurat;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Actions\ViewAction;
use Filament\Actions\EditAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;

class PermohonanSuratResource extends Resource
{
    protected static ?string $model = PermohonanSurat::class;
    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-document-text';
    protected static ?string $navigationLabel = 'Layanan Surat';

    public static function getModelLabel(): string { return 'Permohonan Surat'; }
    public static function getPluralModelLabel(): string { return 'Permohonan Surat'; }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('citizen_id')->relationship('citizen', 'name')->label('Warga Terdaftar')->searchable()->preload(),
            TextInput::make('nama_pemohon')->label('Nama Pemohon (Lengkap)')->required(),
            TextInput::make('nomor_wa')->label('Nomor WhatsApp')->required()->tel(),
            TextInput::make('jenis_surat')->label('Jenis Surat')->required()->placeholder('Contoh: SKTM, Surat Domisili'),
            Textarea::make('keperluan')->label('Keperluan/Tujuan')->required(),
            FileUpload::make('dokumen_persyaratan')->label('Dokumen Persyaratan (KTP/KK)')->multiple()->directory('permohonan-surat/syarat')->image(),
            Select::make('status')->options(['menunggu' => 'Menunggu', 'diproses' => 'Diproses', 'selesai' => 'Selesai', 'ditolak' => 'Ditolak'])->default('menunggu')->required(),
            FileUpload::make('file_hasil')->label('Upload Surat Jadi (PDF)')->directory('permohonan-surat/hasil')->acceptedFileTypes(['application/pdf']),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('nama_pemohon')->label('Pemohon')->searchable(),
                TextColumn::make('jenis_surat')->label('Jenis Surat')->searchable(),
                TextColumn::make('status')->badge()->color(fn(string $state): string => match ($state) {
                    'menunggu' => 'gray', 'diproses' => 'warning', 'selesai' => 'success', 'ditolak' => 'danger', default => 'gray',
                }),
                TextColumn::make('created_at')->label('Tanggal Pengajuan')->dateTime()->sortable(),
            ])
            ->filters([SelectFilter::make('status')->options(['menunggu' => 'Menunggu', 'diproses' => 'Diproses', 'selesai' => 'Selesai', 'ditolak' => 'Ditolak'])])
            ->recordActions([ViewAction::make(), EditAction::make()])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }

    public static function getRelations(): array { return []; }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPermohonanSurats::route('/'),
            'create' => Pages\CreatePermohonanSurat::route('/create'),
            'view' => Pages\ViewPermohonanSurat::route('/{record}'),
            'edit' => Pages\EditPermohonanSurat::route('/{record}/edit'),
        ];
    }
}