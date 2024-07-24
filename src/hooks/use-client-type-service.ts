import ClientTypeService from "@/services/client-type-service";
import useHttpClient from "./operator/use-http-client";

export default function useClientTypeService() {
  return new ClientTypeService(useHttpClient());
}
