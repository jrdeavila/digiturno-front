import Client from "@/models/client";
import { useClientResource } from "@/providers/client-provider";
import { useCreateShift } from "@/providers/create-shift-provider";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function SearchClient() {
  const { clients } = useClientResource();
  const [client, setClient] = useState<Client | undefined>(undefined);
  const [isSearching, setIsSearching] = useState(true);
  const [firstSearch, setFirstSearch] = useState(true);
  const { setClient: updateShiftClient, setDniSearched } = useCreateShift();

  // ==============================================================================

  useEffect(() => {
    updateShiftClient(client);
  }, [client, updateShiftClient]);

  // ==============================================================================

  const handleSearch = (value: string) => {
    setFirstSearch(value.length === 0);
    if (value.length >= 8) {
      const foundClient = clients.find((c) => c.dni === value);
      setClient(foundClient);
      setIsSearching(false);
      setDniSearched(value);
    } else {
      setIsSearching(true);
    }
  };

  // ==============================================================================

  return (
    <Card className="h-full">
      <CardHeader>
        <span className="text-lg font-bold">BUSCAR CLIENTE</span>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col gap-3 h-full">
          <Input
            label="Cédula"
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Ejemplo: 123456789"
          />

          {client ? (
            <div className="bg-gray-100 rounded-lg px-3 py-2 w-full">
              <span className="text-gray-500">Cliente encontrado:</span>
              <p className="text-sm text-gray-600 text-ellipsis font-bold">
                {client.name}
              </p>
              <div className="flex flex-row items-center w-full">
                <span className="text-sm font-bold">Cédula:</span>
                <p className="text-sm text-gray-600">{client.dni}</p>
              </div>
              <div className="flex flex-row items-center w-full">
                <span className="text-sm font-bold">Tipo:</span>
                <p className="text-sm text-gray-600">{
                  {
                    preferential: "Preferencial",
                    processor: "Tramitador",
                    standard: "Estándar",
                  }[client.clientType]
                }</p>
              </div>
            </div>
          ) : firstSearch ? undefined : isSearching ? (
            <div className="flex flex-col gap-1 justify-center items-center h-full">
              <Spinner label="Buscando cliente..." />
            </div>
          ) : (
            <div className="flex flex-col gap-1 justify-center items-center h-full">
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
