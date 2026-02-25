<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Inventaris extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function peminjaman(): HasMany
    {
        return $this->hasMany(PeminjamanInventaris::class);
    }
}
