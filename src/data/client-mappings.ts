import Client from "@/models/client";
import ClientType from "@/models/client-type";

export interface ClientResponse {
  id: number;
  name: string;
  dni: string;
  client_type: string;
  is_deleted: boolean;
}

export interface CreateClientRequest {
  name: string;
  dni: string;
  client_type_id: number;
}

export function mapClientToCreateClientRequest(
  client: Client,
  clientType: ClientType
): CreateClientRequest {
  return {
    name: client.name,
    dni: client.dni,
    client_type_id: clientType.id,
  };
}

export function mapClientResponseToClient(
  clientResponse: ClientResponse
): Client {
  return {
    id: clientResponse.id,
    name: clientResponse.name,
    dni: clientResponse.dni,
    clientType: clientResponse.client_type,
    isDeleted: clientResponse.is_deleted,
    moduleName: "",
  };
}
