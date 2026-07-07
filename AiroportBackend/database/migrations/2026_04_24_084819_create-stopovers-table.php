<?php
// database/migrations/xxxx_xx_xx_000004_create_stopovers_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stopovers', function (Blueprint $table) {
            $table->id();
            $table->dateTime('date_time');          // Arrival time at the stopover airport

            // Foreign keys
            $table->foreignId('flight_id')->constrained()->cascadeOnDelete();
            $table->foreignId('airport_id')->constrained('airports');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stopovers');
    }
};