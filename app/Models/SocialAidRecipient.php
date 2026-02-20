<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SocialAidRecipient extends Model
{
    use HasFactory;

    protected $table = 'social_aid_recipients';

    protected $guarded = ['id'];

    protected $casts = [
        'received_at' => 'datetime',
    ];

    public function citizen(): BelongsTo
    {
        return $this->belongsTo(Citizen::class);
    }

    public function socialAid(): BelongsTo
    {
        return $this->belongsTo(SocialAid::class);
    }
}
