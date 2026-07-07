<?php

// database/seeders/TicketSeeder.php

namespace Database\Seeders;

use App\Models\Ticket;
use App\Models\Reservation;
use Illuminate\Database\Seeder;

class TicketSeeder extends Seeder
{
    public function run(): void
    {
        $reservations = Reservation::all();

        foreach ($reservations as $reservation) {
            // Randomly 1 to 3 passengers per reservation
            $count = rand(1, 3);
            Ticket::factory()->count($count)->create([
                'reservation_id' => $reservation->id,
            ]);
        }
    }
}