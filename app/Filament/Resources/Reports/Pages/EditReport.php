<?php

namespace App\Filament\Resources\Reports\Pages;

use App\Filament\Resources\Reports\ReportResource;
use App\Services\WhatsAppService;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditReport extends EditRecord
{
    protected static string $resource = ReportResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }

    protected function afterSave(): void
    {
        $report = $this->record;
        $oldStatus = $this->record->getOriginal('status');

        // Only send notification if status changed
        if ($oldStatus === $report->status) {
            return;
        }

        $statusLabels = [
            'pending'    => '⏳ Menunggu',
            'in_process' => '🔄 Sedang Diproses',
            'resolved'   => '✅ Selesai / Ditangani',
            'rejected'   => '❌ Ditolak',
        ];

        $statusLabel = $statusLabels[$report->status] ?? $report->status;

        $message = "📢 *Update Status Laporan Warga*\n\n"
            . "Yth. *{$report->reporter_name}*,\n\n"
            . "Laporan Anda telah diperbarui:\n"
            . "📝 Judul: *{$report->title}*\n"
            . "📊 Status: {$statusLabel}\n";

        if ($report->admin_response) {
            $message .= "\n💬 Keterangan Admin:\n{$report->admin_response}\n";
        }

        $message .= "\nTerima kasih atas laporan Anda.\n_Sistem FIKSI Desa_";

        // Determine recipient phone
        $phone = null;

        if ($report->citizen_id && $report->citizen) {
            $phone = $report->citizen->phone;
        }

        if (!$phone && $report->reporter_phone) {
            $phone = $report->reporter_phone;
        }

        if ($phone) {
            app(WhatsAppService::class)->send($phone, $message);
        }
    }
}
