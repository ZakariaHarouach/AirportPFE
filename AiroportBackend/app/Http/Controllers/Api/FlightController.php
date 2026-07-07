<?php

// app/Http/Controllers/Api/FlightController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Flight;
use App\Models\Stopover;
use Illuminate\Http\Request;

class FlightController extends Controller
{
  
    // ---- Admin Resource Endpoints ----
    public function index()
    {
        // All flights (admin may want to see all, including closed)
        return Flight::with(['startAirport', 'endAirport', 'stopovers.airport'])->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'start_date_time'   => 'required|date',
            'end_date_time'     => 'required|date|after:start_date_time',
            'max_travelers'     => 'required|integer|min:1',
            'is_closed'         => 'sometimes|boolean',
            'start_airport_id'  => 'required|exists:airports,id',
            'end_airport_id'    => 'required|exists:airports,id|different:start_airport_id',
        ]);

        $flight = Flight::create($data);

        return response()->json($flight, 201);
    }

    public function show(Flight $flight)
    {
        $flight->load(['startAirport', 'endAirport', 'stopovers.airport']);

        return $flight;
    }

    public function update(Request $request, Flight $flight)
    {
        $data = $request->validate([
            'start_date_time'   => 'sometimes|date',
            'end_date_time'     => 'sometimes|date|after:start_date_time',
            'max_travelers'     => 'sometimes|integer|min:1',
            'is_closed'         => 'sometimes|boolean',
            'start_airport_id'  => 'sometimes|exists:airports,id',
            'end_airport_id'    => 'sometimes|exists:airports,id|different:start_airport_id',
        ]);

        $flight->update($data);

        return $flight;
    }

    public function destroy(Flight $flight)
    {
        // Cascade or restrict? We used cascadeOnDelete in migration; will delete related stopovers/reservations.
        $flight->delete();

        return response()->noContent();
    }

    // ---- Stopover Management ----
    public function addStopover(Request $request, Flight $flight)
    {
        $data = $request->validate([
            'airport_id' => 'required|exists:airports,id',
            'date_time'  => 'required|date', // should be between flight's start and end? optional validation
        ]);

        $stopover = $flight->stopovers()->create($data);

        return response()->json($stopover, 201);
    }

    public function removeStopover(Flight $flight, Stopover $stopover)
    {
        if ($stopover->flight_id !== $flight->id) {
            return response()->json(['message' => 'Stopover does not belong to this flight'], 400);
        }

        $stopover->delete();

        return response()->noContent();
    }

    // ---- Client Endpoints (available flights) ----
    public function availableIndex(Request $request)
{
    $query = Flight::where('is_closed', false)
        ->with(['startAirport', 'endAirport', 'stopovers.airport']);

    if ($request->has('from_airport_id')) {
        $from = $request->from_airport_id;
        $query->where(function ($q) use ($from) {
            $q->where('start_airport_id', $from)
              ->orWhereHas('stopovers', function ($sq) use ($from) {
                  $sq->where('airport_id', $from);
              });
        });
    }

    if ($request->has('to_airport_id')) {
        $to = $request->to_airport_id;
        $query->where(function ($q) use ($to) {
            $q->where('end_airport_id', $to)
              ->orWhereHas('stopovers', function ($sq) use ($to) {
                  $sq->where('airport_id', $to);
              });
        });
    }

    if ($request->has('date')) {
        $query->whereDate('start_date_time', $request->date);
    }

    return $query->get();
}

    public function availableShow(Flight $flight)
    {
        if ($flight->is_closed) {
            return response()->json(['message' => 'Flight is not available'], 404);
        }

        $flight->load(['startAirport', 'endAirport', 'stopovers.airport']);

        return $flight;
    }
}