<?php
// app/Http/Controllers/Api/ReservationController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Flight;
use App\Models\Reservation;
use App\Models\Ticket;
use Illuminate\Http\Request;

class ReservationController extends Controller
{

    // List reservations of the authenticated user
    public function index()
    {
        $reservations = auth()->user()->reservations()
            ->with([
                'flight',                // flight details (optional, but might still be useful)
                'tickets',               // passengers
                'startAirport',          // <-- the actual boarding airport
                'endAirport'             // <-- the actual landing airport
            ])
            ->get();

        return $reservations;
    }

    // Create a reservation with tickets
    public function store(Request $request)
    {
        $data = $request->validate([
            'flight_id' => 'required|exists:flights,id',
            'tickets' => 'required|array|min:1',
            'tickets.*.first_name' => 'required|string|max:255',
            'tickets.*.last_name' => 'required|string|max:255',
            'boarding_airport_id' => 'nullable|exists:airports,id',
            'landing_airport_id' => 'nullable|exists:airports,id',
        ]);

        $flight = Flight::findOrFail($data['flight_id']);

        // Default to flight's start/end if not provided
        $boardingId = $data['boarding_airport_id'] ?? $flight->start_airport_id;
        $landingId = $data['landing_airport_id'] ?? $flight->end_airport_id;

        // Validate the chosen airports belong to the flight and are in correct order
        if (!$flight->isValidBoardingLanding($boardingId, $landingId)) {
            return response()->json([
                'message' => 'Invalid boarding or landing airport for this flight.'
            ], 422);
        }

        if ($flight->is_closed) {
            return response()->json(['message' => 'Flight is closed for reservations'], 400);
        }

        // Capacity check (total flight, not segment – you can enhance later)
        $currentPassengers = $flight->reservations()
            ->withCount('tickets')
            ->get()
            ->sum('tickets_count');

        if (($currentPassengers + count($data['tickets'])) > $flight->max_travelers) {
            return response()->json(['message' => 'Not enough available seats'], 400);
        }

        $reservation = Reservation::create([
            'flight_id' => $flight->id,
            'client_id' => request()->user()->id,
            'reservation_date' => now()->toDateString(),
            'start_airport_id' => $boardingId,
            'end_airport_id' => $landingId,
        ]);

        foreach ($data['tickets'] as $passenger) {
            $reservation->tickets()->create([
                'first_name' => $passenger['first_name'],
                'last_name' => $passenger['last_name'],
            ]);
        }

        $reservation->load('tickets');

        return response()->json($reservation, 201);
    }

    // Delete a reservation (and its tickets)
    public function destroy(Reservation $reservation)
    {
        // Authorize: only the owner can delete
        if ($reservation->client_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Tickets are cascade deleted via foreign key in migration
        $reservation->delete();

        return response()->json(['message' => 'Reservation and tickets deleted']);
    }

    // Optional: Add tickets to an existing reservation
    public function addTickets(Request $request, Reservation $reservation)
    {
        if ($reservation->client_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'tickets' => 'required|array|min:1',
            'tickets.*.first_name' => 'required|string|max:255',
            'tickets.*.last_name' => 'required|string|max:255',
        ]);

        $flight = $reservation->flight;

        // Check capacity again
        $currentTotal = $flight->reservations()
            ->withCount('tickets')
            ->get()
            ->sum('tickets_count');

        if (($currentTotal + count($request->tickets)) > $flight->max_travelers) {
            return response()->json(['message' => 'Not enough seats'], 400);
        }

        foreach ($request->tickets as $passenger) {
            $reservation->tickets()->create([
                'first_name' => $passenger['first_name'],
                'last_name' => $passenger['last_name'],
            ]);
        }

        $reservation->load('tickets');

        return response()->json($reservation);
    }
}