<script lang="ts" setup>
import { computed, onMounted, onBeforeUnmount } from "vue";
import { Props } from "./props";
import { useAiRequestsStore } from "@/app/stores/aiRequests";
import * as Models from "@/entities/Models";
import * as Types from "@/shared/types";
import echo from "@/echo";

const props = defineProps<Props>();
const aiRequestsStore = useAiRequestsStore();

const getAiRequest = computed<Models.AiRequest | undefined>(
    () => aiRequestsStore.getAiRequests[props.itemId]
);

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

const setSelectRequest = function () {
    aiRequestsStore.setSelectRequest(props.itemId);
};

onMounted(() => {
    echo.channel("ai-requests")
        .subscribed(() => {
            console.log("Successfully connected to ai-requests channel");
        })
        .listen("AiRequestUpdated", (e) => {
            console.log("Received WebSocket event:", e);
        });
    // echo.channel("ai-requests").listen(".AiRequestUpdated", (e) => {
    //     console.log(e);
    //     // const index = requests.findIndex((r) => r.id === e.id);
    //     // if (index !== -1) {
    //     //     requests[index].status = e.status;
    //     //     requests[index].timeElapsed = e.time;
    //     // }
    // });
});

onBeforeUnmount(() => {
    echo.leave("ai-requests");
});
</script>

<template>
    <template v-if="getAiRequest">
        <v-list-item @click.stop="setSelectRequest">
            <v-list-item-title>
                Запрос #{{ getAiRequest.id }}
            </v-list-item-title>
            <v-list-item-subtitle>
                {{ getUploadTypeTitle(getAiRequest.upload_type) }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
                Время выполнения: {{ getAiRequest.time }}s
            </v-list-item-subtitle>

            <v-list-item-action>
                <v-chip :color="getStatusColor(getAiRequest.status)" small>
                    {{ getStatusTitle(getAiRequest.status) }}
                </v-chip>
            </v-list-item-action>
        </v-list-item>
    </template>
</template>
