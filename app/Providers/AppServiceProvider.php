<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
        $this->app->singleton(\App\Services\WhatsAppNotificationService::class, function ($app) {
            return new \App\Services\WhatsAppNotificationService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
        \App\Models\Schedule::observe(\App\Observers\ScheduleObserver::class);
    }
}
