import ClientType from "@/models/client-type";

export interface ClientTypeResponse {
  id: number;
  name: string;
}

export function mapClientTypeResponseToClientType(
  response: ClientTypeResponse
): ClientType {
  return new ClientType(response.id, response.name);
}
