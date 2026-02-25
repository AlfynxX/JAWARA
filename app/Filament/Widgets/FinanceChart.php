<?php

namespace App\Filament\Widgets;

use App\Models\FinancialRecord;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class FinanceChart extends ChartWidget
{
    protected ?string $heading = 'Grafik Dana Desa (6 Bulan Terakhir)';

    protected static ?int $sort = 2;

    protected function getData(): array
    {
        $chartData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $monthName = $month->translatedFormat('M');

            $income = FinancialRecord::where('type', 'income')
                ->whereYear('transaction_date', $month->year)
                ->whereMonth('transaction_date', $month->month)
                ->sum('amount');

            $expense = FinancialRecord::where('type', 'expense')
                ->whereYear('transaction_date', $month->year)
                ->whereMonth('transaction_date', $month->month)
                ->sum('amount');

            $labels[] = $monthName;
            $incomeData[] = (float)$income;
            $expenseData[] = (float)$expense;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Pemasukan',
                    'data' => $incomeData,
                    'backgroundColor' => '#22c55e',
                    'borderColor' => '#22c55e',
                ],
                [
                    'label' => 'Pengeluaran',
                    'data' => $expenseData,
                    'backgroundColor' => '#ef4444',
                    'borderColor' => '#ef4444',
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}
