import { CONFIG_TYPES, NETWORK_TYPES } from "@Container";
import type {
  ApiResponse,
  DocumentTypeOption,
  NestedRoutes,
} from "@Types";
import { Logger } from "@Utils";
import type { AxiosService } from "@Services";
import { inject, injectable } from "inversify";
import { AbstractService } from "../abstract/abstract.use-case";

@injectable()
export class GetDocumentTypesUseCase extends AbstractService<
  DocumentTypeOption[]
> {
  private readonly axiosRequest: AxiosService;

  constructor(
    @inject(NETWORK_TYPES._AxiosRequest) axiosRequest: AxiosService,
    @inject(CONFIG_TYPES._Routes) routes: NestedRoutes,
    @inject(CONFIG_TYPES._IsProd) isProd: boolean,
  ) {
    super(routes, isProd);
    this.axiosRequest = axiosRequest;
  }

  /** Lista los tipos de documento (para el select del registro). */
  async execute(): Promise<DocumentTypeOption[]> {
    try {
      const response = await this.axiosRequest.execute<
        ApiResponse<DocumentTypeOption[]>
      >({
        url: this.getRoute("documentTypes.findAll"),
        method: "GET",
      });
      return response.data;
    } catch (error) {
      Logger.error("Error getDocumentTypes", error);
      throw error;
    }
  }
}
