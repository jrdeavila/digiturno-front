import useAsync from "@/hooks/use-async";
import useClientService from "@/hooks/use-client-service";
import Client from "@/models/client";
import ClientType from "@/models/client-type";
import { createContext, useContext, useState } from "react";

const ClientContext = createContext<{
  clients: Client[];
  loading: boolean;
  currentClient: Client | undefined;
  setCurrentClient: (client: Client | undefined) => void;
  createClient: (client: Client, clientType: ClientType) => Promise<Client>;
  updateClient: (client: Client, clientType: ClientType) => Promise<Client>;
  deleteClient: (id: number) => Promise<void>;
  forceDeleteClient: (id: number) => Promise<void>;
  restoreClient: (id: number) => Promise<void>;
  refreshClients: () => Promise<void>;
  addClient: (client: Client) => void;
  findClient: (dni: string) => Promise<Client | undefined>;
}>({
  clients: [],
  currentClient: undefined,
  loading: false,
  createClient: async () => Client.empty(),
  updateClient: async () => Client.empty(),
  setCurrentClient: () => { },
  deleteClient: async () => { },
  forceDeleteClient: async () => { },
  restoreClient: async () => { },
  refreshClients: async () => { },
  addClient: () => { },
  findClient: async () => Client.empty(),
});

export const useClientResource = () => {
  const clientResource = useContext(ClientContext);
  if (!clientResource) {
    throw new Error("Client resource is not available");
  }
  return clientResource;
};

const ClientProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const clientService = useClientService();
  const [clients, setClients] = useState<Client[]>([]);
  const [editingClient, setEditingClient] = useState<Client | undefined>(
    undefined
  );

  // ==============================================================================

  useAsync<Client[]>(
    () => {
      return clientService.getClients();
    },
    (data) => setClients(data),
    (error) => console.error(error),
    undefined,
    []
  );

  // ==============================================================================

  const createClient = async (client: Client, clientType: ClientType) => {
    setEditingClient(undefined);
    const createdClient = await clientService.createClient(client, clientType);
    setClients([
      createdClient,
      ...clients.filter((c) => c.id !== createdClient.id),
    ]);
    return createdClient;
  };

  // ==============================================================================

  const updateClient = async (client: Client, clientType: ClientType) => {
    const updatedClient = await clientService.updateClient(client, clientType);
    setClients(
      clients.map((c) => (c.id === updatedClient.id ? updatedClient : c))
    );
    return updatedClient;
  };

  // ==============================================================================

  const deleteClient = async (id: number) => {
    await clientService.deleteClient(id);
    setClients(
      clients.map((c) => (c.id === id ? { ...c, isDeleted: true } : c))
    );
  };

  // ==============================================================================

  const forceDeleteClient = async (id: number) => {
    await clientService.forceDeleteClient(id);
    setClients(clients.filter((c) => c.id !== id));
  };

  // ==============================================================================

  const restoreClient = async (id: number) => {
    await clientService.restoreClient(id);
    setClients(
      clients.map((c) => (c.id === id ? { ...c, isDeleted: false } : c))
    );
  };

  // ==============================================================================

  const refreshClients = async () => {
    const clients = await clientService.getClients();
    setClients(clients);
  };

  // ==============================================================================

  const setCurrentClient = (client: Client | undefined) => {
    setEditingClient(client);
  };

  // ==============================================================================

  const addClient = (client: Client) => {
    setClients([client, ...clients]);
  };

  // ==============================================================================

  const findClient = async (dni: string) => {
    const client = await clientService.findClient(dni);
    if (client) {
      setClients([client, ...clients]);
    }
    return client;
  }

  // ==============================================================================

  return (
    <ClientContext.Provider
      value={{
        clients,
        currentClient: editingClient,
        loading: false,
        createClient,
        updateClient,
        deleteClient,
        forceDeleteClient,
        restoreClient,
        setCurrentClient,
        refreshClients,
        addClient,
        findClient,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export default ClientProvider;
