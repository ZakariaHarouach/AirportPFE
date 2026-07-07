<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AirportController;
use App\Http\Controllers\Api\FlightController;
use App\Http\Controllers\Api\ReservationController;
use Illuminate\Http\Request;

// ── USER ──────────────────────────────────────────
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ── AUTH ─────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
    });

    Route::middleware(['auth:sanctum', 'admin'])->post(
        'admin-register',
        [AuthController::class, 'adminRegister']
    );
});

// ── PUBLIC AIRPORTS (for search) ─────────────────
Route::get('/public/airports', [AirportController::class, 'index']);

// ── AIRPORTS (admin CRUD) ────────────────────────
Route::apiResource('airports', AirportController::class)
    ->middleware(['auth:sanctum', 'admin']);

// ── FLIGHTS ──────────────────────────────────────
// (All flight routes live under the "flights" prefix)
Route::prefix('flights')->group(function () {
    // Public
    Route::get('available', [FlightController::class, 'availableIndex']);
    Route::get('available/{flight}', [FlightController::class, 'availableShow']);

    // Admin
    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::get('/', [FlightController::class, 'index']);
        Route::post('/', [FlightController::class, 'store']);
        Route::get('{flight}', [FlightController::class, 'show']);
        Route::put('{flight}', [FlightController::class, 'update']);
        Route::delete('{flight}', [FlightController::class, 'destroy']);

        // Stopovers
        Route::post('{flight}/stopovers', [FlightController::class, 'addStopover']);
        Route::delete('{flight}/stopovers/{stopover}', [FlightController::class, 'removeStopover']);
    });
});

// ── RESERVATIONS ─────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::get('reservations', [ReservationController::class, 'index']);
    Route::post('reservations', [ReservationController::class, 'store']);
    Route::delete('reservations/{reservation}', [ReservationController::class, 'destroy']);
    Route::post('reservations/{reservation}/tickets', [ReservationController::class, 'addTickets']);
});