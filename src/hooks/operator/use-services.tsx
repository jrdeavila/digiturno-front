import { useState } from "react";
import useHttpServiceService, { Service } from "./use-http-service-service";
import useAsync from "../use-async";

interface ServiceCtxProps {
  services: Service[];
  refreshServices: () => void;
}

const useServices: () => ServiceCtxProps = () => {
  const [services, setServices] = useState<Service[]>([]);
  const serviceService = useHttpServiceService();

  // ==================================================================

  useAsync<Service[]>(
    async () => {
      return serviceService.getServices();
    },
    (data) => {
      setServices(data);
    },
    (error) => {
      console.error(error);
    },
    () => {},
    []
  );

  // ==================================================================

  const refreshServices = () => {
    serviceService.getServices().then((services) => {
      setServices(services);
    });
  };

  // ==================================================================

  return {
    services,
    refreshServices,
  };
};

export default useServices;
