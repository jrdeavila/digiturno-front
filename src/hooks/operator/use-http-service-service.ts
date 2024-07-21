import { AxiosInstance } from "axios";
import useHttpClient from "./use-http-client";

export interface ServiceResponse {
  id: number;
  name: string;
  service: ServiceResponse | undefined;
}

export class Service {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

// Singleton
class HttpServiceService {
  private static instance: HttpServiceService;
  private httpClient: AxiosInstance;

  private constructor(httpClient: AxiosInstance) {
    this.httpClient = httpClient;
  }

  static getInstance(httpClient: AxiosInstance) {
    if (!HttpServiceService.instance) {
      HttpServiceService.instance = new HttpServiceService(httpClient);
    }
    return HttpServiceService.instance;
  }

  async getServices(): Promise<Service[]> {
    const response = await this.httpClient.get<{
      data: ServiceResponse[];
    }>("/services");
    const services = response.data.data.map((service) => {
      return new Service(service.id, service.name);
    });
    return services;
  }
}

const useHttpServiceService = () => {
  const httpClient = useHttpClient();
  return HttpServiceService.getInstance(httpClient);
};

export default useHttpServiceService;
