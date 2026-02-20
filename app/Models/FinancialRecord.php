<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinancialRecord extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'transaction_date' => 'date',
        'amount' => 'decimal:2',
    ];
}
