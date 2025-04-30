<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\UserUpload;
use App\Models\AIRequest;

class UploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,mp4,mov,avi|max:51200', // до 50 МБ
        ]);

        $file = $request->file('file');
        $type = $this->detectType($file->getMimeType());

        if (!$type) {
            return response()->json(['error' => 'Unsupported file type'], 422);
        }

        // Сохраняем файл в папку uploads
        $path = $file->store('uploads', 'public');

        // Создаем запись о загрузке
        $upload = UserUpload::create([
            'path' => $path,
            'type' => $type,
        ]);

        // Создаем запрос в очередь ИИ
        $aiRequest = AIRequest::create([
            'upload_id' => $upload->id,
            'status' => 'queued',
            'time' => 0,
        ]);

        return response()->json([
            'message' => 'Файл загружен и отправлен на обработку',
            'upload_id' => $upload->id,
            'ai_request_id' => $aiRequest->id,
        ]);
    }

    private function detectType($mimeType)
    {
        if (str_starts_with($mimeType, 'image/')) {
            return 'image';
        }
        if (str_starts_with($mimeType, 'video/')) {
            return 'video';
        }
        return null;
    }
}
