<?php
// database/seeders/StopoverSeeder.php

namespace Database\Seeders;

use App\Models\Stopover;
use App\Models\Flight;
use App\Models\Airport;
use Illuminate\Database\Seeder;

class StopoverSeeder extends Seeder
{
    public function run(): void
    {
        $flights = Flight::all();
        $airports = Airport::all();

        foreach ($flights as $flight) {
            // Randomly add 0 to 2 stopovers per flight
            $count = rand(0, 2);
            for ($i = 0; $i < $count; $i++) {
                Stopover::factory()->create([
                    'flight_id' => $flight->id,
                    'airport_id' => $airports->random()->id,
                    // Adjust date_time to be between start and end of flight (optional)
                ]);
            }
        }
    }
}