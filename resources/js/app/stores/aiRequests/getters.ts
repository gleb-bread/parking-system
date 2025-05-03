import { computed } from 'vue';
import { initState } from './state';

export const initGetters = function (state: ReturnType<typeof initState>) {
    const getUsersRoles = computed(() => state.usersRoles.value);
    const getNewUserRole = computed(() => state.newUserRole.value);
    const getGenericList = computed(() => state.genericList.value);
    const getSelectUserRole = computed(() => state.selectUserRole.value);

    return { getUsersRoles, getGenericList, getNewUserRole, getSelectUserRole };
};
