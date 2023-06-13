import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export interface ExtendedAxiosConfig extends AxiosRequestConfig {
  retrieveAllData?: boolean;
}

/**
 * По идее это должен быть общий модуль взаимодействия с апи
 */
export class NetworkService {
  protected networkModule: AxiosInstance = null;

  constructor(networkModule: AxiosInstance) {
    this.networkModule = networkModule;
  }

  protected async get<R>(url: string, config?: ExtendedAxiosConfig): Promise<AxiosResponse<R> | R> {
    const result = await this.networkModule.get<R>(url, config);
    return config?.retrieveAllData ? result : result.data;
  }

  protected async post<D, R = unknown>(
    url: string,
    data: D,
    config: ExtendedAxiosConfig = { retrieveAllData: false }
  ): Promise<AxiosResponse<R> | R> {
    const result = await this.networkModule.post<R, AxiosResponse<R>, D>(url, data, config);
    return config?.retrieveAllData ? result : result.data;
  }

  protected async delete<D, R = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<R> {
    return await this.networkModule.delete<D, R>(url, config);
  }

  // TODO: добавить в случае необходимости
  private put<T>(): T {
    return null;
  }

  private patch<T>(): T {
    return null;
  }
}
