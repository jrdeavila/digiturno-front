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
    updatedAt: string
  ) {
    this.id = id;
    this.room = room;
    this.attentionProfile = attentionProfile;
    this.client = client;
    this.state = state;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
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
    shiftResponse.updated_at
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

  async getShiftsByModule(id: number): Promise<Shift[]> {
    const response = await this.httpClient.get<{
      data: ShiftResponse[];
    }>(`/rooms/${id}/shifts`);
    return response.data.data.map((shift) => {
      const client = new Client(
        shift.client.id,
        shift.client.name,
        shift.client.dni,
        shift.client.client_type,
        shift.client.is_deleted
      );
      return new Shift(
        shift.id,
        shift.room,
        shift.attention_profile,
        client,
        shift.state,
        shift.created_at,
        shift.updated_at
      );
    });
  }
  async getDistractedShiftsByModule(id: number): Promise<Shift[]> {
    const response = await this.httpClient.get<{
      data: ShiftResponse[];
    }>(`/rooms/${id}/shifts/distracted`);
    return response.data.data.map((shift) => {
      const client = new Client(
        shift.client.id,
        shift.client.name,
        shift.client.dni,
        shift.client.client_type,
        shift.client.is_deleted
      );
      return new Shift(
        shift.id,
        shift.room,
        shift.attention_profile,
        client,
        shift.state,
        shift.created_at,
        shift.updated_at
      );
    });
  }

  async getShifts(
    roomId: number,
    attentionProfileId: number
  ): Promise<Shift[]> {
    const response = await this.httpClient.get<{
      data: ShiftResponse[];
    }>(`/rooms/${roomId}/attention_profiles/${attentionProfileId}/shifts`);
    const shifts = response.data.data.map((shift) => {
      const client = new Client(
        shift.client.id,
        shift.client.name,
        shift.client.dni,
        shift.client.client_type,
        shift.client.is_deleted
      );
      return new Shift(
        shift.id,
        shift.room,
        shift.attention_profile,
        client,
        shift.state,
        shift.created_at,
        shift.updated_at
      );
    });
    return shifts;
  }

  async getDistractedShifts(
    roomId: number,
    attentionProfileId: number
  ): Promise<Shift[]> {
    const response = await this.httpClient.get<{
      data: ShiftResponse[];
    }>(
      `/rooms/${roomId}/attention_profiles/${attentionProfileId}/shifts/distracted`
    );
    const shifts = response.data.data.map((shift) => {
      const client = new Client(
        shift.client.id,
        shift.client.name,
        shift.client.dni,
        shift.client.client_type,
        shift.client.is_deleted
      );
      return new Shift(
        shift.id,
        shift.room,
        shift.attention_profile,
        client,
        shift.state,
        shift.created_at,
        shift.updated_at
      );
    });
    return shifts;
  }

  async completeShift(shiftId: number): Promise<Shift> {
    const res = await this.httpClient.put<{
      data: ShiftResponse;
    }>(`/shifts/${shiftId}/completed`);

    return new Shift(
      res.data.data.id,
      res.data.data.room,
      res.data.data.attention_profile,
      new Client(
        res.data.data.client.id,
        res.data.data.client.name,
        res.data.data.client.dni,
        res.data.data.client.client_type,
        res.data.data.client.is_deleted
      ),
      res.data.data.state,
      res.data.data.created_at,
      res.data.data.updated_at
    );
  }

  async sendToDistracted(shiftId: number): Promise<Shift> {
    const res = await this.httpClient.put<{
      data: ShiftResponse;
    }>(`/shifts/${shiftId}/distracted`);

    return new Shift(
      res.data.data.id,
      res.data.data.room,
      res.data.data.attention_profile,
      new Client(
        res.data.data.client.id,
        res.data.data.client.name,
        res.data.data.client.dni,
        res.data.data.client.client_type,
        res.data.data.client.is_deleted
      ),
      res.data.data.state,
      res.data.data.created_at,
      res.data.data.updated_at
    );
  }

  async qualifiedShift(shiftId: number, qualification: number): Promise<Shift> {
    const res = await this.httpClient.put<{
      data: ShiftResponse;
    }>(`/shifts/${shiftId}/qualified`, { qualification });

    return new Shift(
      res.data.data.id,
      res.data.data.room,
      res.data.data.attention_profile,
      new Client(
        res.data.data.client.id,
        res.data.data.client.name,
        res.data.data.client.dni,
        res.data.data.client.client_type,
        res.data.data.client.is_deleted
      ),
      res.data.data.state,
      res.data.data.created_at,
      res.data.data.updated_at
    );
  }

  async transferredShift(
    shiftId: number,
    qualification: number,
    attentionProfileId: number
  ): Promise<Shift> {
    const res = await this.httpClient.put<{
      data: ShiftResponse;
    }>(`/shifts/${shiftId}/transfer`, {
      qualification,
      attention_profile_id: attentionProfileId,
    });

    return new Shift(
      res.data.data.id,
      res.data.data.room,
      res.data.data.attention_profile,
      new Client(
        res.data.data.client.id,
        res.data.data.client.name,
        res.data.data.client.dni,
        res.data.data.client.client_type,
        res.data.data.client.is_deleted
      ),
      res.data.data.state,
      res.data.data.created_at,
      res.data.data.updated_at
    );
  }

  async callClient(shiftId: number): Promise<Shift> {
    const res = await this.httpClient.put<{
      data: ShiftResponse;
    }>(`/shifts/${shiftId}/call`);

    return new Shift(
      res.data.data.id,
      res.data.data.room,
      res.data.data.attention_profile,
      new Client(
        res.data.data.client.id,
        res.data.data.client.name,
        res.data.data.client.dni,
        res.data.data.client.client_type,
        res.data.data.client.is_deleted
      ),
      res.data.data.state,
      res.data.data.created_at,
      res.data.data.updated_at
    );
  }

  async sendToWaiting(shiftId: number): Promise<Shift> {
    const res = await this.httpClient.put<{
      data: ShiftResponse;
    }>(`/shifts/${shiftId}/pending`);

    return new Shift(
      res.data.data.id,
      res.data.data.room,
      res.data.data.attention_profile,
      new Client(
        res.data.data.client.id,
        res.data.data.client.name,
        res.data.data.client.dni,
        res.data.data.client.client_type,
        res.data.data.client.is_deleted
      ),
      res.data.data.state,
      res.data.data.created_at,
      res.data.data.updated_at
    );
  }

  async attendClient(shiftId: number, moduleId: number): Promise<Shift> {
    const res = await this.httpClient.put<{
      data: ShiftResponse;
    }>(`/shifts/${shiftId}/in-progress`, {
      module_id: moduleId,
    });

    return new Shift(
      res.data.data.id,
      res.data.data.room,
      res.data.data.attention_profile,
      new Client(
        res.data.data.client.id,
        res.data.data.client.name,
        res.data.data.client.dni,
        res.data.data.client.client_type,
        res.data.data.client.is_deleted
      ),
      res.data.data.state,
      res.data.data.created_at,
      res.data.data.updated_at
    );
  }

  public async createShift(request: CreateShiftRequest): Promise<Shift> {
    const response = await this.httpClient.post<{
      data: ShiftResponse;
    }>("/shifts", request);
    return new Shift(
      response.data.data.id,
      response.data.data.room,
      response.data.data.attention_profile,
      new Client(
        response.data.data.client.id,
        response.data.data.client.name,
        response.data.data.client.dni,
        response.data.data.client.client_type,
        response.data.data.client.is_deleted
      ),
      response.data.data.state,
      response.data.data.created_at,
      response.data.data.updated_at
    );
  }

  async getMyCurrentShift(moduleId: number): Promise<Shift | undefined> {
    const response = await this.httpClient.get<{
      data: ShiftResponse | null;
    }>(`/modules/${moduleId}/shifts/current`);
    const shift = response.data.data;
    if (!shift) {
      return undefined;
    }
    const client = new Client(
      shift.client.id,
      shift.client.name,
      shift.client.dni,
      shift.client.client_type,
      shift.client.is_deleted
    );
    return new Shift(
      shift.id,
      shift.room,
      shift.attention_profile,
      client,
      shift.state,
      shift.created_at,
      shift.updated_at
    );
  }
}

const useHttpShiftService = () => {
  const httpClient = useHttpClient();
  return HttpShiftService.getInstance(httpClient);
};

export default useHttpShiftService;
