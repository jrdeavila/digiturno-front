import HttpSectionalService from "@/services/sectional-service";
import useHttpClient from "./operator/use-http-client";

export default function useSectionalService() {
  const httpClient = useHttpClient();
  return HttpSectionalService.getInstance(httpClient);
}
