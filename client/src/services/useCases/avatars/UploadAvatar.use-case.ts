import { CONFIG_TYPES, NETWORK_TYPES } from "@Container";
import type { ApiResponse, AvatarUrls, NestedRoutes } from "@Types";
import { Logger } from "@Utils";
import type { AxiosService } from "@Services";
import { inject, injectable } from "inversify";
import { AbstractService } from "../abstract/abstract.use-case";

@injectable()
export class UploadAvatarUseCase extends AbstractService<AvatarUrls> {
  private readonly axiosRequest: AxiosService;

  constructor(
    @inject(NETWORK_TYPES._AxiosRequest) axiosRequest: AxiosService,
    @inject(CONFIG_TYPES._Routes) routes: NestedRoutes,
    @inject(CONFIG_TYPES._IsProd) isProd: boolean,
  ) {
    super(routes, isProd);
    this.axiosRequest = axiosRequest;
  }

  /** Sube (o reemplaza) la foto de perfil. Recibe la imagen ya recortada (blob). */
  async execute(image: Blob): Promise<AvatarUrls> {
    try {
      const form = new FormData();
      form.append("file", image, "avatar.webp");

      const response = await this.axiosRequest.execute<
        ApiResponse<AvatarUrls>
      >({
        url: this.getRoute("avatars.upload"),
        method: "POST",
        body: form,
      });
      return response.data;
    } catch (error) {
      Logger.error("Error uploadAvatar", error);
      throw error;
    }
  }
}
