import * as DTOs from "@/entities/DTOs";
import * as Models from "@/entities/Models";
import * as Types from "@/shared/types";

export class AiRequest extends Models.Model<DTOs.AiRequestDTO.DTO> {
    private _id: number;
    private _upload_id: number;
    private _status: Types.AiRequests.AiRequestsStatuses;
    private _time: number;
    private _response: string | null;
    private _accuracy: number | null;
    private _created_at: string;
    private _updated_at: string;

    constructor(dto: DTOs.AiRequestDTO.DTO) {
        super();
        this._id = dto.id;
        this._upload_id = dto.upload_id;
        this._status = dto.status;
        this._time = dto.time;
        this._response = dto.response;
        this._accuracy = dto.accuracy;
        this._created_at = dto.created_at;
        this._updated_at = dto.updated_at;
    }

    public getDTO(): DTOs.AiRequestDTO.DTO {
        return {
            id: this._id,
            upload_id: this._upload_id,
            status: this._status,
            time: this._time,
            response: this._response,
            accuracy: this._accuracy,
            created_at: this._created_at,
            updated_at: this._updated_at,
        };
    }

    public get id() {
        return this._id;
    }
    public get upload_id() {
        return this._upload_id;
    }
    public get status() {
        return this._status;
    }
    public get time() {
        return this._time;
    }
    public get response() {
        return this._response;
    }
    public get accuracy() {
        return this._accuracy;
    }
    public get created_at() {
        return this._created_at;
    }
    public get updated_at() {
        return this._updated_at;
    }
}
