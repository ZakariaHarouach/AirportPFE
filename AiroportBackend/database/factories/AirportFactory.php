<?php

// database/factories/AirportFactory.php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class AirportFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->city . ' International Airport',
            'city' => $this->faker->city,
        ];
    }
}