import { AxiosInstance } from "axios";

export interface RoomResponse {
  id: number;
  name: string;
  branch_id: number;
}

export class Room {
  id: number;
  name: string;
  sectionalId: number;

  constructor(id: number, name: string, sectionalId: number) {
    this.id = id;
    this.name = name;
    this.sectionalId = sectionalId;
  }
}

export default class HttpRoomService {
  private static instance: HttpRoomService;
  private httpClient: AxiosInstance;

  private constructor(httpClient: AxiosInstance) {
    this.httpClient = httpClient;
  }

  static getInstance(httpClient: AxiosInstance) {
    if (!HttpRoomService.instance) {
      HttpRoomService.instance = new HttpRoomService(httpClient);
    }
    return HttpRoomService.instance;
  }

  async getRooms(): Promise<Room[]> {
    const response = await this.httpClient.get<{
      data: RoomResponse[];
    }>("/rooms");
    return response.data.data.map(
      (room) => new Room(room.id, room.name, room.branch_id)
    );
  }
}
