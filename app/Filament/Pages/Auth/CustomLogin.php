<?php

namespace App\Filament\Pages\Auth;

use DanHarrin\LivewireRateLimiting\Exceptions\TooManyRequestsException;
use Filament\Auth\Http\Responses\Contracts\LoginResponse;
use Filament\Auth\Pages\Login;
use Filament\Facades\Filament;
use Filament\Models\Contracts\FilamentUser;
use Illuminate\Contracts\Auth\Authenticatable;

class CustomLogin extends Login
{
    /**
     * @throws \DanHarrin\LivewireRateLimiting\Exceptions\TooManyRequestsException
     */
    public function authenticate(): ?LoginResponse
    {
        try {
            // Change from default 5 to 3 attempts, and set decay to 60 seconds (1 minute)
            $this->rateLimit(maxAttempts: 3, decaySeconds: 60);
        } catch (TooManyRequestsException $exception) {
            $this->getRateLimitedNotification($exception)?->send();

            return null;
        }

        $data = $this->form->getState();

        /** @var \Illuminate\Auth\SessionGuard $authGuard */
        $authGuard = Filament::auth();

        if (! $authGuard->attempt($this->getCredentialsFromFormData($data), $data['remember'] ?? false)) {
            $this->fireFailedEvent($authGuard, null, $this->getCredentialsFromFormData($data));
            $this->throwFailureValidationException();
        }

        $user = $authGuard->user();

        if (
            ($user instanceof FilamentUser) &&
            (! $user->canAccessPanel(Filament::getCurrentOrDefaultPanel()))
        ) {
            $authGuard->logout();
            $this->throwFailureValidationException();
        }

        session()->regenerate();

        return app(LoginResponse::class);
    }
}
