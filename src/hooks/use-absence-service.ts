import HttpAbsenceService from "@/services/absence-service";
import useHttpClient from "./operator/use-http-client";

export default function useAbsenceService() {
  const httpClient = useHttpClient();
  return HttpAbsenceService.getInstance(httpClient);
}