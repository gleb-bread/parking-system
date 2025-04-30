<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserUpload extends Model
{
    use HasFactory;

    // Таблица, к которой привязана модель
    protected $table = 'user_uploads';

    // Разрешенные к массовому заполнению поля
    protected $fillable = [
        'path',
        'type',
    ];


    public function aiRequest()
    {
        return $this->hasOne(AIRequest::class, 'upload_id');
    }
}
