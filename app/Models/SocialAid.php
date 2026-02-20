<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class SocialAid extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'distribution_date' => 'date',
        'amount' => 'decimal:2',
    ];

    public function recipients(): BelongsToMany
    {
        return $this->belongsToMany(Citizen::class, 'social_aid_recipients')
            ->withPivot('status', 'received_at')
            ->withTimestamps();
    }
}
