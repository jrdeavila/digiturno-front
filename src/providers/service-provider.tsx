import useAsync from "@/hooks/use-async";
import useServiceService from "@/hooks/use-sevice-service";
import Service from "@/models/service";
import delay from "@/utils/delay";
import { createContext, useContext, useState } from "react";

const ServiceContext = createContext<{
  services: Service[];
  loading: boolean;
  refreshServices: () => Promise<void>;
}>({
  services: [],
  loading: false,
  refreshServices: async () => {},
});

export const useServiceResource = () => {
  const serviceResource = useContext(ServiceContext);
  if (!serviceResource) {
    throw new Error("Service resource is not available");
  }
  return serviceResource;
};

const ServiceProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // ==============================================================================

  const serviceService = useServiceService();

  // ==============================================================================

  const refreshServices = async () => {
    const services = await delay<Service[]>(
      2000,
      () => setLoading(true),
      () => setLoading(false),
      () => serviceService.getAll()
    );
    setServices(services);
  };

  // ==============================================================================

  useAsync<Service[]>(
    async () => {
      return await delay<Service[]>(
        2000,
        () => setLoading(true),
        () => setLoading(false),
        () => serviceService.getAll()
      );
    },
    (data) => setServices(data),
    (error) => console.error(error),
    undefined,
    []
  );

  // ==============================================================================

  return (
    <ServiceContext.Provider value={{ services, loading, refreshServices }}>
      {children}
    </ServiceContext.Provider>
  );
};

export default ServiceProvider;
