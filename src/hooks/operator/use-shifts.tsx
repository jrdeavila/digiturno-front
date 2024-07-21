import React, { createContext, useContext, useEffect, useState } from "react";
import useEcho from "./use-echo";
import useHttpShiftService, { Shift } from "./use-http-shifts-service";
import useAsync from "../use-async";

interface ShiftCtxProps {
  shifts: Shift[];
  distractedShifts: Shift[];
  currentShift?: Shift;
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

  useEffect(() => {
    echo.connect();
    echo.channel("shifts").listen("ShiftCreated", (shift: Shift) => {
      console.log(shift);
      setShifts((prevShifts) => [...prevShifts, shift]);
    });
    echo.channel("shifts").listen("ShiftUpdated", (shift: Shift) => {
      console.log(shift);
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
      return shiftService.getShifts();
    },
    (shifts) => {
      setShifts(shifts);
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
  return (
    <ShiftContext.Provider
      value={{
        shifts,
        distractedShifts,
        currentShift,
      }}
    >
      {children}
    </ShiftContext.Provider>
  );
};

export default function useShifts() {
  return useContext(ShiftContext) as ShiftCtxProps;
}
