import ConfigureQualificationModulePage from "@/components/configure-qualification-module-page";
import AttentionProfile from "@/models/attention-profile";
import ModuleConfigPage from "@/pages/module-config";
import { useAttentionProfileResource } from "@/providers/attention-profile-provider";
import { ModuleType } from "@/services/module-type-service";
import useQualificationModule from "@/services/use-qualification-module";
import delay from "@/utils/delay";
import React, { createContext, useContext, useEffect, useState } from "react";
import useAsync from "./use-async";
import useLoading from "./use-loading";
import useHttpModuleService, { Module, ModuleResponse, moduleResponseToModule } from "./use-module-service";
import useSectional from "./use-sectional";
import useEcho from "./operator/use-echo";

interface ConfigureModuleCtxProps {
  pared: boolean;
  checking: boolean;
  requestQualificationModule: () => void;
  onListenQualification: (listener: (qualification: number) => void) => void;
  removeListener: (listener: (qualification: number) => void) => void;
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

  // ==================================================================

  return (
    <ConfigureModuleCtx.Provider
      value={{
        pared: deviceConnected,
        checking,
        requestQualificationModule,
        onListenQualification,
        removeListener,
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
  attentionProfile: AttentionProfile | undefined;
  type: ModuleType | undefined;
  info: MyModuleProps | undefined;
  shouldRequestIp: boolean;
  refreshMyModule: () => void;
  configureModuleInfo: (moduleInfo: MyModuleProps) => void;
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
  const { attentionProfiles } = useAttentionProfileResource();
  const [myModuleInfo, setMyModuleInfo] = useState<MyModuleProps | undefined>(
    undefined
  );
  const [shouldRequestIp, setShouldRequestIp] = useState<boolean>(false);
  const [moduleType, setModuleType] = useState<ModuleType | undefined>(
    undefined
  );
  const [attentionProfile, setAttentionProfile] = useState<
    AttentionProfile | undefined
  >();

  const { moduleTypes } = useSectional();
  const { setLoading } = useLoading();

  const echo = useEcho();

  // ==================================================================

  const configureModuleInfo = (moduleInfo: MyModuleProps) => {
    setMyModuleInfo(moduleInfo);
  };

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
  }, [moduleType])


  useEffect(() => {
    if (myModule) {
      echo.channel(`modules.${myModule.id}`).listen(".module.updated", (data: { module: ModuleResponse }) => {
        const moduleUpdated = moduleResponseToModule(data.module);
        setMyModule(moduleUpdated);
      });
    }
    return () => {
      echo.leave("modules." + myModule?.id);
    };
  }, [myModule])

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
    () => { },
    [myModuleInfo]
  );

  // ===================================================================

  useEffect(() => {
    if (!myModuleInfo) {
      const moduleInfo = localStorage.getItem("module-info");
      if (moduleInfo) {
        const data = JSON.parse(moduleInfo);
        setMyModuleInfo(new MyModuleProps(data.ip));
      } else {
        setShouldRequestIp(true);
      }
    } else {
      localStorage.setItem("module-info", JSON.stringify(myModuleInfo));
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

  useEffect(() => {
    const attentionProfile = attentionProfiles.find(
      (profile) => profile.id === myModule?.attentionProfileId
    );
    setAttentionProfile(attentionProfile);
  }, [attentionProfiles, myModule]);

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
        attentionProfile,
        info: myModuleInfo,
        refreshMyModule,
        shouldRequestIp,
        configureModuleInfo,
        type: moduleType,
      }}
    >
      <ConfigureModuleProvider>
        {shouldRequestIp ? <ModuleConfigPage /> : children}
      </ConfigureModuleProvider>
    </MyModuleContext.Provider>
  );
};

const useMyModule = () => {
  const context = useContext(MyModuleContext);
  if (!context) {
    throw new Error("useMyModule must be used within a MyModuleProvider");
  }
  return context;
};

export default useMyModule;
