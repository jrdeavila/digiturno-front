import React from "react";
import useMyModule from "../use-my-module";
import { ModuleShiftProvider } from "./use-module-shifts";
import { ReceptorShiftsProvider } from "./use-receptor-shifts";
import { ScreenShiftsProvider } from "./use-screen-shifts";

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

  return <ModuleShiftProvider>
    {children}
  </ModuleShiftProvider>

};
