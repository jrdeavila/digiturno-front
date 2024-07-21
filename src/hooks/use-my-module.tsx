import ModuleConfigPage from "@/pages/module-config";
import React, { createContext, useContext, useEffect, useState } from "react";
import useAsync from "./use-async";
import useHttpModuleService, { Module } from "./use-module-service";
import delay from "@/utils/delay";

interface MyModuleCtxProps {
  myModule: Module | undefined;
  shouldRequestIp: boolean;
  refreshMyModule: () => void;
  configureModuleInfo: (moduleInfo: MyModuleProps) => void;
}

const MyModuleContext = createContext<MyModuleCtxProps | undefined>(undefined);

export interface MyModuleProps {
  ip: string;
  roomId: number;
  sectionalId: number;
  moduleTypeId: number;
}

export const MyModuleProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [myModule, setMyModule] = useState<Module>();
  const [loading, setLoading] = useState<boolean>(true);
  const myModuleService = useHttpModuleService();
  const [myModuleInfo, setMyModuleInfo] = useState<MyModuleProps | undefined>(
    undefined
  );
  const [shouldRequestIp, setShouldRequestIp] = useState<boolean>(false);

  // ==================================================================

  const configureModuleInfo = (moduleInfo: MyModuleProps) => {
    setMyModuleInfo(moduleInfo);
  };

  // ==================================================================

  useAsync<Module | undefined>(
    async () => {
      return await delay<Module | undefined>(
        1000,
        () => {
          setLoading(true);
        },
        () => {
          setLoading(false);
        },
        () => {
          if (!myModuleInfo) {
            return Promise.resolve(undefined);
          }
          return myModuleService.getMyModule(myModuleInfo.ip);
        }
      );
    },
    (data) => {
      setMyModule(data);
    },
    (error) => {
      console.error(error);
      setShouldRequestIp(true);
    },
    () => {},
    [myModuleInfo]
  );

  // ===================================================================

  useEffect(() => {
    if (!myModuleInfo) {
      const moduleInfo = localStorage.getItem("module-info");
      if (moduleInfo) {
        setMyModuleInfo(JSON.parse(moduleInfo));
      } else {
        setShouldRequestIp(true);
      }
    } else {
      localStorage.setItem("module-info", JSON.stringify(myModuleInfo));
    }
    setShouldRequestIp(!myModuleInfo);
  }, [myModuleInfo]);

  // ==================================================================

  const refreshMyModule = () => {
    myModuleService.getMyModule(myModuleInfo!.ip).then((myModule) => {
      setMyModule(myModule);
    });
  };

  // ==================================================================

  return (
    <MyModuleContext.Provider
      value={{
        myModule,
        refreshMyModule,
        shouldRequestIp,
        configureModuleInfo,
      }}
    >
      {children}
      {!loading && shouldRequestIp && <ModuleConfigPage />}
    </MyModuleContext.Provider>
  );
};

const useMyModule = () => {
  return useContext(MyModuleContext) as MyModuleCtxProps;
};

export default useMyModule;
