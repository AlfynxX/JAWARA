<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Citizen;
use App\Models\Household;
use App\Models\Report;
use Illuminate\Http\Request;

class PublicApiController extends Controller
{
    public function getStats()
    {
        $totalIncome = \App\Models\FinancialRecord::where('type', 'income')->sum('amount');
        $totalExpense = \App\Models\FinancialRecord::where('type', 'expense')->sum('amount');

        // Get upcoming or ongoing schedules (not yet ended or no end time specified)
        $schedules = \App\Models\Schedule::where(function ($query) {
            $query->where('start_time', '>=', now())
                ->orWhere(function ($q) {
                    $q->where('start_time', '<=', now())
                        ->where(function ($sq) {
                            $sq->where('end_time', '>=', now())
                                ->orWhereNull('end_time');
                        });
                });
        })
            ->orderBy('start_time', 'asc')
            ->take(5)
            ->get();

        return response()->json([
            'total_citizens' => Citizen::count(),
            'total_households' => Household::count(),
            'total_elderly' => Citizen::where('is_elderly', true)->count(),
            'total_poor' => Citizen::where('is_poor', true)->count(),
            'total_reports' => Report::count(),
            'cash_balance' => $totalIncome - $totalExpense,
            'total_income' => $totalIncome,
            'total_expense' => $totalExpense,
            'schedules' => $schedules,
        ]);
    }

    public function getFinanceData()
    {
        $records = \App\Models\FinancialRecord::latest()->take(50)->get();

        // Group by month for chart (last 6 months)
        $chartData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $monthName = $month->format('M');
            $income = \App\Models\FinancialRecord::where('type', 'income')
                ->whereYear('transaction_date', $month->year)
                ->whereMonth('transaction_date', $month->month)
                ->sum('amount');
            $expense = \App\Models\FinancialRecord::where('type', 'expense')
                ->whereYear('transaction_date', $month->year)
                ->whereMonth('transaction_date', $month->month)
                ->sum('amount');

            $chartData[] = [
                'name' => $monthName,
                'income' => (float)$income,
                'expense' => (float)$expense,
            ];
        }

        return response()->json([
            'chart_data' => $chartData,
            'recent_transactions' => $records
        ]);
    }

    public function getSocialAidData()
    {
        $recipients = \App\Models\SocialAidRecipient::with(['citizen', 'socialAid'])
            ->latest()
            ->take(100)
            ->get();

        return response()->json($recipients);
    }

    public function getReports(Request $request)
    {
        $name = $request->query('name');

        if (!$name) {
            return response()->json([]);
        }

        $reports = Report::where('reporter_name', 'like', '%' . $name . '%')
            ->orWhereHas('citizen', function ($query) use ($name) {
                $query->where('name', 'like', '%' . $name . '%');
            })
            ->latest()
            ->get();

        return response()->json($reports);
    }

    public function submitReport(Request $request)
    {
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'name'             => 'required|string',
            'subject'          => 'required|string',
            'description'      => 'required|string',
            'nik'              => 'nullable|string',
            'image'            => 'nullable|file|mimes:jpg,jpeg,png,webp,gif|max:5120', // 5MB Max, explicit mimes
            'latitude'         => 'nullable|numeric',
            'longitude'        => 'nullable|numeric',
            'location_address' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first(),
                'errors'  => $validator->errors(),
            ], 422);
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('reports', 'public');
        }

        $citizenId = null;
        if ($request->nik) {
            $citizen = Citizen::where('nik', $request->nik)->first();
            if ($citizen) {
                $citizenId = $citizen->id;
            }
        }

        $report = Report::create([
            'citizen_id' => $citizenId,
            'reporter_name' => $request->name,
            'reporter_phone' => $request->nik,
            'title' => $request->subject,
            'content' => $request->description,
            'image' => $imagePath,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'location_address' => $request->location_address,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Laporan berhasil dikirim.',
            'report' => $report
        ]);
    }
}
