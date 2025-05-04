<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;
use App\Models\AiRequest;
use Illuminate\Support\Facades\Log;

class AiRequestUpdated implements ShouldBroadcast
{
    use SerializesModels;

    public $aiRequest;

    public function __construct(AiRequest $aiRequest)
    {
        Log::info("Was start.");
        // Можно использовать toArray() для сериализации, если хочешь.
        $this->aiRequest = $aiRequest;
    }

    public function broadcastOn()
    {
        Log::info("Broadcasting AiRequestUpdated event to ai-requests channel.");
        return new Channel('ai-requests');
    }

    public function broadcastWith()
    {
        Log::info("Preparing data to broadcast.", $this->aiRequest->toArray());
        return $this->aiRequest->toArray();
    }

    public function broadcastAs()
    {
        return 'AiRequestUpdated';
    }
}
