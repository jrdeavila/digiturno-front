import { AxiosInstance } from "axios";

interface SectionalResponse {
  id: number;
  name: string;
}

export class Sectional {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

class HttpSectionalService {
  private static instance: HttpSectionalService;
  private httpClient: AxiosInstance;

  private constructor(httpClient: AxiosInstance) {
    this.httpClient = httpClient;
  }

  static getInstance(httpClient: AxiosInstance) {
    if (!HttpSectionalService.instance) {
      HttpSectionalService.instance = new HttpSectionalService(httpClient);
    }
    return HttpSectionalService.instance;
  }

  async getSectionals(): Promise<Sectional[]> {
    const response = await this.httpClient.get<{
      data: SectionalResponse[];
    }>("/branches");
    return response.data.data.map(
      (sectional) => new Sectional(sectional.id, sectional.name)
    );
  }
}

export default HttpSectionalService;
