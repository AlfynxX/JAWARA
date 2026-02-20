<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Schedule extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'recipient_type' => 'string',
    ];

    public function citizens(): BelongsToMany
    {
        return $this->belongsToMany(Citizen::class, 'schedule_citizens')
            ->withPivot('is_present')
            ->withTimestamps();
    }
}
