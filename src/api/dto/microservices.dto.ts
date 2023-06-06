export type MicroserviceDTO = {
  name: string;
  src: string;
  route: string;
  styles?: string;
};

export type AvailableMicroserviceDTO = {
  name: string;
  status: "active" | "inactive";
};
