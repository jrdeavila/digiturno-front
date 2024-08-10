import { AxiosInstance } from "axios";

export class Absence {
  id: number;
  name: string;
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}


export default class HttpAbsenceService {
  private httpClient: AxiosInstance;
  private static instance: HttpAbsenceService;

  private constructor(httpClient: AxiosInstance) {
    this.httpClient = httpClient;
  }

  public static getInstance(httpClient: AxiosInstance) {
    if (!this.instance) {
      this.instance = new HttpAbsenceService(httpClient);
    }
    return this.instance;
  }

  public async getAbsences(): Promise<Absence[]> {
    const response = await this.httpClient.get<{
      data: Absence[],
    }>("/absence_reasons");
    return response.data.data;
  }

  public async createAbsence(absenceId: number, attendantId: number) {
    await this.httpClient.post(`/attendants/${attendantId}/absences`, {
      absence_reason_id: absenceId,
    },)
  }

  public async backToWork(attendantId: number) {
    await this.httpClient.put(`/attendants/${attendantId}/back-to-work`);
  }
}

