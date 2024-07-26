import TransferShift from "@/components/TransferShift";
import WaitingClientQualification from "@/components/WaitingClientQualification";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled, { keyframes } from "styled-components";
import useAsync from "../use-async";
import useMyModule from "../use-my-module";
import useEcho from "./use-echo";
import { AttentionProfile } from "./use-http-attention-profile-service";
import useHttpShiftService, {
  Shift,
  ShiftResponse,
  shiftResponseToModel,
} from "./use-http-shifts-service";

interface ShiftCtxProps {
  shifts: Shift[];
  distractedShifts: Shift[];
  currentShift?: Shift;
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
}

const ShiftContext = createContext<ShiftCtxProps | undefined>(undefined);

export const ShiftProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [distractedShifts, setDistractedShifts] = useState<Shift[]>([]);
  const [currentShift, setCurrentShift] = useState<Shift | undefined>();
  const [onQualifying, setOnQualifying] = useState(false);
  const [onTransferring, setOnTransferring] = useState(false);

  // ==================================================================

  const echo = useEcho();
  const { myModule } = useMyModule();
  const shiftService = useHttpShiftService();
  // ==================================================================

  useEffect(() => {
    echo.connect();
    if (!myModule) return;

    const shiftChannelName =
      myModule.moduleTypeId === 1
        ? `rooms.${myModule?.room.id}.attention_profiles.${myModule?.attentionProfileId}.shifts`
        : `rooms.${myModule?.room.id}.shifts`;
    const myCurrentShiftChannelName = `modules.${myModule?.id}.current-shift`;
    echo
      .channel(shiftChannelName)
      .listen(".shift.created", (data: { shift: ShiftResponse }) => {
        const shift = shiftResponseToModel(data.shift);
        if (shift.state === "pending") {
          setShifts((prevShifts) => [...prevShifts, shift]);
        }
        if (shift.state === "pending-transferred") {
          setShifts((prevShifts) => [shift, ...prevShifts]);
        }
      });
    echo
      .channel(shiftChannelName)
      .listen(".shift.distracted", (data: { shift: ShiftResponse }) => {
        const shift = shiftResponseToModel(data.shift);
        setDistractedShifts((prevShifts) => {
          if (!prevShifts.find((s) => s.id === shift.id)) {
            return [shift, ...prevShifts];
          }
          return prevShifts;
        });
        setShifts((prevShifts) =>
          prevShifts.filter((shift) => shift.id !== data.shift.id)
        );
      });
    echo
      .channel(shiftChannelName)
      .listen(".shift.pending", (data: { shift: ShiftResponse }) => {
        const shift = shiftResponseToModel(data.shift);
        setShifts((prevShifts) => {
          if (!prevShifts.find((s) => s.id === shift.id)) {
            return [shift, ...prevShifts];
          }
          return prevShifts;
        });
        setDistractedShifts((prevShifts) =>
          prevShifts.filter((s) => s.id !== shift.id)
        );
      });
    echo
      .channel(shiftChannelName)
      .listen(".shift.transferred", (data: { shift: ShiftResponse }) => {
        setShifts((prevShifts) =>
          prevShifts.filter((s) => s.id !== data.shift.id)
        );
      });
    echo
      .channel(shiftChannelName)
      .listen(".shift.qualified", (data: { shift: ShiftResponse }) => {
        setShifts((prevShifts) =>
          prevShifts.filter((shift) => shift.id !== data.shift.id)
        );
      });
    echo
      .channel(shiftChannelName)
      .listen(".shift.in-progress", (data: { shift: ShiftResponse }) => {
        setShifts((prevShifts) =>
          prevShifts.filter((shift) => shift.id !== data.shift.id)
        );
      });
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
    return () => {
      echo.leave(shiftChannelName);
      echo.leave(myCurrentShiftChannelName);
    };
  }, [myModule]);

  useAsync<Shift[]>(
    async () => {
      if (!myModule) return [];
      if (myModule.moduleTypeId != 1) return [];
      return shiftService.getShifts(
        myModule!.room.id,
        myModule!.attentionProfileId
      );
    },
    (shifts) => {
      setShifts(shifts);
    },
    (error) => {
      console.error(error);
    },
    () => {},
    [myModule]
  );

  useAsync<Shift | undefined>(
    async () => {
      if (!myModule) return undefined;
      if (myModule.moduleTypeId != 1) return undefined;
      return shiftService.getMyCurrentShift(myModule!.id);
    },
    (shift) => {
      setCurrentShift(shift);
    },
    (error) => {
      console.log(error);
    },
    () => {},
    [myModule]
  );

  useAsync<Shift[]>(
    async () => {
      if (!myModule) return [];
      if (myModule.moduleTypeId == 1)
        return shiftService.getDistractedShifts(
          myModule!.room.id,
          myModule!.attentionProfileId
        );
      return shiftService.getDistractedShiftsByModule(myModule!.room.id);
    },
    (shifts) => {
      setDistractedShifts(shifts);
    },
    (error) => {
      console.error(error);
    },
    () => {},
    [myModule]
  );

  useEffect(() => {
    setOnQualifying(currentShift?.state === "completed");
  }, [currentShift]);

  // ==================================================================

  const sendToDistracted = async (shift: Shift) => {
    await shiftService.sendToDistracted(shift.id);
    toast("Cliente enviado a distraídos");
  };

  const sendToWaiting = async (shift: Shift) => {
    await shiftService.sendToWaiting(shift.id);
    toast("Cliente enviado a lista de espera");
  };

  const callClient = async (shift: Shift) => {
    await shiftService.callClient(shift.id);
    toast("Cliente llamado");
  };

  const attendClient = async (shift: Shift) => {
    if (!myModule) return;
    await shiftService.attendClient(shift.id, myModule!.id);
  };

  const completeShift = async (shift: Shift) => {
    await shiftService.completeShift(shift.id);
  };

  const onTransfer = async () => {
    setOnTransferring(true);
  };

  const cancelTransfer = async () => {
    setOnTransferring(false);
  };

  const transferShift = async (
    shift: Shift,
    qualification: number,
    attentionProfile: AttentionProfile
  ) => {
    await shiftService.transferredShift(
      shift.id,
      qualification,
      attentionProfile.id
    );
    setOnTransferring(false);
    toast("Turno transferido");
  };

  const qualifyShift = async (shift: Shift, qualification: number) => {
    await shiftService.qualifiedShift(shift.id, qualification);
    setOnQualifying(false);
  };

  // ==================================================================

  return (
    <ShiftContext.Provider
      value={{
        shifts,
        distractedShifts,
        currentShift,
        sendToDistracted,
        sendToWaiting,
        callClient,
        attendClient,
        completeShift,
        transferShift,
        cancelTransfer,
        onTransfer,
        qualifyShift,
      }}
    >
      {children}
      {onQualifying && <WaitingQualificationModal />}
      {onTransferring && <TransferShiftModal />}
    </ShiftContext.Provider>
  );
};

const TransferShiftModal: React.FC = () => {
  const { cancelTransfer, transferShift, currentShift } = useShifts();
  const [attentionProfile, setAttentionProfile] =
    useState<AttentionProfile | null>(null);
  return (
    <ModalContainer>
      {attentionProfile ? (
        <WaitingClientQualification
          onQualified={(qualification) => {
            transferShift(currentShift!, qualification, attentionProfile);
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
  const { currentShift, qualifyShift } = useShifts();
  return (
    <ModalContainer>
      <WaitingClientQualification
        onQualified={(qualification) => {
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

export default function useShifts() {
  return useContext(ShiftContext) as ShiftCtxProps;
}
