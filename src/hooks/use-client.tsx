import Client from "@/models/client";
import { createContext, useContext, useEffect, useState } from "react";
import useEcho from "./operator/use-echo";
import useMyModule from "./use-my-module";
import { ClientResponse } from "@/data/client-mappings";
import useVoice from "./useVoice";

interface ClientContextProps {
  clients: Client[] | undefined;
}

const ClientContext = createContext<ClientContextProps | undefined>(undefined);

export const ScreenClientProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [clients, setClients] = useState<Client[]>([]);

  // ==============================================================================

  const echo = useEcho();
  const { myModule } = useMyModule();
  const voice = useVoice();

  // ==============================================================================

  useEffect(() => {
    const channel = `rooms.${myModule?.room.id}.clients`;
    echo
      .channel(channel)
      .listen(".client.call", (data: { client: ClientResponse }) => {
        const client = new Client(
          data.client.id,
          data.client.name,
          data.client.dni,
          data.client.client_type,
          data.client.is_deleted
        );
        voice.speak(`Cliente ${client.name}. Por favor, dirigirse al módulo 3`);
        setClients((prev) => {
          if (prev.find((c) => c.id === client.id)) {
            return prev;
          }
          return [...prev, client];
        });
      });

    return () => {
      echo.leave(channel);
    };
  }, [echo, myModule]);

  // ==============================================================================

  return (
    <ClientContext.Provider
      value={{
        clients,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export default function useClient() {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
}
