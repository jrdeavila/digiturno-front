import HttpShiftService from "@/services/shift-service";
import useHttpClient from "./use-http-client";

export default function useShiftService() {
  const httpClient = useHttpClient();
  return HttpShiftService.getInstance(httpClient);
}
