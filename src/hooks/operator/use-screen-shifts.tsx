import { createContext, useContext, useEffect, useState } from "react";
import useHttpShiftService, { Shift, ShiftResponse, shiftResponseToModel } from "./use-http-shifts-service";
import useMyModule from "../use-my-module";
import useAsync from "../use-async";
import useEcho from "./use-echo";

interface ScreenShiftCtxProps {
  shifts: Shift[];
}

const ScreenShiftsContext = createContext<ScreenShiftCtxProps | undefined>(undefined);


export const ScreenShiftsProvider = ({ children }: { children: React.ReactNode }) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  // ==============================================================================

  const { myModule } = useMyModule();

  // ==============================================================================

  const shiftService = useHttpShiftService();
  const echo = useEcho();

  // ==============================================================================

  useAsync<Shift[]>(
    async () => {
      if (!myModule) return [];
      return shiftService.getShiftsByRoom(myModule!.room.id, myModule!.ipAddress);
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



  useEffect(() => {
    const orderByPreferential = (prevShifts: Shift[], shift: Shift) => {
      if (prevShifts.find((s) => s.id === shift.id)) {
        return prevShifts.map((s) => (s.id === shift.id ? {
          ...s,
          state: "pending",
        } : s));
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

    const roomShiftChannelName = `rooms.${myModule?.room.id}.shifts`;

    // ======================================== ROOM CHANNEL ========================================

    echo.channel(roomShiftChannelName).listen(".shift.distracted", (data: { shift: ShiftResponse }) => {
      const shiftDistracted = shiftResponseToModel(data.shift);
      setShifts((prevShifts) =>
        prevShifts.map((shift) => {
          if (shift.id !== shiftDistracted.id) return shift;
          return {
            ...shift,
            state: "distracted",
          };
        })
      );
    });

    echo.channel(roomShiftChannelName).listen(".shift.pending", (data: { shift: ShiftResponse }) => {
      const shift = shiftResponseToModel(data.shift);
      setShifts((prevShifts) => orderByPreferential(prevShifts, shift));
    });
    echo.channel(roomShiftChannelName).listen(".shift.pending-transferred", (data: { shift: ShiftResponse }) => {
      const shift = shiftResponseToModel(data.shift);
      setShifts((prevShifts) => orderByPreferential(prevShifts, shift));
    });

    echo.channel(roomShiftChannelName).listen(".shift.deleted", (data: { shift: ShiftResponse }) => {
      setShifts((prevShifts) =>
        prevShifts.filter((shift) => shift.id !== data.shift.id)
      );
    });

    echo.channel(roomShiftChannelName).listen(".shift.transferred", (data: { shift: ShiftResponse }) => {
      setShifts((prevShifts) =>
        prevShifts.map((shift) => {
          if (shift.id !== data.shift.id) return shift;
          return {
            ...shift,
            state: "transferred",
          };
        })
      );
    });

    echo.channel(roomShiftChannelName).listen(".shift.qualified", (data: { shift: ShiftResponse }) => {
      setShifts((prevShifts) =>
        prevShifts.filter((shift) => shift.id !== data.shift.id)
      );
    });

    echo.channel(roomShiftChannelName).listen(".shift.in-progress", (data: { shift: ShiftResponse }) => {
      setShifts((prevShifts) => {
        // Change state to in-progress
        return prevShifts.map((shift) => {
          if (shift.id !== data.shift.id) return shift;
          return {
            ...shift,
            state: "in_progress",
          };
        });
      }
      );
    });



    return () => {
      echo.leave(roomShiftChannelName);
    };
  }, [myModule]);



  // ==============================================================================


  return (
    <ScreenShiftsContext.Provider value={{ shifts }}>
      {children}
    </ScreenShiftsContext.Provider>
  )
}

export default function useScreenShifts() {
  const context = useContext(ScreenShiftsContext);
  if (!context) {
    throw new Error("useScreenShifts must be used within a ScreenShiftsProvider");
  }
  return context;
}