import ClientService from "@/services/client-service";
import useHttpClient from "./use-http-client";

const useClientService: () => ClientService = () => {
  return new ClientService(useHttpClient());
};

export default useClientService;
