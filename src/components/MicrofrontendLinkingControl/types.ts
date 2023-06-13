import { AvailableMicroserviceDTO, MicroserviceDTO } from "src/api/dto";

export type MicrofrontendLinkingControlProps = {
  availableMicroservicesToLink: AvailableMicroserviceDTO[];
  currentMicrofrontend: MicroserviceDTO;
  index: number;
  onChange: (value: MicroserviceDTO) => void;
  onDelete: () => void;
};
