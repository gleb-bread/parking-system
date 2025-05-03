<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\AIRequestController;

Route::post('/upload', [UploadController::class, 'upload']);

Route::post('/ai_request/updated', [AIRequestController::class, 'updated']);
