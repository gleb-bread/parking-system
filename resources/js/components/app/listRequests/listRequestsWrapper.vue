<script lang="ts" setup>
import { useAiRequestsStore } from "@/app/stores/aiRequests";
import requestItem from "./requestItem.vue";
import { computed } from "vue";

const resetSelectRequest = function () {
    aiRequestsStore.resetSelectRequest();
};

const aiRequestsStore = useAiRequestsStore();

const getGenericList = computed(() => aiRequestsStore.getGenericList);
</script>

<template>
    <!-- Navigation Drawer -->
    <v-navigation-drawer app permanent>
        <v-list nav>
            <template
                v-for="requestId in getGenericList"
                :key="'item-ai-request-' + requestId"
            >
                <requestItem :itemId="requestId" />
            </template>
        </v-list>
        <template #append>
            <VBtn
                @click.stop="resetSelectRequest"
                :elevation="0"
                class="w-100 rounded-0"
                color="info"
            >
                Добавить
            </VBtn>
        </template>
    </v-navigation-drawer>
</template>
