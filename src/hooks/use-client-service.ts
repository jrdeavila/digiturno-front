import ClientService from "@/services/client-service";
import useHttpClient from "./operator/use-http-client";

const useClientService: () => ClientService = () => {
  return new ClientService(useHttpClient());
};

export default useClientService;
