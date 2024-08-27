import {
  Attendant,
  AttendantResponse,
  attendantResponseToAttendant,
} from "@/hooks/use-authentication-service";
import { AxiosInstance } from "axios";

export default class HttpAttendantService {
  private httpClient: AxiosInstance;
  private static instance: HttpAttendantService;

  private constructor(httpClient: AxiosInstance) {
    this.httpClient = httpClient;
  }

  public static getInstance(httpClient: AxiosInstance) {
    if (!this.instance) {
      this.instance = new HttpAttendantService(httpClient);
    }
    return this.instance;
  }

  public async getAttendants(): Promise<Attendant[]> {
    const response = await this.httpClient.get<{
      data: AttendantResponse[];
    }>("/attendants");
    return response.data.data.map((attendant) => {
      return attendantResponseToAttendant(attendant);
    });
  }
}
