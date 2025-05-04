import { ref } from "vue";
import * as Types from "@/shared/types";
import * as Models from "@/entities/Models";
import * as StoreTemplates from "./template";

export const initState = function () {
    const aiRequests = ref<Types.Objects.NumberObject<Models.AiRequest>>({});
    const selectRequest = ref<null | number>(null);
    // const newRequest = ref<Models.CreateUserRole>(
    //     StoreTemplates.newUserRole()
    // );
    const genericList = ref<number[]>([]);

    return { aiRequests, genericList, selectRequest };
};
