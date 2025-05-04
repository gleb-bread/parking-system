import * as Repositories from "@/entities/repositories";
import * as DTOs from "@/entities/DTOs";
import * as Types from "@/shared/types";

export class ExportRepository extends Repositories.ARepository.ARepository {
    constructor(
        config?: Repositories.ARepository.RepositoryTypes.RepositoryConfig
    ) {
        super("/api/export", config);
    }

    public async load() {
        return await this.GET()
            .then((response) => {
                return this.generateResponseSuccess<any>({
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
