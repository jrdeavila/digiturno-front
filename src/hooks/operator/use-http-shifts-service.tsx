import { AxiosInstance } from "axios";
import useHttpClient from "./use-http-client";

export interface CreateShiftRequest {
  room_id: number;
  client: {
    dni: string;
    name: string;
    client_type_id: number;
  };
  services: number[];
  state: string;
}

export interface ClientResponse {
  id: number;
  name: string;
  dni: string;
  client_type: string;
  is_deleted: boolean;
}

export interface ShiftResponse {
  id: number;
  room: string;
  attention_profile: string;
  client: ClientResponse;
  state: string;
  created_at: string;
  updated_at: string;
  module?: string;
}

export class Client {
  id: number;
  name: string;
  dni: string;
  clientType: string;
  isDeleted: boolean;

  constructor(
    id: number,
    name: string,
    dni: string,
    clientType: string,
    isDeleted: boolean
  ) {
    this.id = id;
    this.name = name;
    this.dni = dni;
    this.clientType = clientType;
    this.isDeleted = isDeleted;
  }
}

export class Shift {
  id: number;
  room: string;
  attentionProfile: string;
  client: Client;
  module: string | undefined;
  state: string;
  createdAt: string;
  updatedAt: string;

  constructor(
    id: number,
    room: string,
    attentionProfile: string,
    client: Client,
    state: string,
    createdAt: string,
    updatedAt: string,
    module: string | undefined,
  ) {
    this.id = id;
    this.room = room;
    this.attentionProfile = attentionProfile;
    this.client = client;
    this.state = state;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.module = module;
  }
}

export const shiftResponseToModel = (shiftResponse: ShiftResponse): Shift => {
  const client = new Client(
    shiftResponse.client.id,
    shiftResponse.client.name,
    shiftResponse.client.dni,
    shiftResponse.client.client_type,
    shiftResponse.client.is_deleted
  );
  return new Shift(
    shiftResponse.id,
    shiftResponse.room,
    shiftResponse.attention_profile,
    client,
    shiftResponse.state,
    shiftResponse.created_at,
    shiftResponse.updated_at,
    shiftResponse.module,
  );
};

class HttpShiftService {

  private static instance: HttpShiftService;
  private httpClient: AxiosInstance;

  private constructor(httpClient: AxiosInstance) {
    this.httpClient = httpClient;
  }

  static getInstance(httpClient: AxiosInstance) {
    if (!HttpShiftService.instance) {
      HttpShiftService.instance = new HttpShiftService(httpClient);
    }
    return HttpShiftService.instance;
  }

  public async getShiftsByRoom(
    roomId: number,
    ipAddress: string,
  ): Promise<Shift[]> {
    const response = await this.httpClient.get<{
      data: ShiftResponse[];
    }>(`/rooms/${roomId}/shifts`, {
      headers: {
        "X-Module-Ip": ipAddress
      }
    });
    return response.data.data.map((shift) => {
      return shiftResponseToModel(
        shift
      );
    });
  }

  async createShiftWithAttentionProfile(arg0: { room_id: number; client: { dni: string; name: string; client_type_id: number; }; state: string; attention_profile_id: number; }, ipAddress: string): Promise<Shift> {

    const response = await this.httpClient.post<{ data: ShiftResponse }>("/shifts/with-attention-profile", arg0, {
      headers: {
        "X-Module-Ip": ipAddress
      }
    });
    return shiftResponseToModel(response.data.data);
  }

  async getShiftsByModule(id: number, moduleIp: string): Promise<Shift[]> {
    const response = await this.httpClient.get<{
      data: ShiftResponse[];
    }>(`/rooms/${id}/shifts`, {
      headers: {
        "X-Module-Ip": moduleIp
      }
    });
    return response.data.data.map((shift) => {
      return shiftResponseToModel(shift)
    });
  }
  async getDistractedShiftsByModule(id: number, moduleIp: string): Promise<Shift[]> {
    const response = await this.httpClient.get<{
      data: ShiftResponse[];
    }>(`/rooms/${id}/shifts/distracted`, {
      headers: {
        'X-Module-Ip': moduleIp
      }
    });
    return response.data.data.map((shift) => {
      return shiftResponseToModel(shift)
    });
  }

  async getShifts(
    moduleIp: string,
  ): Promise<Shift[]> {
    const response = await this.httpClient.get<{
      data: ShiftResponse[];
    }>(`/modules/shifts`, {
      headers: {
        "X-Module-Ip": moduleIp
      }
    });
    const shifts = response.data.data.map((shift) => {
      return shiftResponseToModel(shift);
    });
    return shifts;
  }

  async getDistractedShifts(
    roomId: number,
    attentionProfileId: number,
    moduleIp: string,
  ): Promise<Shift[]> {
    const response = await this.httpClient.get<{
      data: ShiftResponse[];
    }>(
      `/rooms/${roomId}/attention_profiles/${attentionProfileId}/shifts/distracted`, {
      headers: {
        "X-Module-Ip": moduleIp
      }
    }
    );
    const shifts = response.data.data.map((shift) => {
      return shiftResponseToModel(shift)
    });
    return shifts;
  }

  async completeShift(shiftId: number, moduleIp: string): Promise<Shift> {
    const res = await this.httpClient.put<{
      data: ShiftResponse;
    }>(`/shifts/${shiftId}/completed`, {}, {
      headers: {
        "X-Module-Ip": moduleIp
      }
    });

    return shiftResponseToModel(res.data.data)
  }

  async sendToDistracted(shiftId: number, moduleIp: string): Promise<Shift> {
    const res = await this.httpClient.put<{
      data: ShiftResponse;
    }>(`/shifts/${shiftId}/distracted`, {}, {
      headers: {
        "X-Module-Ip": moduleIp
      }
    });

    return shiftResponseToModel(res.data.data)
  }

  async qualifiedShift(shiftId: number, qualification: number, moduleIp: string): Promise<Shift> {
    const res = await this.httpClient.put<{
      data: ShiftResponse;
    }>(`/shifts/${shiftId}/qualified`, { qualification }, {
      headers: {
        "X-Module-Ip": moduleIp
      }
    });

    return shiftResponseToModel(res.data.data);
  }

  async transferredShift(
    shiftId: number,
    qualification: number,
    attentionProfileId: number,
    moduleIp: string
  ): Promise<Shift> {
    const res = await this.httpClient.put<{
      data: ShiftResponse;
    }>(`/shifts/${shiftId}/transfer`, {
      qualification,
      attention_profile_id: attentionProfileId,
    }, {
      headers: {
        "X-Module-Ip": moduleIp
      }
    });

    return shiftResponseToModel(res.data.data)

  }

  async callClient(shiftId: number,
    moduleIp: string
  ): Promise<Shift> {
    const res = await this.httpClient.put<{
      data: ShiftResponse;
    }>(`/shifts/${shiftId}/call`, {}, {
      headers: {
        "X-Module-Ip": moduleIp
      }
    });

    return shiftResponseToModel(res.data.data)
  }

  async sendToWaiting(shiftId: number, moduleIp: string): Promise<Shift> {
    const res = await this.httpClient.put<{
      data: ShiftResponse;
    }>(`/shifts/${shiftId}/pending`, {}, {
      headers: {
        "X-Module-Ip": moduleIp
      }
    });

    return shiftResponseToModel(res.data.data)
  }

  async attendClient(shiftId: number, moduleId: number, moduleIp: string): Promise<Shift> {
    const res = await this.httpClient.put<{
      data: ShiftResponse;
    }>(`/shifts/${shiftId}/in-progress`, {
      module_id: moduleId,
    }, {
      headers: {
        "X-Module-Ip": moduleIp,
      }
    });

    return shiftResponseToModel(res.data.data)
  }

  public async createShift(request: CreateShiftRequest, moduleIp: string): Promise<Shift> {
    const response = await this.httpClient.post<{
      data: ShiftResponse;
    }>("/shifts", request, {
      headers: {
        "X-Module-Ip": moduleIp
      }
    });
    return shiftResponseToModel(response.data.data)
  }

  async getMyCurrentShift(moduleIp: string): Promise<Shift | undefined> {
    const response = await this.httpClient.get<{
      data: ShiftResponse | null;
    }>(`/modules/shifts/current`, {
      headers: {
        "X-Module-Ip": moduleIp
      }
    });
    const shift = response.data.data;
    if (!shift) {
      return undefined;
    }
    return shiftResponseToModel(
      shift
    )

  }

  public async deleteShift(id: number, ipAddress: string): Promise<void> {
    await this.httpClient.delete(`/shifts/${id}`, {
      headers: {
        "X-Module-Ip": ipAddress
      }
    });
  }
}

const useHttpShiftService = () => {
  const httpClient = useHttpClient();
  return HttpShiftService.getInstance(httpClient);
};

export default useHttpShiftService;
