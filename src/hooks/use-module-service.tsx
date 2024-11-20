import { AxiosInstance } from "axios";
import useHttpClient from "./operator/use-http-client";

export interface Room {
  id: number;
  name: string;
  branch_id: number;
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
  module_type_id: number;
  current_attendant_id: number;
}

export class Module {
  id: number; // Identificador del módulo
  name: string; // Nombre del módulo
  ipAddress: string; // Dirección IP del módulo
  room: Room; // Sala a la que pertenece el módulo
  type: string;
  status: string;
  enabled: boolean;
  attentionProfileId: number;
  moduleTypeId: number;
  currentAttendantId: number;

  constructor(
    id: number,
    name: string,
    ipAddress: string,
    room: Room,
    type: string,
    status: string,
    enabled: boolean,
    attentionProfileId: number,
    module_type_id: number,
    current_attendant_id: number
  ) {
    this.id = id;
    this.name = name;
    this.ipAddress = ipAddress;
    this.room = room;
    this.type = type;
    this.status = status;
    this.enabled = enabled;
    this.attentionProfileId = attentionProfileId;
    this.moduleTypeId = module_type_id;
    this.currentAttendantId = current_attendant_id;
  }
}

export const moduleResponseToModule = (
  moduleResponse: ModuleResponse
): Module => {
  return new Module(
    moduleResponse.id,
    moduleResponse.name,
    moduleResponse.ip_address,
    moduleResponse.room,
    moduleResponse.type,
    moduleResponse.status,
    moduleResponse.enabled,
    moduleResponse.attention_profile_id,
    moduleResponse.module_type_id,
    moduleResponse.current_attendant_id
  );
};

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
    }>("/modules/myself", {
      headers: {
        "X-Module-Ip": ipAddress,
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
      response.data.data.attention_profile_id,
      response.data.data.module_type_id,
      response.data.data.current_attendant_id
    );
  }

  async getModules(ipAddress: string): Promise<Module[]> {
    const response = await this.httpClient.get<{
      data: ModuleResponse[];
    }>("/modules", {
      headers: {
        "X-Module-Ip": ipAddress,
      },
    });
    return response.data.data.map(moduleResponseToModule);
  }
}

const useHttpModuleService = () => {
  const httpClient: AxiosInstance = useHttpClient();
  return HttpModuleService.getInstance(httpClient);
};
export default useHttpModuleService;
