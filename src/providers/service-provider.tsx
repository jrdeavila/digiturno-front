import useAsync from "@/hooks/use-async";
import useCache from "@/hooks/use-cache";
import useServiceService from "@/hooks/use-sevice-service";
import Service from "@/models/service";
import delay from "@/utils/delay";
import { createContext, useContext, useEffect, useState } from "react";

const ServiceContext = createContext<{
  services: Service[];
  loading: boolean;
  refreshServices: () => Promise<void>;
}>({
  services: [],
  loading: false,
  refreshServices: async () => { },
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
  const cache = useCache();

  // ==============================================================================

  const refreshServices = async () => {
    setLoading(true);
    await delay(1000, () => setLoading(true), () => setLoading(false), async () => { });
    const services = await serviceService.getAll();
    cache.set("services", services);

    setServices(services);
  };

  // ==============================================================================

  useAsync<Service[]>(
    async () => {
      let services = cache.get<Service[]>("services");
      if (services) {
        return services;
      }
      services = await serviceService.getAll();
      cache.set("services", services);
      return services;
    },
    (data) => setServices(data),
    (error) => console.error(error),
    undefined,
    []
  );


  // ==============================================================================

  useEffect(() => {
    console.log("Service Provider mounted");
  }, [])


  // ==============================================================================

  return (
    <ServiceContext.Provider value={{ services, loading, refreshServices }}>
      {children}
    </ServiceContext.Provider>
  );
};

export default ServiceProvider;
