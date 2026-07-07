<?php
// database/seeders/ReservationSeeder.php

namespace Database\Seeders;

use App\Models\Reservation;
use App\Models\Flight;
use App\Models\User;
use App\Models\Airport;
use Illuminate\Database\Seeder;

class ReservationSeeder extends Seeder
{
    public function run(): void
    {
        $flights = Flight::all();
        $clients = User::where('is_admin', false)->get();

        for ($i = 0; $i < 30; $i++) {
            $flight = $flights->random();

            Reservation::factory()->create([
                'flight_id' => $flight->id,
                'client_id' => $clients->random()->id,
                'start_airport_id' => $flight->start_airport_id,
                'end_airport_id' => $flight->end_airport_id,
            ]);
        }
    }
}