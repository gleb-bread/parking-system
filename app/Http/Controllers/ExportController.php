<?php

namespace App\Http\Controllers;

use App\Models\AIRequest;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Exports\AIRequestExport;

class ExportController extends Controller
{
    public function export($format)
    {
        $filename = 'ai_requests_' . now()->format('Ymd_His');

        if ($format === 'excel') {
            return Excel::download(new AIRequestExport, $filename . '.xlsx');
        }

        if ($format === 'pdf') {
            $data = AIRequest::with('upload')->get();
            $pdf = Pdf::loadView('exports.ai_requests', ['requests' => $data]);

            return $pdf->download($filename . '.pdf');
        }

        return response()->json(['error' => 'Unsupported format'], 400);
    }
}
