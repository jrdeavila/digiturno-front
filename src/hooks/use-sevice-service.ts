import ServiceService from "@/services/service-service";
import useHttpClient from "./operator/use-http-client";

export default function useServiceService() {
  return new ServiceService(useHttpClient());
}
