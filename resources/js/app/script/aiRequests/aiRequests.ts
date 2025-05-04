import { useAiRequestsStore } from "@/app/stores/aiRequests";

export const loadRequests = async function () {
    const aiRequestsStore = useAiRequestsStore();

    await aiRequestsStore.setAiRequests();
};
