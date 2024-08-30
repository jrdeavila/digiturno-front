import { ClientResponse } from "@/data/client-mappings";
import Client from "@/models/client";
import { createContext, useContext, useEffect, useState } from "react";
import useEcho from "./operator/use-echo";
import { ShiftResponse } from "./operator/use-http-shifts-service";
import { ModuleResponse, moduleResponseToModule } from "./use-module-service";
import useMyModule from "./use-my-module";
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
      .listen(
        ".client.call",
        (data: { client: ClientResponse; module: ModuleResponse }) => {
          const module = moduleResponseToModule(data.module);
          const client = new Client(
            data.client.id,
            data.client.name,
            data.client.dni,
            data.client.client_type,
            data.client.is_deleted,
            module.name
          );
          voice.speak(`${client.name}. modulo ${module.name}`);

          setClients((prev) => {
            if (prev.find((c) => c.id === client.id)) {
              return prev;
            }
            // Get only the last 5 clients
            return [client, ...prev].slice(0, 5);
          });
        }
      );

    echo
      .channel(`rooms.${myModule?.room.id}.shifts`)
      .listen(
        ".shift.pending-transferred",
        (data: { shift: ShiftResponse }) => {
          setClients((prev) => {
            return prev.filter((c) => c.id !== data.shift.client.id);
          });
        }
      );

    echo
      .channel(`rooms.${myModule?.room.id}.shifts`)
      .listen(".shift.pending", (data: { shift: ShiftResponse }) => {
        setClients((prev) => {
          return prev.filter((c) => c.id !== data.shift.client.id);
        });
      });

    echo
      .channel(`rooms.${myModule?.room.id}.shifts`)
      .listen(".shift.in-progress", (data: { shift: ShiftResponse }) => {
        setClients((prev) => {
          return prev.filter((c) => c.id !== data.shift.client.id);
        });
      });
    echo
      .channel(`rooms.${myModule?.room.id}.shifts`)
      .listen(".shift.deleted", (data: { shift: ShiftResponse }) => {
        setClients((prev) => {
          return prev.filter((c) => c.id !== data.shift.client.id);
        });
      });
    echo
      .channel(`rooms.${myModule?.room.id}.shifts`)
      .listen(".shift.distracted", (data: { shift: ShiftResponse }) => {
        setClients((prev) => {
          return prev.filter((c) => c.id !== data.shift.client.id);
        });
      });
    echo
      .channel(`rooms.${myModule?.room.id}.shifts`)
      .listen(".shift.qualified", (data: { shift: ShiftResponse }) => {
        setClients((prev) => {
          return prev.filter((c) => c.id !== data.shift.client.id);
        });
      });

    echo.channel(`rooms.${myModule?.room.id}.shifts`).listen(".shift.pending-transferred", (data: {
      shift: ShiftResponse
    }) => {
      setClients((prev) => {
        return prev.filter((c) => c.id !== data.shift.client.id);
      })
    });

    echo.channel(`rooms.${myModule?.room.id}.shifts`).listen(".shift.pending", (data: {
      shift: ShiftResponse
    }) => {
      setClients((prev) => {
        return prev.filter((c) => c.id !== data.shift.client.id);
      })
    });

    echo.channel(`rooms.${myModule?.room.id}.shifts`).listen(".shift.in-progress", (data: {
      shift: ShiftResponse
    }) => {
      setClients((prev) => {
        return prev.filter((c) => c.id !== data.shift.client.id);
      })
    });
    echo.channel(`rooms.${myModule?.room.id}.shifts`).listen(".shift.deleted", (data: {
      shift: ShiftResponse
    }) => {
      setClients((prev) => {
        return prev.filter((c) => c.id !== data.shift.client.id);
      })
    });
    echo.channel(`rooms.${myModule?.room.id}.shifts`).listen(".shift.distracted", (data: {
      shift: ShiftResponse
    }) => {
      setClients((prev) => {
        return prev.filter((c) => c.id !== data.shift.client.id);
      })
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
