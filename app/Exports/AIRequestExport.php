<?php

namespace App\Exports;

use App\Models\AIRequest;
use Maatwebsite\Excel\Concerns\FromCollection;

class AIRequestExport implements FromCollection
{
    public function collection()
    {
        return AIRequest::with('upload')->get();
    }
}

