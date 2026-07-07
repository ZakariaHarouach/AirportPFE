<?php
// app/Models/Stopover.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stopover extends Model
{
    use HasFactory;

    protected $fillable = [
        'flight_id',
        'airport_id',
        'date_time',
    ];

    protected $casts = [
        'date_time' => 'datetime',
    ];

    public function flight()
    {
        return $this->belongsTo(Flight::class);
    }

    public function airport()
    {
        return $this->belongsTo(Airport::class);
    }
}