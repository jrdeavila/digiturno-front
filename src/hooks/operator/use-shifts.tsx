import WaitingClientQualification from "@/components/WaitingClientQualification";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled, { keyframes } from "styled-components";
import useAsync from "../use-async";
import useMyModule from "../use-my-module";
import useEcho from "./use-echo";
import useHttpShiftService, { Shift } from "./use-http-shifts-service";

interface ShiftCtxProps {
  shifts: Shift[];
  distractedShifts: Shift[];
  currentShift?: Shift;
  sendToDistracted: (shift: Shift) => Promise<void>;
  sendToWaiting: (shift: Shift) => Promise<void>;
  callClient: (shift: Shift) => Promise<void>;
  attendClient: (shift: Shift) => Promise<void>;
  completeShift: (shift: Shift) => Promise<void>;
  transferShift: (shift: Shift) => Promise<void>;
  qualifyShift: (shift: Shift, qualification: number) => Promise<void>;
}

const ShiftContext = createContext<ShiftCtxProps | undefined>(undefined);

export const ShiftProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [distractedShifts, setDistractedShifts] = useState<Shift[]>([]);
  const [currentShift, setCurrentShift] = useState<Shift | undefined>();
  const [onQualifying, setOnQualifying] = useState(false);

  // ==================================================================

  const echo = useEcho();
  const { myModule } = useMyModule();
  const shiftService = useHttpShiftService();
  // ==================================================================

  useEffect(() => {
    echo.connect();
    if (!myModule) return;
    const shiftChannelName = `rooms.${myModule?.room.id}.attention_profiles.${myModule?.attentionProfileId}.shifts`;
    const myCurrentShiftChannelName = `modules.${myModule?.id}.current-shift`;
    echo
      .channel(shiftChannelName)
      .listen(".shift.created", (data: { shift: Shift }) => {
        setShifts((prevShifts) => [...prevShifts, data.shift]);
      });
    echo
      .channel(shiftChannelName)
      .listen(".shift.distracted", (data: { shift: Shift }) => {
        setDistractedShifts((prevShifts) => {
          if (!prevShifts.find((shift) => shift.id === data.shift.id)) {
            return [data.shift, ...prevShifts];
          }
          return prevShifts;
        });
        setShifts((prevShifts) =>
          prevShifts.filter((shift) => shift.id !== data.shift.id)
        );
      });
    echo
      .channel(shiftChannelName)
      .listen(".shift.pending", (data: { shift: Shift }) => {
        setShifts((prevShifts) => {
          if (!prevShifts.find((shift) => shift.id === data.shift.id)) {
            return [data.shift, ...prevShifts];
          }
          return prevShifts;
        });
        setDistractedShifts((prevShifts) =>
          prevShifts.filter((shift) => shift.id !== data.shift.id)
        );
      });
    echo
      .channel(shiftChannelName)
      .listen(".shift.pending-transferred", (data: { shift: Shift }) => {
        setShifts((prevShifts) => {
          if (!prevShifts.find((shift) => shift.id === data.shift.id)) {
            return [data.shift, ...prevShifts];
          }
          return prevShifts;
        });
      });
    echo
      .channel(shiftChannelName)
      .listen(".shift.transferred", (data: { shift: Shift }) => {
        setShifts((prevShifts) =>
          prevShifts.filter((shift) => shift.id !== data.shift.id)
        );
      });
    echo
      .channel(shiftChannelName)
      .listen(".shift.qualified", (data: { shift: Shift }) => {
        setShifts((prevShifts) =>
          prevShifts.filter((shift) => shift.id !== data.shift.id)
        );
      });
    echo
      .channel(shiftChannelName)
      .listen(".shift.in-progress", (data: { shift: Shift }) => {
        setShifts((prevShifts) =>
          prevShifts.filter((shift) => shift.id !== data.shift.id)
        );
      });
    echo
      .channel(myCurrentShiftChannelName)
      .listen(".shift.in-progress", (data: { shift: Shift }) => {
        setCurrentShift(data.shift);
      });
    echo
      .channel(myCurrentShiftChannelName)
      .listen(".shift.completed", (data: { shift: Shift }) => {
        setCurrentShift(data.shift);
      });
    echo.channel(myCurrentShiftChannelName).listen(".shift.qualified", () => {
      setCurrentShift(undefined);
      toast("El cliente ha calificado su atención");
    });
    return () => {
      echo.leave(shiftChannelName);
      echo.leave(myCurrentShiftChannelName);
    };
  }, [myModule]);

  useAsync<Shift[]>(
    async () => {
      if (!myModule) return [];
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
      return shiftService.getDistractedShifts(
        myModule!.room.id,
        myModule!.attentionProfileId
      );
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

  const transferShift = async (shift: Shift) => {
    setOnQualifying(false);
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
        qualifyShift,
      }}
    >
      {children}
      {onQualifying && <WaitingQualificationModal />}
    </ShiftContext.Provider>
  );
};

const WaitingQualificationModal: React.FC = () => {
  const { currentShift, qualifyShift } = useShifts();
  return (
    <WaitingQualificationModalContainer>
      <WaitingClientQualification
        onQualified={(qualification) => {
          qualifyShift(currentShift!, qualification);
        }}
      />
    </WaitingQualificationModalContainer>
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

const WaitingQualificationModalContainer = styled.div`
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
