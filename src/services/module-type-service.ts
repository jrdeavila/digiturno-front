import { AxiosInstance } from "axios";

interface ModuleTypeResponse {
  id: number;
  name: string;
  use_qualification_module: boolean;
}

export class ModuleType {
  id: number;
  name: string;
  useQualification: boolean;

  constructor(id: number, name: string, useQualification: boolean) {
    this.id = id;
    this.name = name;
    this.useQualification = useQualification;
  }
}

export default class HttpModuleTypeService {
  private static instance: HttpModuleTypeService;
  private httpClient: AxiosInstance;

  private constructor(httpClient: AxiosInstance) {
    this.httpClient = httpClient;
  }

  static getInstance(httpClient: AxiosInstance) {
    if (!HttpModuleTypeService.instance) {
      HttpModuleTypeService.instance = new HttpModuleTypeService(httpClient);
    }
    return HttpModuleTypeService.instance;
  }

  async getModuleTypes(): Promise<ModuleType[]> {
    const response = await this.httpClient.get<{
      data: ModuleTypeResponse[];
    }>("/module_types");
    return response.data.data.map(
      (moduleTypeResponse) =>
        new ModuleType(
          moduleTypeResponse.id,
          moduleTypeResponse.name,
          moduleTypeResponse.use_qualification_module
        )
    );
  }
}
