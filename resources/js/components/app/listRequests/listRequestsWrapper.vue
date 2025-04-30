<script lang="ts" setup>
import { ref, reactive, onBeforeUnmount } from "vue";
// Navigation requests placeholder
interface RequestItem {
    id: number;
    dataType: "Image" | "Video";
    timeElapsed: number;
    status: "Queued" | "Processing" | "Success" | "Error";
}
const requests = reactive<RequestItem[]>([
    { id: 1, dataType: "Image", timeElapsed: 0, status: "Queued" },
    { id: 2, dataType: "Video", timeElapsed: 12, status: "Processing" },
    { id: 3, dataType: "Image", timeElapsed: 30, status: "Success" },
    { id: 4, dataType: "Video", timeElapsed: 45, status: "Error" },
]);

function getStatusColor(status: RequestItem["status"]): string {
    switch (status) {
        case "Queued":
            return "grey";
        case "Processing":
            return "blue";
        case "Success":
            return "green";
        case "Error":
            return "red";
        default:
            return "primary";
    }
}
</script>

<template>
    <!-- Navigation Drawer -->
    <v-navigation-drawer app permanent>
        <v-list nav>
            <v-list-item v-for="request in requests" :key="request.id">
                <v-list-item-title>Request #{{ request.id }}</v-list-item-title>
                <v-list-item-subtitle>
                    {{ request.dataType }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                    Time: {{ request.timeElapsed }}s
                </v-list-item-subtitle>

                <v-list-item-action>
                    <v-chip :color="getStatusColor(request.status)" small>
                        {{ request.status }}
                    </v-chip>
                </v-list-item-action>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>
