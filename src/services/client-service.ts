import {
  ClientResponse,
  mapClientResponseToClient,
  mapClientToCreateClientRequest,
} from "@/data/client-mappings";
import Client from "@/models/client";
import ClientType from "@/models/client-type";
import { AxiosInstance } from "axios";

export default class ClientService {
  httpClient: AxiosInstance;

  constructor(httpClient: AxiosInstance) {
    this.httpClient = httpClient;
  }

  async getClients(): Promise<Client[]> {
    const response = await this.httpClient.get<{ data: ClientResponse[] }>(
      "/clients"
    );
    return response.data.data.map(mapClientResponseToClient);
  }

  async getClient(id: number): Promise<Client> {
    const response = await this.httpClient.get<{
      data: ClientResponse;
    }>(`/clients/${id}`);
    return mapClientResponseToClient(response.data.data);
  }

  async findClient(dni: string): Promise<Client | undefined> {
    const response = await this.httpClient.get<{
      data: ClientResponse;
    }>("/clients/find", {
      params: {
        dni,
      }
    });
    return response.data.data ? mapClientResponseToClient(response.data.data) : undefined;
  }


  async createClient(client: Client, clientType: ClientType): Promise<Client> {
    const request = mapClientToCreateClientRequest(client, clientType);
    const response = await this.httpClient.post<{
      data: ClientResponse;
    }>("/clients", request);
    return mapClientResponseToClient(response.data.data);
  }

  async updateClient(client: Client, clientType: ClientType): Promise<Client> {
    const request = mapClientToCreateClientRequest(client, clientType);
    const response = await this.httpClient.put<{
      data: ClientResponse;
    }>(`/clients/${client.id}`, request);
    return mapClientResponseToClient(response.data.data);
  }

  async deleteClient(id: number): Promise<void> {
    await this.httpClient.delete(`/clients/${id}`);
    return;
  }

  async forceDeleteClient(id: number): Promise<void> {
    await this.httpClient.delete(`/clients/${id}/force-delete`);
    return;
  }

  async restoreClient(id: number): Promise<void> {
    await this.httpClient.put(`/clients/${id}/restore`);
    return;
  }
}
