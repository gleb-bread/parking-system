import * as Repositories from "@/entities/repositories";
import * as DTOs from "@/entities/DTOs";

export class AiRequest extends Repositories.ARepository.ARepository {
    constructor(
        config?: Repositories.ARepository.RepositoryTypes.RepositoryConfig
    ) {
        super("/api/ai-request", config);
    }

    public async getAll() {
        return await this.GET()
            .then((response) => {
                return this.generateResponseSuccess<DTOs.AiRequestDTO.DTO[]>({
                    response: response,
                });
            })
            .catch((response) => {
                return this.generateResponseError({
                    response: response,
                });
            });
    }

    public async create() {
        return await this.POST()
            .then((response) => {
                return this.generateResponseSuccess<DTOs.AiRequestDTO.DTO>({
                    response: response,
                });
            })
            .catch((response) => {
                return this.generateResponseError({
                    response: response,
                });
            });
    }
}
