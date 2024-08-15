import { CreateClientForm } from "@/components/create-client-form";
import WaitingClientQualification from "@/components/WaitingClientQualification";
import useHttpShiftService from "@/hooks/operator/use-http-shifts-service";
import useMyModule from "@/hooks/use-my-module";
import Client from "@/models/client";
import Service from "@/models/service";
import { Modal, ModalContent } from "@nextui-org/modal";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useClientTypeResource } from "./client-type-provider";
import AttentionProfile from "@/models/attention-profile";
import { useClientResource } from "./client-provider";

export const CreateShiftContext = React.createContext<{
  client: Client | undefined;
  services: Service[] | undefined;
  setClient: (client: Client | undefined) => void;
  setServices: (services: Service[]) => void;
  createShift: () => void;
  onCreateClient?: () => void;
  setDniSearched: (dni: string) => void;
  setQualification: (qualification: number) => void;
  setAttentionProfile: (attentionProfile: AttentionProfile) => void;
  createShiftWithAttentionProfile: () => void;
  startQualification: () => void;
}>({
  client: undefined,
  services: undefined,
  setClient: () => { },
  setServices: () => { },
  createShift: () => { },
  setDniSearched: () => { },
  setQualification: () => { },
  startQualification: () => { },
  setAttentionProfile: () => { },
  createShiftWithAttentionProfile: () => { },
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
  const [attentionProfile, setAttentionProfile] = useState<AttentionProfile | undefined>(undefined);

  const shiftService = useHttpShiftService();

  const { myModule } = useMyModule();
  const { clientTypes } = useClientTypeResource();
  const { refreshClients } = useClientResource();

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

  const handleCreateShiftWithAttentionProfile = async () => {
    if (attentionProfile === undefined) {
      toast("Debe seleccionar un perfil de atención", { type: "error" });
      return;
    }

    if (!client) {
      toast("Debe seleccionar un cliente", { type: "error" });
      return;
    }


    await shiftService.createShiftWithAttentionProfile({
      room_id: myModule!.room.id,
      client: {
        dni: client!.dni,
        name: client!.name,
        client_type_id: clientTypes.filter(
          (clientType) => clientType.slug === client!.clientType
        )[0].id,
      },
      attention_profile_id: attentionProfile!.id,
      state: "pending",
    }, myModule!.ipAddress);

    toast("Turno creado exitosamente", { type: "success" });
    clearShift();
    refreshClients();
  }

  const handleCreateShift = async () => {
    if (services === undefined && services!.length == 0) {
      alert("Debe seleccionar al menos un servicio");
      return;
    }
    if (client === undefined) {
      alert("Debe seleccionar un cliente");
      return;
    }
    const shift = await shiftService.createShift({
      room_id: myModule!.room.id,
      client: {
        dni: client!.dni,
        name: client!.name,
        client_type_id: clientTypes.filter(
          (clientType) => clientType.slug === client!.clientType
        )[0].id,
      },
      services: services!.map((service) => service.id),
      state: "pending",
    }, myModule!.ipAddress);

    await shiftService.qualifiedShift(shift.id, qualification, myModule!.ipAddress);
    setServices([])
    setClient(undefined);
    toast("Turno creado exitosamente", { type: "success" });
    clearShift();
    refreshClients();
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

  const handleSetAttention = (attentionProfile: AttentionProfile) => {
    setAttentionProfile(attentionProfile);
  }

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
        setAttentionProfile: handleSetAttention,
        createShiftWithAttentionProfile: handleCreateShiftWithAttentionProfile,
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
              onQualified={(qualification: number) => {
                setQualification(qualification);
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

export default CreateShiftProvider;
