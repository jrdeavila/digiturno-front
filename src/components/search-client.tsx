import Client from "@/models/client";
import { useClientResource } from "@/providers/client-provider";
import { useCreateShift } from "@/providers/create-shift-provider";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { useEffect, useState } from "react";

export default function SearchClient() {
  const { refreshClients, clients } = useClientResource();
  const [client, setClient] = useState<Client | undefined>(undefined);
  const { setClient: updateShiftClient } = useCreateShift();

  // ==============================================================================

  useEffect(() => {
    updateShiftClient(client);
  }, [client, updateShiftClient]);

  // ==============================================================================

  const handleSearch = (value: string) => {
    const foundClient = clients.find((c) => c.dni === value);
    setClient(foundClient);
  };

  // ==============================================================================

  return (
    <Card className="h-full">
      <CardHeader>
        <span className="text-lg font-bold">BUSCAR CLIENTE</span>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col gap-3">
          <Input
            label="Cédula"
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Ejemplo: 123456789"
          />

          {client ? (
            <div>
              <span className="text-gray-500">Cliente encontrado:</span>
              <h2 className="text-gray-600 text-sm">{client.name}</h2>
              <p className="text-sm text-gray-600">{client.dni}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1 justify-center items-center">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="text-red-500"
              />
              <span className="text-gray-500">Cliente no encontrado</span>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
