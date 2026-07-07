<?php

// database/seeders/AirportSeeder.php

namespace Database\Seeders;

use App\Models\Airport;
use Illuminate\Database\Seeder;

class AirportSeeder extends Seeder
{
    public function run(): void
    {
        Airport::factory()->count(10)->create();
    }
}