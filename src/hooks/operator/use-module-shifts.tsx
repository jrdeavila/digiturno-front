import { createContext, useContext, useEffect, useState } from "react";
import { AttentionProfile } from "./use-http-attention-profile-service";
import useHttpShiftService, {
  Shift,
  ShiftResponse,
  shiftResponseToModel,
} from "./use-http-shifts-service";
import useEcho from "./use-echo";
import useMyModule from "../use-my-module";
import { toast } from "react-toastify";
import styled, { keyframes } from "styled-components";
import WaitingClientQualification from "@/components/WaitingClientQualification";
import TransferShift from "@/components/TransferShift";
import { Service } from "./use-http-service-service";
import useAsync from "../use-async";

interface ModuleShiftCtxProps {
  shifts: Shift[];
  currentShift?: Shift;
  distractedShifts: Shift[];
  sendToDistracted: (shift: Shift) => Promise<void>;
  sendToWaiting: (shift: Shift) => Promise<void>;
  callClient: (shift: Shift) => Promise<void>;
  attendClient: (shift: Shift) => Promise<void>;
  completeShift: (shift: Shift) => Promise<void>;
  transferShift: (
    shift: Shift,
    qualification: number,
    attentionProfile: AttentionProfile
  ) => Promise<void>;
  qualifyShift: (shift: Shift, qualification: number) => Promise<void>;
  cancelTransfer: () => void;
  onTransfer: () => void;
  setServices?: (services: Service[]) => void;
  services: Service[];
  moveToUpShift: (shift: Shift) => void;
}

const ModuleShiftContext = createContext<ModuleShiftCtxProps>({
  shifts: [],
  distractedShifts: [],
  sendToDistracted: async () => { },
  sendToWaiting: async () => { },
  callClient: async () => { },
  attendClient: async () => { },
  completeShift: async () => { },
  transferShift: async () => { },
  qualifyShift: async () => { },
  cancelTransfer: () => { },
  moveToUpShift: async () => { },
  onTransfer: () => { },
  services: [],
});

export const ModuleShiftProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [currentShift, setCurrentShift] = useState<Shift | undefined>();
  const [distractedShifts, setDistractedShifts] = useState<Shift[]>([]);
  const [onQualifying, setOnQualifying] = useState(false);
  const [onTransferring, setOnTransferring] = useState(false);
  const [services, setServices] = useState<Service[]>([]);

  // ==============================================================================

  const echo = useEcho();
  const shiftService = useHttpShiftService();

  // ==============================================================================

  const { myModule } = useMyModule();

  // ==============================================================================

  useEffect(() => {
    const orderByPreferential = (prevShifts: Shift[], shift: Shift) => {
      if (prevShifts.find((s) => s.id === shift.id)) {
        return prevShifts;
      }
      if (shift.client.clientType === "preferential") {
        const preferential = prevShifts.filter(
          (s) => s.client.clientType === "preferential"
        );
        const normals = prevShifts.filter(
          (s) => s.client.clientType !== "preferential"
        );
        return [...preferential, shift, ...normals];
      } else {
        return [...prevShifts, shift];
      }
    };

    if (!myModule) return;

    const roomShiftChannelName = `rooms.${myModule?.room.id}.attention_profiles.${myModule?.attentionProfileId}.shifts`;
    // const roomShiftChannelName = `modules.${myModule?.id}.shifts`;
    const myCurrentShiftChannelName = `modules.${myModule?.id}.current-shift`;

    // ======================================== ROOM CHANNEL ========================================
    // ======================================== ONLY DISTRACTED ========================================

    echo
      .channel(roomShiftChannelName)
      .listen(".shift.distracted", (data: { shift: ShiftResponse }) => {
        const shift = shiftResponseToModel(data.shift);
        setDistractedShifts((prevShifts) => {
          if (!prevShifts.find((s) => s.id === shift.id)) {
            return [shift, ...prevShifts];
          }
          return prevShifts;
        });

        setShifts((prevShifts) => prevShifts.filter((s) => s.id !== shift.id));
      });

    echo
      .channel(roomShiftChannelName)
      .listen(".shift.pending", (data: { shift: ShiftResponse }) => {
        const shift = shiftResponseToModel(data.shift);
        setDistractedShifts((prevShifts) =>
          prevShifts.filter((s) => s.id !== shift.id)
        );
      });

    echo
      .channel(roomShiftChannelName)
      .listen(".shift.deleted", (data: { shift: ShiftResponse }) => {
        setDistractedShifts((prevShifts) =>
          prevShifts.filter((shift) => shift.id !== data.shift.id)
        );
      });

    // ======================================== MODULE CHANNEL ========================================

    echo
      .channel(roomShiftChannelName)
      .listen(".shift.created", (event: { shift: ShiftResponse }) => {
        const newShift = shiftResponseToModel(event.shift);
        setShifts((prevShifts) => orderByPreferential(prevShifts, newShift));
        setServices([]);
      });

    echo
      .channel(roomShiftChannelName)
      .listen(".shift.distracted", (data: { shift: ShiftResponse }) => {
        const shift = shiftResponseToModel(data.shift);
        if (currentShift?.id === shift.id) {
          setCurrentShift(undefined);
        }
        setShifts((prevShifts) => prevShifts.filter((s) => s.id !== shift.id));
      });

    echo
      .channel(roomShiftChannelName)
      .listen(".shift.pending", (data: { shift: ShiftResponse }) => {
        const shift = shiftResponseToModel(data.shift);
        setShifts((prevShifts) => orderByPreferential(prevShifts, shift));
      });

    echo
      .channel(roomShiftChannelName)
      .listen(".shift.transferred", (data: { shift: ShiftResponse }) => {
        setShifts((prevShifts) =>
          prevShifts.filter((s) => s.id !== data.shift.id)
        );
      });
    echo
      .channel(roomShiftChannelName)
      .listen(".shift.qualified", (data: { shift: ShiftResponse }) => {
        setShifts((prevShifts) =>
          prevShifts.filter((shift) => shift.id !== data.shift.id)
        );
      });

    echo
      .channel(roomShiftChannelName)
      .listen(".shift.in-progress", (data: { shift: ShiftResponse }) => {
        setShifts((prevShifts) =>
          prevShifts.filter((shift) => shift.id !== data.shift.id)
        );
      });
    echo
      .channel(roomShiftChannelName)
      .listen(".shift.deleted", (data: { shift: ShiftResponse }) => {
        setShifts((prevShifts) =>
          prevShifts.filter((shift) => shift.id !== data.shift.id)
        );
      });

    // ======================================== CURRENT SHIFT CHANNEL ========================================

    echo
      .channel(myCurrentShiftChannelName)
      .listen(".shift.in-progress", (data: { shift: ShiftResponse }) => {
        const shift = shiftResponseToModel(data.shift);
        setCurrentShift(shift);
      });
    echo
      .channel(myCurrentShiftChannelName)
      .listen(".shift.completed", (data: { shift: ShiftResponse }) => {
        const shift = shiftResponseToModel(data.shift);
        setCurrentShift(shift);
      });

    echo.channel(myCurrentShiftChannelName).listen(".shift.qualified", () => {
      setCurrentShift(undefined);
      toast("El cliente ha calificado su atención");
    });
    echo.channel(myCurrentShiftChannelName).listen(".shift.transferred", () => {
      setCurrentShift(undefined);
      toast("El cliente ha transferido su turno");
    });
    echo.channel(myCurrentShiftChannelName).listen(".shift.deleted", () => {
      setCurrentShift(undefined);
    });

    return () => {
      echo.leave(roomShiftChannelName);
      echo.leave(myCurrentShiftChannelName);
    };
  }, [myModule]);

  // ==============================================================================

  useEffect(() => {
    if (currentShift?.state == "completed") {
      setOnQualifying(true);
    }
  }, [currentShift]);

  useEffect(() => {
    if (shifts.length === 0) {
      document.title = "DIGITURNO";
    }
    else {
      document.title = `(${shifts.length}) Turnos - DIGITURNO`;
    }
  }, [shifts])


  useAsync<Shift[]>(
    async () => {
      if (!myModule) return [];
      return shiftService.getShifts(myModule!.ipAddress);
    },
    (shifts) => {
      setShifts(shifts);
    },
    (error) => {
      console.error(error);
    },
    () => { },
    [myModule]
  );

  useAsync<Shift | undefined>(
    async () => {
      if (!myModule) return undefined;
      return shiftService.getMyCurrentShift(myModule!.ipAddress);
    },
    (shift) => {
      setCurrentShift(shift);
    },
    (error) => {
      console.log(error);
    },
    () => { },
    [myModule]
  );

  useAsync<Shift[]>(
    async () => {
      if (!myModule) return [];
      return shiftService.getDistractedShifts(
        myModule!.room.id,
        myModule!.moduleTypeId,
        myModule!.ipAddress
      );
    },
    (shifts) => {
      setDistractedShifts(shifts);
    },
    (error) => {
      console.error(error);
    },
    () => { },
    [myModule]
  );

  // ==============================================================================

  const sendToDistracted = async (shift: Shift) => {
    await shiftService.sendToDistracted(shift.id, myModule!.ipAddress);
    toast("Cliente enviado a distraídos");
  };

  const sendToWaiting = async (shift: Shift) => {
    await shiftService.sendToWaiting(shift.id, myModule!.ipAddress);
    toast("Cliente enviado a lista de espera");
  };

  const callClient = async (shift: Shift) => {
    await shiftService.callClient(shift.id, myModule!.ipAddress);
    setServices([]);
    toast("Cliente llamado");
  };

  const attendClient = async (shift: Shift) => {
    if (!myModule) return;
    await shiftService.attendClient(
      shift.id,
      myModule!.id,
      myModule!.ipAddress
    );
    setServices([]);
  };

  const completeShift = async (shift: Shift) => {
    if (services.length === 0) {
      toast("Debe seleccionar al menos un servicio", { type: "error" });
      return;
    }
    await shiftService.completeShift(shift.id, myModule!.ipAddress, services);
    setServices([]);
  };

  const onTransfer = async () => {
    if (services.length === 0) {
      toast("Debe seleccionar al menos un servicio", { type: "error" });
      return;
    }
    setOnTransferring(true);
  };

  const cancelTransfer = async () => {
    setOnTransferring(false);
    setServices([]);
  };

  const transferShift = async (
    shift: Shift,
    qualification: number,
    attentionProfile: AttentionProfile
  ) => {
    await shiftService.transferredShift(
      shift.id,
      qualification,
      attentionProfile.id,
      myModule!.ipAddress
    );
    setOnTransferring(false);
    setServices([]);
    toast("Turno transferido");
  };

  const qualifyShift = async (shift: Shift, qualification: number) => {
    await shiftService.qualifiedShift(
      shift.id,
      qualification,
      myModule!.ipAddress
    );
    setOnQualifying(false);
    setServices([]);
  };

  const moveToUpShift = async (shift: Shift) => {
    const shiftIndex = shifts.findIndex((s) => s.id === shift.id);
    if (shiftIndex === 0) return;
    // Move the shift to the previous index
    const newShifts = [...shifts];
    const temp = newShifts[shiftIndex];
    newShifts[shiftIndex] = newShifts[shiftIndex - 1];
    newShifts[shiftIndex - 1] = temp;
    setShifts(newShifts);
  };

  // ==============================================================================

  return (
    <ModuleShiftContext.Provider
      value={{
        shifts,
        currentShift,
        distractedShifts,
        sendToDistracted,
        sendToWaiting,
        callClient,
        attendClient,
        completeShift,
        transferShift,
        qualifyShift,
        cancelTransfer,
        onTransfer,
        setServices: (services) => setServices(services),
        services,
        moveToUpShift,
      }}
    >
      {children}
      {onQualifying && <WaitingQualificationModal />}
      {onTransferring && <TransferShiftModal />}
    </ModuleShiftContext.Provider>
  );
};

const TransferShiftModal: React.FC = () => {
  const { cancelTransfer, transferShift, currentShift } = useModuleShifts();
  const [attentionProfile, setAttentionProfile] =
    useState<AttentionProfile | null>(null);
  return (
    <ModalContainer>
      {attentionProfile ? (
        <WaitingClientQualification
          onQualified={async (qualification) => {
            await transferShift(currentShift!, qualification, attentionProfile);
          }}
          onError={() => {
            cancelTransfer();
          }}
        />
      ) : (
        <TransferShift
          onCancel={cancelTransfer}
          onTransfer={(attentionProfile) => {
            setAttentionProfile(attentionProfile);
          }}
        />
      )}
    </ModalContainer>
  );
};

const WaitingQualificationModal: React.FC = () => {
  const { currentShift, qualifyShift } = useModuleShifts();
  return (
    <ModalContainer>
      <WaitingClientQualification
        onQualified={async (qualification) => {
          qualifyShift(currentShift!, qualification);
        }}
      />
    </ModalContainer>
  );
};

const transitionKeyframes = keyframes`
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ModalContainer = styled.div`
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.5);

  #waiting-qualification-card {
    animation: ${transitionKeyframes} 0.3s;
  }
`;

export default function useModuleShifts() {
  const context = useContext(ModuleShiftContext);
  if (!context) {
    throw new Error(
      "useModuleShifts must be used within a ModuleShiftProvider"
    );
  }
  return context;
}
