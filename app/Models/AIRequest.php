<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AIRequest extends Model
{
    use HasFactory;

    protected $table = 'ai_requests';

    protected $fillable = [
        'upload_id',
        'status',
        'time',
        'response',
        'accuracy',
    ];

    /**
     * Связь с загруженным файлом.
     */
    public function upload()
    {
        return $this->belongsTo(UserUpload::class, 'upload_id');
    }
}
