<?php
// app/Models/Airport.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Airport extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'city'];

    // Flights where this airport is the START
    public function flightsAsStart()
    {
        return $this->hasMany(Flight::class, 'start_airport_id');
    }

    // Flights where this airport is the END
    public function flightsAsEnd()
    {
        return $this->hasMany(Flight::class, 'end_airport_id');
    }

    // Stopovers at this airport
    public function stopovers()
    {
        return $this->hasMany(Stopover::class);
    }

    // Reservations that specify this airport as start
    public function startReservations()
    {
        return $this->hasMany(Reservation::class, 'start_airport_id');
    }

    // Reservations that specify this airport as end
    public function endReservations()
    {
        return $this->hasMany(Reservation::class, 'end_airport_id');
    }
}