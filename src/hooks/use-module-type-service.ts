import HttpModuleTypeService from "@/services/module-type-service";
import useHttpClient from "./operator/use-http-client";

export default function useModuleTypeService() {
  const httpClient = useHttpClient();
  return HttpModuleTypeService.getInstance(httpClient);
}
