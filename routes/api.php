<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\AIRequestController;

Route::post('/upload', [UploadController::class, 'upload']);

Route::patch('/ai-request', [AIRequestController::class, 'updated']);
Route::get('/ai-request', [AIRequestController::class, 'getAll']);

Route::get('/export/{format}', [App\Http\Controllers\ExportController::class, 'export']);

