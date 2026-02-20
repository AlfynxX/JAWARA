<?php

namespace App\Filament\Resources\Households\Schemas;

use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;


class HouseholdForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                \Filament\Schemas\Components\Tabs::make('Household Details')
                    ->tabs([
                        \Filament\Schemas\Components\Tabs\Tab::make('Informasi KK')
                            ->schema([
                                \Filament\Forms\Components\TextInput::make('kk_number')
                                    ->required()
                                    ->unique(ignoreRecord: true)
                                    ->label('Nomor KK'),
                                \Filament\Forms\Components\TextInput::make('head_of_family')
                                    ->required()
                                    ->label('Kepala Keluarga'),
                                \Filament\Forms\Components\Textarea::make('address')
                                    ->label('Alamat Lengkap')
                                    ->columnSpanFull(),
                                \Filament\Forms\Components\TextInput::make('rt')
                                    ->label('RT')
                                    ->numeric(),
                                \Filament\Forms\Components\TextInput::make('rw')
                                    ->label('RW')
                                    ->numeric(),
                            ])->columns(2),
                        \Filament\Schemas\Components\Tabs\Tab::make('Anggota Keluarga')
                            ->schema([
                                \Filament\Forms\Components\Repeater::make('citizens')
                                    ->relationship()
                                    ->schema([
                                        \Filament\Schemas\Components\Section::make('Data Diri')
                                            ->schema([
                                                \Filament\Forms\Components\TextInput::make('nik')
                                                    ->required()
                                                    ->unique(ignoreRecord: true)
                                                    ->label('NIK'),
                                                \Filament\Forms\Components\TextInput::make('name')
                                                    ->required()
                                                    ->label('Nama Lengkap'),
                                                \Filament\Forms\Components\TextInput::make('phone')
                                                    ->tel()
                                                    ->label('No. HP'),
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
                                            ])->columns(2),

                                        \Filament\Schemas\Components\Section::make('Status & Kondisi')
                                            ->schema([
                                                \Filament\Forms\Components\Toggle::make('is_head_of_household')
                                                    ->label('Kepala Keluarga?'),
                                                \Filament\Forms\Components\Toggle::make('is_poor')
                                                    ->label('Kurang Mampu'),
                                                \Filament\Forms\Components\Toggle::make('is_elderly')
                                                    ->label('Lansia'),
                                                \Filament\Forms\Components\Toggle::make('is_unemployed')
                                                    ->label('Pengangguran'),
                                            ])->columns(4),
                                    ])
                                    ->itemLabel(fn (array $state): ?string => $state['name'] ?? null)
                                    ->collapsible()
                                    ->collapsed()
                                    ->cloneable()
                                    ->label('Daftar Anggota Keluarga')
                                    ->addActionLabel('Tambah Anggota Keluarga'),
                            ]),
                    ])->columnSpanFull(),
            ]);
    }
}
