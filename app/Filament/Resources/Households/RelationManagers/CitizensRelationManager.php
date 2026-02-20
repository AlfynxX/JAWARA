<?php

namespace App\Filament\Resources\Households\RelationManagers;

use Filament\Actions\AssociateAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\DissociateAction;
use Filament\Actions\DissociateBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\TextInput;
use Filament\Infolists\Components\TextEntry;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class CitizensRelationManager extends RelationManager
{
    protected static string $relationship = 'citizens';

    protected static ?string $title = 'Anggota Keluarga';

    public static function getModelLabel(): string
    {
        return 'Anggota Keluarga';
    }

    public function form(Schema $schema): Schema
    {
        return \App\Filament\Resources\Citizens\Schemas\CitizenForm::configure($schema);
    }

    public function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('name'),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                ImageColumn::make('profile_photo_path')
                    ->circular()
                    ->label('Foto'),
                TextColumn::make('nik')
                    ->searchable()
                    ->label('NIK'),
                TextColumn::make('name')
                    ->searchable()
                    ->label('Nama'),
                TextColumn::make('phone')
                    ->label('No. HP'),
                IconColumn::make('has_phone')
                    ->boolean()
                    ->label('Punya HP?'),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                CreateAction::make()
                    ->label('Tambah Anggota Baru'),
                AssociateAction::make()
                    ->label('Pilih dari Warga yang Ada'),
            ])
            ->recordActions([
                ViewAction::make()
                    ->label('Lihat'),
                EditAction::make()
                    ->label('Ubah'),
                DissociateAction::make()
                    ->label('Keluarkan dari KK'),
                DeleteAction::make()
                    ->label('Hapus Data'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DissociateBulkAction::make()
                        ->label('Keluarkan Terpilih'),
                    DeleteBulkAction::make()
                        ->label('Hapus Terpilih'),
                ]),
            ]);
    }
}
