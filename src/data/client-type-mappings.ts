import ClientType from "@/models/client-type";

export interface ClientTypeResponse {
  id: number;
  name: string;
}

export function mapClientTypeResponseToClientType(
  response: ClientTypeResponse
): ClientType {
  return {
    id: response.id,
    name: response.name,
    slug: response.name.toLowerCase().replace(/\s+/g, "-")
  };
}
