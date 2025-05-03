<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('ai-requests', function () {
    return true;
});