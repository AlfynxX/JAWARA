<?php

namespace App\Filament\Widgets;

use App\Models\Citizen;
use App\Models\Household;
use App\Models\Report;
use App\Models\Schedule;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class OverviewStats extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Warga', Citizen::count())
                ->description('Total warga terdaftar')
                ->descriptionIcon('heroicon-m-users')
                ->color('success'),
            Stat::make('Total Kartu Keluarga', Household::count())
                ->description('Total keluarga terdaftar')
                ->descriptionIcon('heroicon-m-home'),
            Stat::make('Laporan Masuk', Report::where('status', 'pending')->count())
                ->description('Laporan perlu ditindaklanjuti')
                ->descriptionIcon('heroicon-m-clipboard-document-list')
                ->color('warning'),
            Stat::make('Jadwal Mendatang', Schedule::where('start_time', '>=', now())->count())
                ->description('Acara/kegiatan mendatang')
                ->descriptionIcon('heroicon-m-calendar'),
        ];
    }
}
