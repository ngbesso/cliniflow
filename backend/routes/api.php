<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\HealthController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use function Pest\Laravel\withoutMiddleware;

Route::get('/health', HealthController::class)->withoutMiddleware(EnsureFrontendRequestsAreStateful::class);

Route::post('/login', [AuthenticatedSessionController::class, 'store']);

Route::get('/user', fn (Request $request) => new UserResource($request->user()))
    ->middleware('auth:sanctum');

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth:sanctum');
