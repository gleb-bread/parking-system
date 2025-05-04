import * as DTOs from "@/entities/DTOs";
import * as Models from "@/entities/Models";
import * as Types from "@/shared/types";

export type DTO = {
    id: number;
    path: string;
    type: Types.Upload.UploadTypes;
    created_at: string;
    updated_at: string;
};

export const toModel = function (dto: DTO): Models.Upload {
    return new Models.Upload(dto);
};
