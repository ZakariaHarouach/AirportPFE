<?php
// database/seeders/FlightSeeder.php

namespace Database\Seeders;

use App\Models\Flight;
use App\Models\Airport;
use Illuminate\Database\Seeder;

class FlightSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure we have airports first
        $airports = Airport::all();

        if ($airports->count() < 2) {
            $airports = Airport::factory()->count(2)->create();
        }

        Flight::factory()->count(20)->create([
            'start_airport_id' => $airports->random()->id,
            'end_airport_id' => $airports->random()->id,
        ]);
    }
}