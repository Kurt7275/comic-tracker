<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'status' => 'online',
        'service' => 'ComicTracker API Backend',
        'frontend' => env('FRONTEND_URL', 'https://kurtverse.vercel.app'),
    ]);
});
