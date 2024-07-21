import useAsync from "@/hooks/use-async";
import useCache from "@/hooks/use-cache";
import useClientTypeService from "@/hooks/use-client-type-service";
import ClientType from "@/models/client-type";
import { createContext, useContext, useState } from "react";

const ClientTypeContext = createContext<{
  clientTypes: ClientType[];
  loading: boolean;
  refreshClientTypes: () => void;
}>({
  clientTypes: [],
  loading: false,
  refreshClientTypes: () => {},
});

export const useClientTypeResource = () => {
  return useContext(ClientTypeContext);
};

const ClientTypeProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const clientTypeService = useClientTypeService();
  const cache = useCache();
  const [clientTypes, setClientTypes] = useState<ClientType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // =================================================================

  useAsync<ClientType[]>(
    async () => {
      let types = cache.get<ClientType[]>("client_types");
      if (types) {
        return types;
      }
      types = await clientTypeService.getAll();
      cache.set("client_types", types);
      return types;
    },
    (data) => {
      setClientTypes(data);
    },
    (error) => {
      console.error(error);
    },
    undefined,
    []
  );

  // =================================================================

  const refreshClientTypes = async () => {
    setLoading(true);
    try {
      const data = await clientTypeService.getAll();
      cache.set("client_types", data);
      setClientTypes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // =================================================================

  return (
    <ClientTypeContext.Provider
      value={{
        clientTypes,
        loading,
        refreshClientTypes: refreshClientTypes,
      }}
    >
      {children}
    </ClientTypeContext.Provider>
  );
};

export default ClientTypeProvider;
