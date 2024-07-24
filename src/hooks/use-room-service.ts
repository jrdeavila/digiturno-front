import HttpRoomService from "@/services/room-service";
import useHttpClient from "./operator/use-http-client";

export default function useRoomService() {
  const httpClient = useHttpClient();
  return HttpRoomService.getInstance(httpClient);
}
