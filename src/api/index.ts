import { MicrofrontendService } from "./services/microfrontends.service";
import axios from "axios";

// FIXME: эта штука создается где?
const axiosInstance = axios.create({
  baseURL: "http://localhost:3030",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export class Api {
  microfrontendService: MicrofrontendService | null = null;

  constructor() {
    this.microfrontendService = new MicrofrontendService(axiosInstance);
  }
}

const apiInstance = new Api();

export default apiInstance;
