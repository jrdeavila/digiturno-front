import HttpAttendantService from "@/services/attendant-service";
import useHttpClient from "./operator/use-http-client";

export default function useAttendantService() {
  const httpClient = useHttpClient();
  return HttpAttendantService.getInstance(httpClient);
}
