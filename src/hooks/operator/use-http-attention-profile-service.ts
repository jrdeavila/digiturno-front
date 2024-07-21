import { AxiosInstance } from "axios";
import useHttpClient from "./use-http-client";
import { Service, ServiceResponse } from "./use-http-service-service";

export interface AttentionProfileResponse {
  id: number;
  name: string;
  services: ServiceResponse[];
}

export class AttentionProfile {
  id: number;
  name: string;
  services: Service[];

  constructor(id: number, name: string, services: Service[]) {
    this.id = id;
    this.name = name;
    this.services = services;
  }
}

// Singleton
class HttpAttentionProfileService {
  private static instance: HttpAttentionProfileService;
  private httpClient: AxiosInstance;

  private constructor(httpClient: AxiosInstance) {
    this.httpClient = httpClient;
  }

  static getInstance(httpClient: AxiosInstance) {
    if (!HttpAttentionProfileService.instance) {
      HttpAttentionProfileService.instance = new HttpAttentionProfileService(
        httpClient
      );
    }
    return HttpAttentionProfileService.instance;
  }

  async getAttentionProfiles(): Promise<AttentionProfile[]> {
    const response = await this.httpClient.get<{
      data: AttentionProfileResponse[];
    }>("/attention_profiles");
    const data = response.data.data;
    const attentionProfiles = data.map((attentionProfile) => {
      const services = attentionProfile.services.map((service) => {
        return new Service(service.id, service.name);
      });
      return new AttentionProfile(
        attentionProfile.id,
        attentionProfile.name,
        services
      );
    });
    return attentionProfiles;
  }
}

const useHttpServiceService = () => {
  const httpClient = useHttpClient();
  return HttpAttentionProfileService.getInstance(httpClient);
};

export default useHttpServiceService;
