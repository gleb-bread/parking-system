import * as Models from '@/entities/Models';

export const newUserRole = function () {
    return new Models.CreateUserRole({
        role_id: 0,
        user_id: 0,
    });
};
