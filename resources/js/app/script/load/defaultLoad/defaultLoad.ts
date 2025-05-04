import { Scripts } from "@/app/script";

export const DefaultLoad = async function () {
    await Scripts.AIRequestScripts.loadRequests();
};
