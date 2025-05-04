import * as DTOs from "@/entities/DTOs";
import * as Models from "@/entities/Models";
import * as Types from "@/shared/types";

export type DTO = {
    id: number;
    upload_id: number;
    status: Types.AiRequests.AiRequestsStatuses;
    time: number;
    response: string | null;
    accuracy: number | null;
    created_at: string;
    result_img: string | null;
    updated_at: string;
    upload: DTOs.UploadDTO.DTO;
};

export const toModel = function (dto: DTO): Models.AiRequest {
    return new Models.AiRequest(dto);
};
