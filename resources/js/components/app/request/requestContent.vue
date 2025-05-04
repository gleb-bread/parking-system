<script lang="ts" setup>
import { useAiRequestsStore } from "@/app/stores/aiRequests";
import { computed } from "vue";
import {
    VContainer,
    VCard,
    VCardTitle,
    VCardText,
    VAlert,
    VChip,
} from "vuetify/components";
import * as Types from "@/shared/types";

const aiRequestsStore = useAiRequestsStore();

const getSelectRequest = computed(() => {
    if (aiRequestsStore.getSelectRequest)
        return aiRequestsStore.getAiRequests[aiRequestsStore.getSelectRequest];
    return null;
});

function getStatusColor(status: Types.AiRequests.AiRequestsStatuses): string {
    switch (status) {
        case "queued":
            return "grey";
        case "processing":
            return "blue";
        case "success":
            return "green";
        case "error":
            return "red";
        default:
            return "primary";
    }
}

function getStatusTitle(status: Types.AiRequests.AiRequestsStatuses) {
    switch (status) {
        case "queued":
            return "В очереди";
        case "processing":
            return "В процессе";
        case "success":
            return "Успех";
        case "error":
            return "Ошибка";
        default:
            return "Неизвестный";
    }
}

function getUploadTypeTitle(type: Types.Upload.UploadTypes) {
    switch (type) {
        case "image":
            return "Изображение";
        case "video":
            return "Видео";
        default:
            return "Неизвестно";
    }
}

function loadPDF() {
    aiRequestsStore.loadFilePDF();
}

function loadExcel() {
    aiRequestsStore.loadFileExcel();
}
</script>

<template>
    <VContainer>
        <template v-if="getSelectRequest">
            <VCard class="mb-4" elevation="2">
                <VCardTitle>
                    Запрос №{{ getSelectRequest.id }}
                    <VChip
                        :color="getStatusColor(getSelectRequest.status)"
                        class="ml-4"
                        label
                        small
                    >
                        {{ getStatusTitle(getSelectRequest.status) }}
                    </VChip>
                    <VSpacer />
                    <div class="mt-2">
                        <VBtn
                            :href="'/api/export/excel'"
                            target="_blank"
                            class="mr-2"
                        >
                            Excel
                        </VBtn>
                        <VBtn :href="'/api/export/pdf'" target="_blank">
                            PDF
                        </VBtn>
                    </div>
                </VCardTitle>
                <VCardText>
                    <p>
                        <strong>Тип загрузки:</strong>
                        {{ getUploadTypeTitle(getSelectRequest.upload_type) }}
                    </p>
                    <p>
                        <strong>Дата создания:</strong>
                        {{
                            new Date(
                                getSelectRequest.created_at
                            ).toLocaleString()
                        }}
                    </p>

                    <p><strong>Входящие данные:</strong></p>
                    <VAlert type="info" border="start" class="mb-4">
                        <pre>/storage/{{ getSelectRequest.upload_path }}</pre>
                    </VAlert>

                    <div class="mb-4">
                        <strong>Предпросмотр:</strong>
                        <div
                            v-if="getSelectRequest.upload_type === 'image'"
                            class="preview"
                        >
                            <img
                                :src="`/storage/${getSelectRequest.upload_path}`"
                                alt="Загруженное изображение"
                                style="max-width: 100%; border-radius: 8px"
                            />
                        </div>
                        <div
                            v-else-if="getSelectRequest.upload_type === 'video'"
                            class="preview"
                        >
                            <video
                                controls
                                :src="getSelectRequest.upload_path"
                                style="max-width: 100%; border-radius: 8px"
                            />
                        </div>
                        <div v-else>
                            <em>Тип вложения не поддерживается.</em>
                        </div>
                    </div>

                    <div class="mb-4">
                        <strong>Финальное изображение:</strong>
                        <div v-if="getSelectRequest.result_img" class="preview">
                            <img
                                :src="`/storage/${getSelectRequest.result_img}`"
                                alt="Финальное изображение"
                                style="max-width: 100%; border-radius: 8px"
                            />
                        </div>
                        <div v-else>
                            <em>Финальное изображение отсутствует.</em>
                        </div>
                    </div>

                    <p><strong>Результат выполнения JSON:</strong></p>
                    <VAlert
                        v-if="getSelectRequest.response"
                        :type="
                            getSelectRequest.status === 'success'
                                ? 'success'
                                : 'error'
                        "
                        border="start"
                    >
                        <pre>{{ getSelectRequest.response }}</pre>
                    </VAlert>
                    <VAlert v-else type="warning" border="start">
                        Результат ещё не доступен.
                    </VAlert>
                </VCardText>
            </VCard>
        </template>

        <template v-else>
            <VCard>
                <VCardTitle>404 - Запрос не найден</VCardTitle>
                <VCardText>
                    Проверьте правильность идентификатора запроса.
                </VCardText>
            </VCard>
        </template>
    </VContainer>
</template>

<style scoped>
pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: monospace;
}

.preview {
    margin-top: 8px;
    max-width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
