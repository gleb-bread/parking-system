<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_requests', function (Blueprint $table) {
            $table->id();
            
            // Внешний ключ на загруженный файл
            $table->foreignId('upload_id')
                ->constrained('user_uploads')
                ->onDelete('cascade');

            // Статус запроса (queued, processing, success, error)
            $table->enum('status', ['queued', 'processing', 'success', 'error'])->default('queued');

            // Время выполнения запроса (в секундах)
            $table->float('time')->default(0);

            // Ответ от ИИ (может быть JSON или текст)
            $table->longText('response')->nullable();

            // Точность выполнения (от 0 до 1, например 0.95 = 95%)
            $table->float('accuracy')->nullable();

            $table->timestamps(); // created_at, updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_requests');
    }
};
