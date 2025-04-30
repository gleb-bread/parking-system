<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_uploads', function (Blueprint $table) {
            $table->id(); // id - автогенерируемый
            $table->string('path'); // path - строка с путем к файлу
            $table->enum('type', ['image', 'video']); // type - только 'image' или 'video'
            $table->timestamps(); // created_at и updated_at автоматически
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_uploads');
    }
};
