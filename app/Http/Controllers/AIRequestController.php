<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AiRequest;
use App\Events\AiRequestUpdated;

class AIRequestController extends Controller
{
    public function updated(Request $request)
    {
        $data = $request->validate([
            'id' => 'required|integer|exists:ai_requests,id',
            'status' => 'required|string',
            'response' => 'nullable|string',
            'accuracy' => 'nullable|numeric',
            'time' => 'nullable|numeric',
        ]);

        $aiRequest = AiRequest::find($data['id']);
        
        $aiRequest->update([
            'status' => $data['status'],
            'response' => $data['response'] ?? null,
            'accuracy' => $data['accuracy'] ?? null,
            'time' => $data['time'] ?? null,
        ]);

        // вызов события
        event(new AiRequestUpdated($aiRequest));

        return response()->json(['message' => 'Updated successfully']);
    }
}
