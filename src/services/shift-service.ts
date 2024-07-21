import Client from "@/models/client";
import { AxiosInstance } from "axios";

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

interface ShiftResponse {
  id: number;
  room: string;
  attention_profile: string;
  client: {
    id: number;
    name: string;
    dni: string;
    client_type: string;
    is_deleted: boolean;
  };
  state: string;
  created_at: string;
  updated_at: string;
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
export default class HttpShiftService {
  private static instance: HttpShiftService;
  private httpClient: AxiosInstance;

  private constructor(httpClient: AxiosInstance) {
    this.httpClient = httpClient;
  }

  public static getInstance(httpClient: AxiosInstance): HttpShiftService {
    if (!HttpShiftService.instance) {
      HttpShiftService.instance = new HttpShiftService(httpClient);
    }

    return HttpShiftService.instance;
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

  public async qualifyShift(
    shiftId: number,
    qualification: number
  ): Promise<void> {
    await this.httpClient.put<{
      data: ShiftResponse;
    }>(`/shifts/${shiftId}/qualified`, {
      qualification,
    });
    return;
  }
}
