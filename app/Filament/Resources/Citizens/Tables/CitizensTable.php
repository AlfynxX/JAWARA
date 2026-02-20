<?php

namespace App\Filament\Resources\Citizens\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Table;

class CitizensTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                \Filament\Tables\Columns\ImageColumn::make('profile_photo_path')
                    ->circular()
                    ->label('Foto')
                    ->action(
                        \Filament\Actions\Action::make('viewProfilePhoto')
                            ->label('Lihat Foto Profil')
                            ->modalContent(fn($record) => view('filament.components.image-preview', ['url' => asset('storage/' . $record->profile_photo_path)]))
                            ->modalSubmitAction(false)
                            ->modalCancelAction(false)
                    ),
                \Filament\Tables\Columns\TextColumn::make('nik')
                    ->searchable()
                    ->label('NIK'),
                \Filament\Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->label('Nama Warga'),
                \Filament\Tables\Columns\TextColumn::make('household.kk_number')
                    ->searchable()
                    ->label('No. KK')
                    ->url(fn($record) => $record->household ? route('filament.admin.resources.households.view', $record->household) : null),
                \Filament\Tables\Columns\TextColumn::make('household.head_of_family')
                    ->searchable()
                    ->label('Kepala Keluarga'),
                \Filament\Tables\Columns\IconColumn::make('is_head_of_household')
                    ->boolean()
                    ->label('Kepala Keluarga?'),
                \Filament\Tables\Columns\TextColumn::make('phone')
                    ->searchable()
                    ->label('No. HP'),
                \Filament\Tables\Columns\IconColumn::make('has_phone')
                    ->boolean()
                    ->label('Punya HP?'),
                \Filament\Tables\Columns\TextColumn::make('gender')
                    ->formatStateUsing(fn(string $state): string => match ($state) {
                        'male' => 'Laki-laki',
                        'female' => 'Perempuan',
                    })
                    ->label('Jenis Kelamin'),
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
