<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('flights', function (Blueprint $table) {
            $table->id();
            $table->dateTime('start_date_time');
            $table->dateTime('end_date_time');
            $table->unsignedInteger('max_travelers');
            $table->boolean('is_closed')->default(false);

            // Foreign keys
            $table->foreignId('start_airport_id')->constrained('airports');
            $table->foreignId('end_airport_id')->constrained('airports');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('flights');
    }
};