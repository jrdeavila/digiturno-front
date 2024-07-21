import { AxiosInstance } from "axios";
import useHttpClient from "./use-http-client";

export interface Room {
  id: number;
  name: string;
}

export interface ModuleResponse {
  id: number;
  name: string;
  ip_address: string;
  room: Room;
  type: string;
  status: string;
  enabled: boolean;
  attention_profile_id: number;
}

export class Module {
  id: number;
  name: string;
  ipAddress: string;
  room: Room;
  type: string;
  status: string;
  enabled: boolean;
  attentionProfileId: number;

  constructor(
    id: number,
    name: string,
    ipAddress: string,
    room: Room,
    type: string,
    status: string,
    enabled: boolean,
    attentionProfileId: number
  ) {
    this.id = id;
    this.name = name;
    this.ipAddress = ipAddress;
    this.room = room;
    this.type = type;
    this.status = status;
    this.enabled = enabled;
    this.attentionProfileId = attentionProfileId;
  }
}

class HttpModuleService {
  private static instance: HttpModuleService;
  private httpClient: AxiosInstance;

  private constructor(httpClient: AxiosInstance) {
    this.httpClient = httpClient;
  }

  static getInstance(httpClient: AxiosInstance) {
    if (!HttpModuleService.instance) {
      HttpModuleService.instance = new HttpModuleService(httpClient);
    }
    return HttpModuleService.instance;
  }

  async getMyModule(ipAddress: string): Promise<Module> {
    const response = await this.httpClient.get<{
      data: ModuleResponse;
    }>("/modules/ip-address", {
      params: {
        ip_address: ipAddress,
      },
    });
    return new Module(
      response.data.data.id,
      response.data.data.name,
      response.data.data.ip_address,
      response.data.data.room,
      response.data.data.type,
      response.data.data.status,
      response.data.data.enabled,
      response.data.data.attention_profile_id
    );
  }
}

const useHttpModuleService = () => {
  const httpClient: AxiosInstance = useHttpClient();
  return HttpModuleService.getInstance(httpClient);
};
export default useHttpModuleService;
