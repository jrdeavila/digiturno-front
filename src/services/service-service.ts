import {
  mapServiceResponse,
  ServiceResponse,
} from "@/data/attention-profile-mappings";
import Service from "@/models/service";
import { AxiosInstance } from "axios";

export default class ServiceService {
  httpClient: AxiosInstance;

  constructor(httpClient: AxiosInstance) {
    this.httpClient = httpClient;
  }

  async getAll(): Promise<Service[]> {
    const response = await this.httpClient.get<{
      data: ServiceResponse[];
    }>("/services");
    const services = response.data.data.map(mapServiceResponse);
    return services;
  }
}
