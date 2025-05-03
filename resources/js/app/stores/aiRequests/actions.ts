import { initState } from './state';
import * as Types from '@/shared/types';
import * as Services from '@/entities/services';
import * as StoreTemplates from './template';
import * as Models from '@/entities/Models';
import { UnwrapRef } from 'vue';
import { useUserCompanyStore } from '../userCompany';
import { useUserStore } from '../user';

export const initActions = function (state: ReturnType<typeof initState>) {
    const userCompanyStore = useUserCompanyStore();
    const userStore = useUserStore();

    const setUsersRoles = async function () {
        const service = new Services.UserRole();

        const response = await service.getAll();

        if (response.result) {
            state.genericList.value = response.data.genericList;
            state.usersRoles.value = response.data.entities;
        } else {
            console.error(response.data);
        }
    };

    const create = async function () {
        const service = new Services.UserRole();
        const newUserRole = state.newUserRole.value;

        const response = await service.create(newUserRole);

        if (response.result) {
            const userRole = response.data;

            state.genericList.value.unshift(userRole.id);
            userCompanyStore.addUserRole(userRole);
            state.usersRoles.value[userRole.id] = userRole;

            resetNewUserRole();
            userStore.resetNewUser();
        } else {
            console.error(response.data);
        }
    };

    const resetNewUserRole = function () {
        state.newUserRole.value = StoreTemplates.newUserRole();
    };

    const Delete = async function (
        userRole: Models.UserRole | UnwrapRef<Models.UserRole>
    ) {
        const service = new Services.UserRole();

        const response = await service.delete(userRole);

        if (response.result) {
            state.genericList.value = state.genericList.value.filter(
                (userRoleId) => userRoleId !== userRole.id
            );
            userCompanyStore.deleteUserRole(userRole);

            delete state.usersRoles.value[userRole.id];
        } else {
            console.error(response.data);
        }
    };

    const setSelectUserRole = function (v: number) {
        state.selectUserRole.value = v;
    };

    const resetSelectUserRole = function () {
        state.selectUserRole.value = null;
    };

    const findUserRoleByUserIdAndRoleId = function (
        userId: number,
        roleId: number
    ) {
        const userRole = Object.values(state.usersRoles.value).find(
            (userRole) =>
                userRole.user_id == userId && userRole.role_id == roleId
        );

        return userRole;
    };

    const findUserRoleByUserId = function (userId: number) {
        const userRoles = Object.values(state.usersRoles.value).filter(
            (userRole) => userRole.user_id == userId
        );

        return userRoles;
    };

    return {
        setUsersRoles,
        resetNewUserRole,
        create,
        Delete,
        setSelectUserRole,
        resetSelectUserRole,
        findUserRoleByUserIdAndRoleId,
        findUserRoleByUserId,
    };
};
