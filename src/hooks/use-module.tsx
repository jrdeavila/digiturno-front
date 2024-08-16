import { createContext, useContext, useState } from "react";
import useHttpModuleService, { Module } from "./use-module-service";
import useAsync from "./use-async";
import useMyModule from "./use-my-module";

interface ModuleCtxProps {
  modules: Module[];
  refreshModules: () => void;
}

const ModuleCtx = createContext<ModuleCtxProps | undefined>(undefined);


export const ModuleProvider = ({ children }: { children: React.ReactNode }) => {
  const [modules, setModules] = useState<Module[]>([]);

  // ==============================================================================================================

  const moduleService = useHttpModuleService();

  // ==============================================================================================================

  const { myModule } = useMyModule();

  // ==============================================================================================================

  useAsync<Module[]>(
    async () => {
      if (!myModule) return [];
      return await moduleService.getModules(myModule.ipAddress);
    },
    (modules) => {
      setModules(modules);
    },
    (error) => {
      console.error(error);
    },
    undefined,
    []
  )

  // ==============================================================================================================

  const refreshModules = () => {
    if (!myModule) return;
    moduleService.getModules(myModule.ipAddress).then(setModules);
  }

  // ==============================================================================================================


  return (
    <ModuleCtx.Provider value={{
      modules,
      refreshModules
    }}>
      {children}
    </ModuleCtx.Provider>
  );
}

export default function useModule() {
  const ctx = useContext(ModuleCtx);
  if (!ctx) {
    throw new Error("useModule must be used within a ModuleProvider");
  }
  return ctx;
}



