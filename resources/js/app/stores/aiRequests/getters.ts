import { computed } from "vue";
import { initState } from "./state";

export const initGetters = function (state: ReturnType<typeof initState>) {
    const getAiRequests = computed(() => state.aiRequests.value);
    const getGenericList = computed(() => state.genericList.value);
    const getSelectRequest = computed(() => state.selectRequest.value);

    return { getAiRequests, getGenericList, getSelectRequest };
};
