<?php
// app/Models/Flight.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Flight extends Model
{
    use HasFactory;

    protected $fillable = [
        'start_date_time',
        'end_date_time',
        'max_travelers',
        'is_closed',
        'start_airport_id',
        'end_airport_id',
    ];

    protected $casts = [
        'start_date_time' => 'datetime',
        'end_date_time' => 'datetime',
        'is_closed' => 'boolean',
    ];

    // The departure airport
    public function startAirport()
    {
        return $this->belongsTo(Airport::class, 'start_airport_id');
    }

    // The arrival airport
    public function endAirport()
    {
        return $this->belongsTo(Airport::class, 'end_airport_id');
    }

    // Stopovers along the route
    public function stopovers()
    {
        return $this->hasMany(Stopover::class);
    }

    // Reservations for this flight
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    // app/Models/Flight.php

/**
 * Get all airports on this flight in chronological order.
 * Returns an array of arrays: [ 'airport' => Airport, 'order' => int, 'type' => 'start'|'stopover'|'end' ]
 */
public function getRouteAirports(): array
{
    $airports = [];

    // Start airport (order 0)
    $airports[] = [
        'airport' => $this->startAirport,
        'order' => 0,
        'type' => 'start',
    ];

    // Stopovers sorted by date_time
    $stopovers = $this->stopovers()->orderBy('date_time')->get();
    foreach ($stopovers as $index => $stopover) {
        $airports[] = [
            'airport' => $stopover->airport,
            'order' => $index + 1,
            'type' => 'stopover',
        ];
    }

    // End airport (highest order)
    $airports[] = [
        'airport' => $this->endAirport,
        'order' => count($airports),
        'type' => 'end',
    ];

    return $airports;
}

/**
 * Check if a boarding/landing airport pair is valid for this flight.
 */
public function isValidBoardingLanding(int $boardingAirportId, int $landingAirportId): bool
{
    $route = $this->getRouteAirports();
    $boardingOrder = null;
    $landingOrder = null;

    foreach ($route as $stop) {
        if ($stop['airport']->id === $boardingAirportId) {
            $boardingOrder = $stop['order'];
        }
        if ($stop['airport']->id === $landingAirportId) {
            $landingOrder = $stop['order'];
        }
    }

    return $boardingOrder !== null && $landingOrder !== null && $boardingOrder < $landingOrder;
}
}