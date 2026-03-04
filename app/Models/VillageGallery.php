<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VillageGallery extends Model
{
    protected $fillable = [
        'title',
        'description',
        'image_path',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function getImageUrlAttribute(): string
    {
        return asset('storage/' . $this->image_path);
    }

    protected $appends = ['image_url'];
}
