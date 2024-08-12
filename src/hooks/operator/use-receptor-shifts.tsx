import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAsync from "../use-async";
import useMyModule from "../use-my-module";
import useEcho from "./use-echo";
import useHttpShiftService, { Shift, ShiftResponse, shiftResponseToModel } from "./use-http-shifts-service";

interface ReceptorShiftCtxProps {
  shifts: Shift[];
  distractedShifts: Shift[];

  cancelShift: (shift: Shift) => void;

}

const ReceptorShiftsContext = createContext<ReceptorShiftCtxProps | undefined>(undefined);


export const ReceptorShiftsProvider = ({ children }: { children: React.ReactNode }) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [distractedShifts, setDistractedShifts] = useState<Shift[]>([]);

  // ==============================================================================

  const { myModule } = useMyModule();
  // ==============================================================================

  const echo = useEcho();
  const shiftService = useHttpShiftService();

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

  useAsync<Shift[]>(
    async () => {
      if (!myModule) return [];
      return shiftService.getDistractedShiftsByModule(myModule!.room.id, myModule!.ipAddress);
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
      const shift = shiftResponseToModel(data.shift);

      setShifts((prevShifts) =>
        prevShifts.map((s) => {
          if (s.id !== shift.id) return s;
          return {
            ...s,
            state: "distracted",
          };
        })
      );
    });

    echo.channel(roomShiftChannelName).listen(".shift.pending", (data: { shift: ShiftResponse }) => {
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
        prevShifts.map((shift) => {
          if (shift.id !== data.shift.id) return shift;
          return {
            ...shift,
            state: "qualified",
          };
        })
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

  const cancelShift = async (shift: Shift) => {
    await shiftService.deleteShift(shift.id, myModule!.ipAddress);
    toast.success("Turno cancelado");
  }

  return (
    <ReceptorShiftsContext.Provider value={{ shifts, distractedShifts, cancelShift }}>
      {children}
    </ReceptorShiftsContext.Provider>
  )
}


export default function useReceptorShifts() {
  const context = useContext(ReceptorShiftsContext);
  if (!context) {
    throw new Error("useReceptorShifts must be used within a ReceptorShiftsProvider");
  }
  return context;
}