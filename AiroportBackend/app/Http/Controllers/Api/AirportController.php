<?php
// app/Http/Controllers/Api/AirportController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use Illuminate\Http\Request;

class AirportController extends Controller
{
    // All methods require admin
    

    public function index()
    {
        return Airport::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:airports',
            'city' => 'required|string',
        ]);

        return Airport::create($data);
    }

    public function show(Airport $airport)
    {
        return $airport;
    }

    public function update(Request $request, Airport $airport)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|unique:airports,name,' . $airport->id,
            'city' => 'sometimes|string',
        ]);

        $airport->update($data);

        return $airport;
    }

    public function destroy(Airport $airport)
    {
        // Check if airport is linked to any flight/stopover/reservation before deletion?
        // Foreign keys with restrict/cascade will handle it; we can provide a safety check.
        $airport->delete();

        return response()->noContent();
    }
}