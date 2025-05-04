import * as DTOs from "@/entities/DTOs";
import * as Models from "@/entities/Models";
import * as Types from "@/shared/types";

export class Upload extends Models.Model<DTOs.UploadDTO.DTO> {
    private _id: number;
    private _path: string;
    private _type: Types.Upload.UploadTypes;
    private _created_at: string;
    private _updated_at: string;

    constructor(dto: DTOs.UploadDTO.DTO) {
        super();
        this._id = dto.id;
        this._path = dto.path;
        this._type = dto.type;
        this._created_at = dto.created_at;
        this._updated_at = dto.updated_at;
    }

    public getDTO(): DTOs.UploadDTO.DTO {
        return {
            id: this._id,
            path: this._path,
            type: this._type,
            created_at: this._created_at,
            updated_at: this._updated_at,
        };
    }

    public get id() {
        return this._id;
    }
    public get path() {
        return this._path;
    }
    public get type() {
        return this._type;
    }
    public get created_at() {
        return this._created_at;
    }
    public get updated_at() {
        return this._updated_at;
    }
}
