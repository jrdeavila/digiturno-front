import { CreateClientForm } from "@/components/create-client-form";
import Client from "@/models/client";
import Service from "@/models/service";
import { Modal, ModalContent } from "@nextui-org/modal";
import React, { useContext, useEffect, useState } from "react";

export const CreateShiftContext = React.createContext<{
  loading: boolean;
  error: any;
  client: Client | undefined;
  services: Service[] | undefined;
  setClient: (client: Client | undefined) => void;
  setServices: (services: Service[]) => void;
  createShift: () => void;
  onCreateClient?: () => void;
}>({
  loading: true,
  error: null,
  client: undefined,
  services: undefined,
  setClient: () => {},
  setServices: () => {},
  createShift: () => {},
});

export const useCreateShift = () => useContext(CreateShiftContext);

const CreateShiftProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [client, setClient] = useState<Client | undefined>(undefined);
  const [services, setServices] = useState<Service[] | undefined>(undefined);
  const [isCreatingClient, setIsCreatingClient] = useState(false);

  // ==============================================================================

  useEffect(() => {}, []);

  // ==============================================================================

  const handleCreateShift = () => {
    console.log("Creating shift...");
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

  // ==============================================================================

  return (
    <CreateShiftContext.Provider
      value={{
        client,
        services,
        loading,
        error,
        setClient: handleSetClient,
        setServices: handleSetServices,
        createShift: handleCreateShift,
        onCreateClient: handleCreateClient,
      }}
    >
      {children}
      {isCreatingClient && (
        <Modal isOpen={isCreatingClient}>
          <ModalContent>
            {(onClose) => (
              <CreateClientForm
                onFinished={() => {
                  setIsCreatingClient(false);
                  onClose();
                }}
              />
            )}
          </ModalContent>
        </Modal>
      )}
    </CreateShiftContext.Provider>
  );
};

export default CreateShiftProvider;
