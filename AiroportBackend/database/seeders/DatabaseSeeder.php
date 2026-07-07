<?php

// database/seeders/DatabaseSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AirportSeeder::class,
            UserSeeder::class,
            FlightSeeder::class,
            StopoverSeeder::class,
            ReservationSeeder::class,
            TicketSeeder::class,
        ]);
    }
}