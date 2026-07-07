<?php
// app/Models/Reservation.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'flight_id',
        'client_id',
        'reservation_date',
        'start_airport_id',
        'end_airport_id',
    ];

    protected $casts = [
        'reservation_date' => 'date',
    ];

    public function flight()
    {
        return $this->belongsTo(Flight::class);
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function startAirport()
    {
        return $this->belongsTo(Airport::class, 'start_airport_id');
    }

    public function endAirport()
    {
        return $this->belongsTo(Airport::class, 'end_airport_id');
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}