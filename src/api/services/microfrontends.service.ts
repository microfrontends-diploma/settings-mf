import { AvailableMicroserviceDTO } from "./../dto/microservices.dto";
import { MicroserviceDTO } from "../dto/microservices.dto";
import { ExtendedAxiosConfig, NetworkService } from "./network.service";

export class MicrofrontendService extends NetworkService {
  getMicrofrontends = (config?: ExtendedAxiosConfig) => {
    return this.get<MicroserviceDTO[]>("/microfrontends", config) as Promise<MicroserviceDTO[]>;
  };

  getAvailableMicroservices = (config?: ExtendedAxiosConfig) => {
    return this.get<AvailableMicroserviceDTO[]>("/available-microfrontends", config) as Promise<AvailableMicroserviceDTO[]>;
  };

  linkMicrofrontendToMicroservice = (microservice: MicroserviceDTO, config?: ExtendedAxiosConfig) => {
    return this.post<MicroserviceDTO>("/link-microfrontend", microservice, config);
  };

  delinkMicrofrontendFromMicroservice = (microfrontendName: string, config?: ExtendedAxiosConfig) => {
    return this.delete(`/delink-microfrontend/${microfrontendName}`, config);
  };
}
