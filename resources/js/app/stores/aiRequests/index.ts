import { defineStore } from "pinia";
import { initState } from "./state";
import { initGetters } from "./getters";
import { initActions } from "./actions";
import { STORES } from "../stores.name.enum";

export const useAiRequestsStore = defineStore(STORES.AI_REQUESTS_STORE, () => {
    const state = initState();

    const Getters = initGetters(state);

    const Actions = initActions(state);

    return {
        ...Getters,
        ...Actions,
    };
});
