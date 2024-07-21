import ServiceService from "@/services/service-service";
import useHttpClient from "./use-http-client";

export default function useServiceService() {
  return new ServiceService(useHttpClient());
}
