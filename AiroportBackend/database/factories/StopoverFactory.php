<?php

// database/factories/StopoverFactory.php

namespace Database\Factories;

use App\Models\Flight;
use App\Models\Airport;
use Illuminate\Database\Eloquent\Factories\Factory;

class StopoverFactory extends Factory
{
    public function definition(): array
    {
        return [
            'flight_id' => Flight::factory(),
            'airport_id' => Airport::factory(),
            'date_time' => $this->faker->dateTimeBetween('now', '+1 month'),
        ];
    }
}