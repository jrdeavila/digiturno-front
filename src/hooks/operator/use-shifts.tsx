import Service from "@/models/service";
import React, { createContext } from "react";
import useMyModule from "../use-my-module";
import { AttentionProfile } from "./use-http-attention-profile-service";
import {
  Shift
} from "./use-http-shifts-service";
import { ModuleShiftProvider } from "./use-module-shifts";
import { ReceptorShiftsProvider } from "./use-receptor-shifts";
import { ScreenShiftsProvider } from "./use-screen-shifts";

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
  setServices: (services: Service[]) => void;
  cancelShift: (shift: Shift) => Promise<void>;
}

const ShiftContext = createContext<ShiftCtxProps | undefined>(undefined);

export const ShiftProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {

  // ==================================================================

  const { myModule } = useMyModule();

  // ==================================================================

  if (myModule?.moduleTypeId === 1) {
    return (
      <ModuleShiftProvider>
        {children}
      </ModuleShiftProvider>
    )
  }

  if (myModule?.moduleTypeId === 3) {
    return (
      <ReceptorShiftsProvider
      >
        {children}
      </ReceptorShiftsProvider>
    )
  }
  if (myModule?.moduleTypeId === 4) {
    return (
      <ScreenShiftsProvider>
        {children}
      </ScreenShiftsProvider>
    )
  }

  return <></>

};
