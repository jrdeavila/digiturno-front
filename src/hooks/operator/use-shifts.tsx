import React from "react";
import useMyModule from "../use-my-module";
import { ModuleShiftProvider } from "./use-module-shifts";
import { ReceptorShiftsProvider } from "./use-receptor-shifts";
import { ScreenShiftsProvider } from "./use-screen-shifts";
import { Navigate } from "react-router-dom";

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

  if (myModule?.moduleTypeId === 2) {
    return (
      <>
        {children}
      </>
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

  return <Navigate to="/" />

};
