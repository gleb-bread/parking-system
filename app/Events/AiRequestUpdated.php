<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;
use App\Models\AiRequest;

class AiRequestUpdated implements ShouldBroadcast
{
    use SerializesModels;

    public $aiRequest;

    public function __construct(AiRequest $aiRequest)
    {
        // Можно использовать toArray() для сериализации, если хочешь.
        $this->aiRequest = $aiRequest;
    }

    public function broadcastOn()
    {
        return new Channel('ai-requests');
    }

    public function broadcastWith()
    {
        return $this->aiRequest->toArray();
    }

    public function broadcastAs()
    {
        return 'AiRequestUpdated';
    }
}
