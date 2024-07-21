import { CreateClientForm } from "@/components/create-client-form";
import { timeToQualify } from "@/config/qualification";
import useMyModule, { useConfigureModule } from "@/hooks/use-my-module";
import useShiftService from "@/hooks/use-shift-service";
import Client from "@/models/client";
import Service from "@/models/service";
import { Modal, ModalContent } from "@nextui-org/modal";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CircularProgress,
  Spinner,
} from "@nextui-org/react";
import React, { useContext, useEffect, useState } from "react";
import { useClientTypeResource } from "./client-type-provider";
import { toast } from "react-toastify";

export const CreateShiftContext = React.createContext<{
  client: Client | undefined;
  services: Service[] | undefined;
  setClient: (client: Client | undefined) => void;
  setServices: (services: Service[]) => void;
  createShift: () => void;
  onCreateClient?: () => void;
  setDniSearched: (dni: string) => void;
  setQualification: (qualification: number) => void;
  startQualification: () => void;
}>({
  client: undefined,
  services: undefined,
  setClient: () => {},
  setServices: () => {},
  createShift: () => {},
  setDniSearched: () => {},
  setQualification: () => {},
  startQualification: () => {},
});

export const useCreateShift = () => useContext(CreateShiftContext);

const CreateShiftProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [client, setClient] = useState<Client | undefined>(undefined);
  const [services, setServices] = useState<Service[] | undefined>(undefined);
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [dniSearched, setDniSearched] = useState("");
  const [isQualifying, setIsQualifying] = useState(false);
  const [qualification, setQualification] = useState(0);

  const shiftService = useShiftService();

  const { info } = useMyModule();
  const { clientTypes } = useClientTypeResource();

  // ==============================================================================

  const handleStartQualification = () => {
    if (!services) {
      toast("Debe seleccionar al menos un servicio", { type: "error" });
      return;
    }
    if (services.length === 0) {
      toast("Debe seleccionar al menos un servicio", { type: "error" });
      return;
    }
    if (!client) {
      toast("Debe seleccionar un cliente", { type: "error" });
      return;
    }
    setIsQualifying(true);
  };

  const handleCreateShift = async () => {
    const shift = await shiftService.createShift({
      room_id: info!.roomId,
      client: {
        dni: client!.dni,
        name: client!.name,
        client_type_id: clientTypes.filter(
          (clientType) => clientType.name === client!.clientType
        )[0].id,
      },
      services: services!.map((service) => service.id),
      state: "pending",
    });

    await shiftService.qualifyShift(shift.id, qualification);
    toast("Turno creado exitosamente", { type: "success" });
    clearShift();
  };

  const clearShift = () => {
    setClient(undefined);
    setServices(undefined);
    setQualification(0);
    setDniSearched("");
    setIsCreatingClient(false);
  };

  const handleSetQualification = (qualification: number) => {
    setQualification(qualification);
  };

  const handleSetClient = (client: Client | undefined) => {
    setClient(client);
  };

  const handleSetServices = (services: Service[]) => {
    setServices(services);
  };

  const handleCreateClient = () => {
    setIsCreatingClient(true);
  };

  const handleSetDniSearched = (dni: string) => {
    setDniSearched(dni);
  };

  // ==============================================================================

  return (
    <CreateShiftContext.Provider
      value={{
        client,
        services,
        setClient: handleSetClient,
        setServices: handleSetServices,
        createShift: handleCreateShift,
        onCreateClient: handleCreateClient,
        setDniSearched: handleSetDniSearched,
        setQualification: handleSetQualification,
        startQualification: handleStartQualification,
      }}
    >
      {children}
      <Modal isOpen={isCreatingClient}>
        <ModalContent>
          {(onClose) => (
            <CreateClientForm
              dni={dniSearched}
              onFinished={() => {
                setIsCreatingClient(false);
                onClose();
              }}
            />
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isQualifying}
        onClose={() => {
          setIsQualifying(false);
        }}
      >
        <ModalContent>
          {(onClose) => (
            <WaitingClientQualification
              onQualified={() => {
                handleCreateShift();
                onClose();
              }}
            />
          )}
        </ModalContent>
      </Modal>
    </CreateShiftContext.Provider>
  );
};

const WaitingClientQualification: React.FC<{
  onQualified: () => void;
}> = ({ onQualified }) => {
  const {} = useConfigureModule();
  // ==============================================================================
  useEffect(() => {
    const timeout = setTimeout(() => {
      onQualified();
    }, timeToQualify);
    return () => {
      clearTimeout(timeout);
    };
  }, [onQualified]);

  // ==============================================================================

  return (
    <Card>
      <CardHeader className="flex items-center justify-center">
        <span className="text-lg font-bold">
          ESPERANDO CALIFICACIÓN DEL CLIENTE
        </span>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col gap-3 h-full">
          <Spinner label="Esperando calificación..." />
        </div>
      </CardBody>
    </Card>
  );
};

export default CreateShiftProvider;
