<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PeminjamanInventaris extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'identitas_peminjam' => 'array',
    ];

    public function inventaris(): BelongsTo
    {
        return $this->belongsTo(Inventaris::class);
    }

    public function citizen(): BelongsTo
    {
        return $this->belongsTo(Citizen::class);
    }
}
