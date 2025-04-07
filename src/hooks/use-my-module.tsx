import ConfigureQualificationModulePage from "@/components/configure-qualification-module-page";
import ModuleConfigPage from "@/pages/module-config";
import { ModuleType } from "@/services/module-type-service";
import useQualificationModule from "@/services/use-qualification-module";
import delay from "@/utils/delay";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { createContext, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import useEcho from "./operator/use-echo";
import useAsync from "./use-async";
import useCache from "./use-cache";
import useHttpModuleService, {
  Module,
  ModuleResponse,
  moduleResponseToModule,
} from "./use-module-service";
import useSectional from "./use-sectional";

interface ConfigureModuleCtxProps {
  pared: boolean;
  checking: boolean;
  requestQualificationModule: () => void;
  onListenQualification: (listener: (qualification: number) => void) => void;
  removeListener: (listener: (qualification: number) => void) => void;
  clearListeners: () => void;
}

const ConfigureModuleCtx = createContext<ConfigureModuleCtxProps | undefined>(
  undefined
);

export const ConfigureModuleProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [deviceConnected, setDeviceConnected] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);
  const [listeners, setListeners] = useState<
    ((qualification: number) => void)[]
  >([]);

  const { type } = useMyModule();
  const qualificationModuleService = useQualificationModule();

  useAsync<HIDDevice | undefined>(
    async () => {
      return await delay<HIDDevice | undefined>(
        1000,
        () => {
          setChecking(true);
        },
        () => {
          setChecking(false);
        },
        () => {
          return qualificationModuleService.getQualificationModule();
        }
      );
    },
    (data) => {
      if (type?.useQualification) {
        setDeviceConnected(data !== undefined);
      } else {
        setDeviceConnected(true);
      }
    },
    (error) => {
      console.error(error);
    },
    () => { },
    [type, qualificationModuleService]
  );

  useEffect(() => {
    if (deviceConnected) {
      qualificationModuleService.connect({
        onError: (error) => {
          console.error(error);
        },
        onQualified: (qualification) => {
          listeners.forEach((listener) => {
            listener(qualification);
          });
        },
      });
    }
    return () => {
      qualificationModuleService.disconnect();
    };
  }, [listeners, deviceConnected, qualificationModuleService]);

  // ==================================================================

  const requestQualificationModule = async () => {
    const res = await qualificationModuleService.requestQualificationModule();
    setDeviceConnected(res);
  };

  const onListenQualification = (listener: (qualification: number) => void) => {
    setListeners((prev) => [...prev, listener]);
  };

  const removeListener = (listener: (qualification: number) => void) => {
    setListeners((prev) => prev.filter((l) => l !== listener));
  };

  const clearListeners = () => {
    setListeners([]);
  }

  // ==================================================================

  return (
    <ConfigureModuleCtx.Provider
      value={{
        pared: deviceConnected,
        checking,
        requestQualificationModule,
        onListenQualification,
        removeListener,
        clearListeners,
      }}
    >
      {children}
      {!checking && !deviceConnected && <ConfigureQualificationModulePage />}
    </ConfigureModuleCtx.Provider>
  );
};

export const useConfigureModule = () => {
  return useContext(ConfigureModuleCtx) as ConfigureModuleCtxProps;
};

interface MyModuleCtxProps {
  myModule: Module | undefined;
  type: ModuleType | undefined;
  info: MyModuleProps | undefined;
  shouldRequestIp: boolean;
  refreshMyModule: () => void;
  configureModuleInfo: (moduleInfo: MyModuleProps) => void;
  clearModuleInfo: () => void;
}

const MyModuleContext = createContext<MyModuleCtxProps | undefined>(undefined);

export class MyModuleProps {
  ip: string;

  constructor(ip: string) {
    this.ip = ip;
  }
}

export const MyModuleProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [myModule, setMyModule] = useState<Module>();
  const myModuleService = useHttpModuleService();
  const [myModuleInfo, setMyModuleInfo] = useState<MyModuleProps | undefined>(
    undefined
  );
  const [shouldRequestIp, setShouldRequestIp] = useState<boolean>(false);
  const [moduleType, setModuleType] = useState<ModuleType | undefined>(
    undefined
  );

  const { moduleTypes } = useSectional();

  const echo = useEcho();
  const cache = useCache();

  // ==================================================================

  const configureModuleInfo = (moduleInfo: MyModuleProps) => {
    setMyModuleInfo(moduleInfo);
  };

  // ==============================================================================

  useEffect(() => {
    console.log("My Module Provider mounted");
  }, [])



  // ==================================================================



  useEffect(() => {
    if (!moduleType) {
      return;
    }
    if (moduleType.useQualification) {
      echo.connect();
    }

    return () => {
      if (moduleType.useQualification) {
        echo.disconnect();
      }
    };
  }, [moduleType]);

  useEffect(() => {
    if (myModule) {
      echo
        .channel(`modules.${myModule.id}`)
        .listen(".module.updated", (data: { module: ModuleResponse }) => {
          const moduleUpdated = moduleResponseToModule(data.module);
          setMyModule(moduleUpdated);
        });
    }
    return () => {
      echo.leave("modules." + myModule?.id);
    };
  }, [myModule]);

  useAsync<Module | undefined>(
    async () => {

      let myModule = cache.get<Module>("my-module");
      if (myModule) {
        return myModule;
      }
      myModule = await myModuleService.getMyModule(myModuleInfo!.ip);
      cache.set("my-module", myModule);
      return myModule;
    },
    (data) => {
      setMyModule(data);
    },
    (error) => {
      console.error(error);
      setShouldRequestIp(true);
    },
    () => { },
    [myModuleInfo]
  );

  // ===================================================================

  useEffect(() => {
    if (!myModuleInfo) {

      const oldConfig = localStorage.getItem("module-info");
      const moduleInfo = oldConfig ?
        JSON.parse(oldConfig) :
        cache.get<MyModuleProps>("module-info");
      if (moduleInfo) {
        setMyModuleInfo(new MyModuleProps(moduleInfo.ip));
      } else {
        setShouldRequestIp(true);
      }
    } else {
      cache.set("module-info", myModuleInfo);
    }
    setShouldRequestIp(!myModuleInfo);
  }, [myModuleInfo]);

  useEffect(() => {
    if (myModule) {
      const moduleType = moduleTypes.find(
        (type) => type.id === myModule.moduleTypeId
      );
      setModuleType(moduleType);
    }
  }, [moduleTypes, myModule]);

  // ==================================================================

  const refreshMyModule = () => {
    myModuleService.getMyModule(myModuleInfo!.ip).then((myModule) => {
      setMyModule(myModule);
    });
  };

  const clearModuleInfo = () => {
    setMyModuleInfo(undefined);
    localStorage.removeItem("module-info");
    cache.delete("module-info");
    cache.delete("my-module");
    cache.delete("services");
    cache.delete("attention_profiles");
    cache.delete("profile");
    cache.delete("token");
  };

  // ==================================================================

  return (
    <MyModuleContext.Provider
      value={{
        myModule,
        info: myModuleInfo,
        refreshMyModule,
        shouldRequestIp,
        configureModuleInfo,
        type: moduleType,
        clearModuleInfo,
      }}
    >
      {myModule?.enabled == false ? (
        <BlockedModulePage />
      ) : (
        <ConfigureModuleProvider>
          {shouldRequestIp ? <ModuleConfigPage /> : children}
        </ConfigureModuleProvider>
      )}
    </MyModuleContext.Provider>
  );
};

const BlockedModulePage: React.FC = () => {
  return (
    <StyledBlockedModulePage>
      <div className="text-blue-500 flex flex-col justify-center items-center">
        <FontAwesomeIcon icon={faBan} size="7x" />
        <h1>Este modulo esta inhabilitado</h1>
        <p>Por favor, contacte al administrador</p>
      </div>
    </StyledBlockedModulePage>
  );
};

const StyledBlockedModulePage = styled.div`
  z-index: 1000;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const useMyModule = () => {
  const context = useContext(MyModuleContext);
  if (!context) {
    throw new Error("useMyModule must be used within a MyModuleProvider");
  }
  return context;
};

export default useMyModule;
