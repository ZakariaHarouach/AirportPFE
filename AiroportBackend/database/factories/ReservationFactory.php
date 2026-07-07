<?php

// database/factories/ReservationFactory.php

namespace Database\Factories;

use App\Models\Flight;
use App\Models\User;
use App\Models\Airport;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReservationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'flight_id' => Flight::factory(),
            'client_id' => User::factory(), // defaults to non-admin
            'reservation_date' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'start_airport_id' => Airport::factory(),
            'end_airport_id' => Airport::factory(),
        ];
    }
}