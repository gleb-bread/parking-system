import { ref } from "vue";
import * as Types from "@/shared/types";
import * as Models from "@/entities/Models";
import * as StoreTemplates from "./template";

export const initState = function () {
    const aiRequests = ref<Types.Objects.NumberObject<Models.UserRole>>({});
    const newUserRole = ref<Models.CreateUserRole>(
        StoreTemplates.newUserRole()
    );
    const selectUserRole = ref<number | null>(null);
    const genericList = ref<number[]>([]);

    return { newUserRole, usersRoles, genericList, selectUserRole };
};
