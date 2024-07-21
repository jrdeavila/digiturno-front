import ClientType from "@/models/client-type";
import { AxiosInstance } from "axios";

export default class ClientTypeService {
  httpClient: AxiosInstance;

  constructor(httpClient: AxiosInstance) {
    this.httpClient = httpClient;
  }

  async getAll(): Promise<ClientType[]> {
    const response = await this.httpClient.get<{ data: ClientType[] }>(
      "/client_types"
    );
    const clientTypes = response.data.data.map(
      (clientType) => new ClientType(clientType.id, clientType.name)
    );
    return clientTypes;
  }
}
