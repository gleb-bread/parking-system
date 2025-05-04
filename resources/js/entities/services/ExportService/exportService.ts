import * as Models from "@/entities/Models";
import * as Repositories from "@/entities/repositories";
import * as DTOs from "@/entities/DTOs";
import { Service } from "../Service";
import * as ServicesTypes from "@/entities/services/Service/types";
import * as Types from "@/shared/types";
import type { UnwrapRef } from "vue";

export class ExportService extends Service {
    public async loadFile(format: Types.Export.ExportTypes) {
        const repository = new Repositories.ExportRepository({
            path: format,
        });

        const response = await repository.load();

        return this.handlerResponse(response, (response) => {
            // const DTO = response.data.data;
            // const model = DTO.map(DTOs.AiRequestDTO.toModel);

            return this.generateResponse({
                data: response,
                result: response.result,
                status: response.status,
            });
        });
    }

    // public async create(
    //     payload: Models.CreateUserRole | UnwrapRef<Models.CreateUserRole>
    // ) {
    //     const repository = new Repositories.UserRole({
    //         payload: payload.getDTO(),
    //     });

    //     const response = await repository.create();

    //     return this.handlerResponse(response, (response) => {
    //         const DTO = response.data.data;
    //         const model = DTOs.UserRoleDTO.toModel(DTO);

    //         return this.generateResponse({
    //             data: model,
    //             result: response.result,
    //             status: response.status,
    //         });
    //     });
    // }
}
