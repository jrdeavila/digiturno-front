import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAsync from "../use-async";
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
}

const ShiftContext = createContext<ShiftCtxProps | undefined>(undefined);

export const ShiftProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [distractedShifts, setDistractedShifts] = useState<Shift[]>([]);
  const [currentShift, setCurrentShift] = useState<Shift | undefined>();

  // ==================================================================

  const echo = useEcho();
  const shiftService = useHttpShiftService();
  // ==================================================================

  useEffect(() => {
    echo.connect();
    echo.channel("shifts").listen("ShiftCreated", (shift: Shift) => {
      setShifts((prevShifts) => [...prevShifts, shift]);
    });
    echo.channel("shifts").listen("ShiftUpdated", (shift: Shift) => {
      setShifts((prevShifts) => {
        return prevShifts.filter((s) => s !== shift);
      });
    });

    return () => {
      echo.disconnect();
    };
  }, []);

  useAsync<Shift | undefined>(
    async () => {
      return shiftService.getMyCurrentShift();
    },
    (shift) => {
      setCurrentShift(shift);
    },
    (error) => {
      console.error(error);
    },
    () => {},
    []
  );

  useAsync<Shift[]>(
    async () => {
      return shiftService.getDistractedShifts();
    },
    (shifts) => {
      setDistractedShifts(shifts);
    },
    (error) => {
      console.error(error);
    },
    () => {},
    []
  );

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
    await shiftService.attendClient(shift.id);
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
      }}
    >
      {children}
    </ShiftContext.Provider>
  );
};

export default function useShifts() {
  return useContext(ShiftContext) as ShiftCtxProps;
}
