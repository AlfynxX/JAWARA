<?php

use App\Models\Schedule;
use Illuminate\Support\Facades\Schema;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Checking Schedule Model...\n";

try {
    $count = Schedule::count();
    echo "Schedule count: " . $count . "\n";

    $schedule = new Schedule();
    echo "Schedule instance created.\n";

    echo "Checking table columns...\n";
    $columns = Schema::getColumnListing('schedules');
    print_r($columns);
} catch (\Throwable $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
