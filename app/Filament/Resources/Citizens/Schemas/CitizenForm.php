<?php

namespace App\Filament\Resources\Citizens\Schemas;

use Filament\Schemas\Schema;

class CitizenForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                \Filament\Forms\Components\Select::make('household_id')
                    ->relationship('household', 'head_of_family')
                    ->searchable()
                    ->required()
                    ->label('Kepala Keluarga (KK)'),
                \Filament\Forms\Components\TextInput::make('nik')
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->label('NIK'),
                \Filament\Forms\Components\FileUpload::make('profile_photo_path')
                    ->image()
                    ->avatar()
                    ->imageEditor()
                    ->circleCropper()
                    ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
                    ->directory('citizen-photos')
                    ->label('Foto Profil (JPG, JPEG, PNG, WEBP)'),
                \Filament\Forms\Components\TextInput::make('name')
                    ->required()
                    ->label('Nama Lengkap'),
                \Filament\Forms\Components\TextInput::make('phone')
                    ->tel()
                    ->label('No. HP'),
                \Filament\Forms\Components\Toggle::make('has_phone')
                    ->label('Memiliki HP?'),
                \Filament\Forms\Components\Select::make('gender')
                    ->options([
                        'male' => 'Laki-laki',
                        'female' => 'Perempuan',
                    ])
                    ->required()
                    ->label('Jenis Kelamin'),
                \Filament\Forms\Components\DatePicker::make('birth_date')
                    ->label('Tanggal Lahir'),
                \Filament\Forms\Components\Select::make('marital_status')
                    ->options([
                        'single' => 'Belum Kawin',
                        'married' => 'Kawin',
                        'divorced' => 'Cerai Hidup',
                        'widowed' => 'Cerai Mati',
                    ])
                    ->label('Status Perkawinan'),
                \Filament\Forms\Components\TextInput::make('job')
                    ->label('Pekerjaan'),
                \Filament\Forms\Components\Select::make('status')
                    ->options([
                        'permanent' => 'Tetap',
                        'contract' => 'Kontrak',
                        'temporary' => 'Sementara',
                    ])
                    ->default('permanent')
                    ->label('Status Warga'),
                \Filament\Forms\Components\Toggle::make('is_head_of_household')
                    ->label('Kepala Keluarga?'),
                \Filament\Forms\Components\Toggle::make('is_poor')
                    ->label('Kurang Mampu'),
                \Filament\Forms\Components\Toggle::make('is_elderly')
                    ->label('Lansia'),
                \Filament\Forms\Components\Toggle::make('is_unemployed')
                    ->label('Pengangguran'),
            ]);
    }
}
