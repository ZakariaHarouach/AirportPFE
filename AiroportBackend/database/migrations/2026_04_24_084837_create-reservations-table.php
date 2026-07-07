<?php

// database/migrations/xxxx_xx_xx_000005_create_reservations_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->date('reservation_date');       // Date the booking was made

            // Foreign keys
            $table->foreignId('flight_id')->constrained()->cascadeOnDelete();
            $table->foreignId('client_id')->constrained('users'); // The client who booked
            $table->foreignId('start_airport_id')->constrained('airports');
            $table->foreignId('end_airport_id')->constrained('airports');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};