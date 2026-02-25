<?php

namespace App\Filament\Widgets;

use App\Models\Citizen;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class CitizenChart extends ChartWidget
{
    protected ?string $heading = 'Grafik Pertumbuhan Warga';

    protected static ?int $sort = 3;

    protected function getData(): array
    {
        $labels = [];
        $data = [];

        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $labels[] = $month->translatedFormat('M');

            // Getting total count up to that month
            $count = Citizen::where('created_at', '<=', $month->endOfMonth())
                ->count();

            $data[] = $count;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Total Warga',
                    'data' => $data,
                    'fill' => 'start',
                    'backgroundColor' => 'rgba(59, 130, 246, 0.2)',
                    'borderColor' => '#3b82f6',
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
