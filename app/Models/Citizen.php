<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Citizen extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($citizen) {
            $citizen->has_phone = ! empty($citizen->phone);
        });
    }

    protected $casts = [
        'birth_date' => 'date',
        'is_head_of_household' => 'boolean',
        'is_poor' => 'boolean',
        'is_elderly' => 'boolean',
        'is_unemployed' => 'boolean',
        'has_phone' => 'boolean',
    ];

    public function household(): BelongsTo
    {
        return $this->belongsTo(Household::class);
    }

    public function schedules(): BelongsToMany
    {
        return $this->belongsToMany(Schedule::class, 'schedule_citizens')
            ->withPivot('is_present')
            ->withTimestamps();
    }

    public function socialAids(): BelongsToMany
    {
        return $this->belongsToMany(SocialAid::class, 'social_aid_recipients')
            ->withPivot('status', 'received_at')
            ->withTimestamps();
    }
}
