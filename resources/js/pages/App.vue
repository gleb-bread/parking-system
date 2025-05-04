<template>
    <v-app>
        <listRequestsWrapper />

        <v-main>
            <template v-if="!getSelectRequest">
                <v-container>
                    <h1>Интерфейс загрузки и стрима</h1>

                    <!-- Upload Controls -->
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-file-input
                                label="Выбрать изображение или видео"
                                accept="image/*,video/*"
                                @change="onFileSelected"
                                outlined
                            />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-btn
                                :disabled="!selectedFile"
                                @click="analyzeFile"
                                color="primary"
                            >
                                Проанализировать файл
                            </v-btn>
                        </v-col>
                    </v-row>

                    <!-- Camera Stream -->
                    <!-- <v-row class="mt-6">
                        <v-col cols="12">
                            <h2>Живой стрим с камеры</h2>
                            <video
                                ref="videoRef"
                                width="640"
                                height="480"
                                autoplay
                                muted
                                playsinline
                                style="border: 1px solid #ccc"
                            ></video>
                        </v-col>

                        <v-col cols="12" class="text-center">
                            <v-btn @click="toggleCamera" color="secondary">
                                {{
                                    streaming
                                        ? "Остановить камеру"
                                        : "Запустить камеру"
                                }}
                            </v-btn>

                            <v-btn
                                v-if="streaming"
                                class="ml-4"
                                @click="toggleRecording"
                                color="primary"
                            >
                                {{
                                    recording
                                        ? "Остановить запись"
                                        : "Начать запись"
                                }}
                            </v-btn>

                            <v-btn
                                v-if="recordedFile"
                                class="ml-4"
                                @click="sendRecordedStream"
                                color="success"
                            >
                                Отправить запись стрима
                            </v-btn>
                        </v-col>
                    </v-row> -->
                </v-container>

                <!-- Snackbar for errors -->
                <v-snackbar
                    v-model="snackbar.show"
                    :color="snackbar.color"
                    timeout="4000"
                >
                    {{ snackbar.text }}
                </v-snackbar>
            </template>
            <template v-else>
                <requestContent />
            </template>
        </v-main>
    </v-app>
</template>

<script lang="ts" setup>
import { ref, onBeforeUnmount, computed } from "vue";
import listRequestsWrapper from "@/components/app/listRequests/listRequestsWrapper.vue";
import axios from "axios";
import requestContent from "@/components/app/request/requestContent.vue";
import { useAiRequestsStore } from "@/app/stores/aiRequests";
import * as DTOs from "@/entities/DTOs";

const aiRequestsStore = useAiRequestsStore();

// Разрешенные типы файлов
const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
];
const MAX_SIZE_MB = 200;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

// Snackbar для ошибок
const snackbar = ref({
    show: false,
    text: "",
    color: "error",
});

function showError(message: string) {
    snackbar.value.text = message;
    snackbar.value.color = "error";
    snackbar.value.show = true;
}

// File upload
const selectedFile = ref<File | null>(null);

function onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) {
        selectedFile.value = null;
        return;
    }

    const file = target.files[0];

    if (!validateFile(file)) {
        selectedFile.value = null;
        return;
    }
    selectedFile.value = file;
}

function validateFile(file: File): boolean {
    if (!allowedMimeTypes.includes(file.type)) {
        showError(
            "Недопустимый формат файла. Разрешены только JPG, PNG, MP4, MOV, AVI."
        );
        return false;
    }
    if (file.size > MAX_SIZE_BYTES) {
        showError(
            `Файл слишком большой. Максимальный размер ${MAX_SIZE_MB} MB.`
        );
        return false;
    }
    return true;
}

async function analyzeFile() {
    if (!selectedFile.value) return;
    const formData = new FormData();
    formData.append("file", selectedFile.value);
    try {
        const response = await axios.post("/api/upload", formData);
        aiRequestsStore.addNewReponse(response.data);
    } catch (error) {
        showError("Ошибка отправки файла на сервер");
        console.error(error);
    }
}

// Camera streaming and recording
const videoRef = ref<HTMLVideoElement>();
const stream = ref<MediaStream | null>(null);
const mediaRecorder = ref<MediaRecorder | null>(null);
const chunks = ref<Blob[]>([]);
const recordedFile = ref<File | null>(null);
const streaming = ref(false);
const recording = ref(false);
const requestsStore = useAiRequestsStore();

async function toggleCamera() {
    if (!streaming.value) {
        try {
            stream.value = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            if (videoRef.value) {
                videoRef.value.srcObject = stream.value;
            }
            streaming.value = true;
        } catch (err) {
            showError("Не удалось получить доступ к камере");
            console.error(err);
        }
    } else {
        stopCamera();
    }
}

function stopCamera() {
    stream.value?.getTracks().forEach((track) => track.stop());
    streaming.value = false;
    recording.value = false;
    mediaRecorder.value?.stop();
}

function toggleRecording() {
    if (!recording.value) {
        startRecording();
    } else {
        stopRecording();
    }
}

function startRecording() {
    if (!stream.value) return;
    chunks.value = [];
    mediaRecorder.value = new MediaRecorder(stream.value, {
        mimeType: "video/webm",
    });
    mediaRecorder.value.ondataavailable = (event) => {
        if (event.data.size > 0) {
            chunks.value.push(event.data);
        }
    };
    mediaRecorder.value.onstop = saveRecording;
    mediaRecorder.value.start();
    recording.value = true;
}

function stopRecording() {
    if (mediaRecorder.value && recording.value) {
        mediaRecorder.value.stop();
    }
    recording.value = false;
}

function saveRecording() {
    const blob = new Blob(chunks.value, { type: "video/webm" });
    const file = new File([blob], "recorded-stream.webm", {
        type: "video/webm",
    });

    if (!validateRecordedFile(file)) {
        recordedFile.value = null;
        return;
    }

    recordedFile.value = file;
    console.log("Запись сохранена:", recordedFile.value);
}

function validateRecordedFile(file: File): boolean {
    if (file.size > MAX_SIZE_BYTES) {
        showError(
            `Запись слишком большая. Максимальный размер ${MAX_SIZE_MB} MB.`
        );
        return false;
    }
    return true;
}

async function sendRecordedStream() {
    if (!recordedFile.value) return;
    const formData = new FormData();
    formData.append("file", recordedFile.value);
    try {
        const response = await axios.post("/api/upload", formData);
        console.log("Запись стрима отправлена:", response.data);
    } catch (error) {
        showError("Ошибка отправки записи стрима на сервер");
        console.error(error);
    }
}

const getSelectRequest = computed(() => requestsStore.getSelectRequest);

onBeforeUnmount(() => {
    stopCamera();
});
</script>

<style scoped>
.v-navigation-drawer {
    width: 300px;
}
</style>
