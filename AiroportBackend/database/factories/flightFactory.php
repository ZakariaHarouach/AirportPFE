<?php

// database/factories/FlightFactory.php

namespace Database\Factories;

use App\Models\Airport;
use Illuminate\Database\Eloquent\Factories\Factory;

class FlightFactory extends Factory
{
    public function definition(): array
    {
        $startDateTime = $this->faker->dateTimeBetween('now', '+1 month');
        $endDateTime = (clone $startDateTime)->modify('+'.rand(2,10).' hours');

        return [
            'start_date_time' => $startDateTime,
            'end_date_time' => $endDateTime,
            'max_travelers' => $this->faker->numberBetween(50, 300),
            'is_closed' => false,
            'start_airport_id' => Airport::factory(),
            'end_airport_id' => Airport::factory(),
        ];
    }

    // State for closed flights
    public function closed(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_closed' => true,
        ]);
    }
}