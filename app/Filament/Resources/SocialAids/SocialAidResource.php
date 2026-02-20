<?php

namespace App\Filament\Resources\SocialAids;

use App\Filament\Resources\SocialAids\Pages\CreateSocialAid;
use App\Filament\Resources\SocialAids\Pages\EditSocialAid;
use App\Filament\Resources\SocialAids\Pages\ListSocialAids;
use App\Filament\Resources\SocialAids\Pages\ViewSocialAid;
use App\Filament\Resources\SocialAids\Schemas\SocialAidForm;
use App\Filament\Resources\SocialAids\Schemas\SocialAidInfolist;
use App\Filament\Resources\SocialAids\Tables\SocialAidsTable;
use App\Models\SocialAid;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class SocialAidResource extends Resource
{
    protected static ?string $model = SocialAid::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'name';

    public static function getModelLabel(): string
    {
        return 'Bansos';
    }

    public static function getNavigationLabel(): string
    {
        return 'Bantuan Sosial';
    }

    public static function form(Schema $schema): Schema
    {
        return SocialAidForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return SocialAidInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SocialAidsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListSocialAids::route('/'),
            'create' => CreateSocialAid::route('/create'),
            'view' => ViewSocialAid::route('/{record}'),
            'edit' => EditSocialAid::route('/{record}/edit'),
        ];
    }
}
