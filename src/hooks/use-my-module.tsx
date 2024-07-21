import ConfigureQualificationModulePage from "@/components/configure-qualification-module-page";
import ModuleType from "@/models/module-type";
import ModuleConfigPage from "@/pages/module-config";
import useQualificationModule from "@/services/use-qualification-module";
import delay from "@/utils/delay";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAsync from "./use-async";
import useLoading from "./use-loading";
import useHttpModuleService, { Module } from "./use-module-service";
import useSectional from "./use-sectional";

interface ConfigureModuleCtxProps {
  pared: boolean;
  checking: boolean;
  requestQualificationModule: () => void;
}

const ConfigureModuleCtx = createContext<ConfigureModuleCtxProps | undefined>(
  undefined
);

export const ConfigureModuleProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [pared, setPared] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(false);

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
      console.log(type?.useQualification);
      if (type?.useQualification) {
        setPared(data !== undefined);
      } else {
        setPared(true);
      }
    },
    (error) => {
      console.error(error);
    },
    () => {},
    [pared, type]
  );

  // ==================================================================

  const requestQualificationModule = async () => {
    const res = await qualificationModuleService.requestQualificationModule();
    setPared(res);
  };

  // ==================================================================

  return (
    <ConfigureModuleCtx.Provider
      value={{
        pared,
        checking,
        requestQualificationModule,
      }}
    >
      {children}
      {!checking && !pared && <ConfigureQualificationModulePage />}
    </ConfigureModuleCtx.Provider>
  );
};

export const useConfigureModule = () => {
  return useContext(ConfigureModuleCtx) as ConfigureModuleCtxProps;
};

interface MyModuleCtxProps {
  myModule: Module | undefined;
  type: ModuleType | undefined;
  shouldRequestIp: boolean;
  refreshMyModule: () => void;
  configureModuleInfo: (moduleInfo: MyModuleProps) => void;
}

const MyModuleContext = createContext<MyModuleCtxProps | undefined>(undefined);

export class MyModuleProps {
  ip: string;
  roomId: number;
  sectionalId: number;
  moduleTypeId: number;

  constructor(
    ip: string,
    roomId: number,
    sectionalId: number,
    moduleTypeId: number
  ) {
    this.ip = ip;
    this.roomId = roomId;
    this.sectionalId = sectionalId;
    this.moduleTypeId = moduleTypeId;
  }
}

export const MyModuleProvider: React.FC = () => {
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
  const { setLoading } = useLoading();

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
        const data = JSON.parse(moduleInfo);
        setMyModuleInfo(
          new MyModuleProps(
            data.ip,
            parseInt(data.roomId),
            parseInt(data.sectionalId),
            parseInt(data.moduleTypeId)
          )
        );
      } else {
        setShouldRequestIp(true);
      }
    } else {
      localStorage.setItem("module-info", JSON.stringify(myModuleInfo));
    }
    setShouldRequestIp(!myModuleInfo);
  }, [myModuleInfo]);

  useEffect(() => {
    if (myModuleInfo) {
      const moduleType = moduleTypes.find(
        (type) => type.id === myModuleInfo.moduleTypeId
      );
      setModuleType(moduleType);
    }
  }, [moduleTypes, myModuleInfo]);

  // ==================================================================

  const refreshMyModule = () => {
    myModuleService.getMyModule(myModuleInfo!.ip).then((myModule) => {
      setMyModule(myModule);
    });
  };

  // ==================================================================

  const redirection = useMemo(() => {
    switch (myModuleInfo?.moduleTypeId) {
      case 1:
        return <Navigate to="/caja" />;
      case 2:
        return <Navigate to="/recepción" />;
      case 3:
        return <Navigate to="/pantalla" />;
      case 4:
        return <Navigate to="/modulo-seccional" />;
      default:
        return null;
    }
  }, [myModuleInfo]);

  // ==================================================================

  return (
    <MyModuleContext.Provider
      value={{
        myModule,
        refreshMyModule,
        shouldRequestIp,
        configureModuleInfo,
        type: moduleType,
      }}
    >
      <ConfigureModuleProvider>
        <Outlet />
        {shouldRequestIp ? <ModuleConfigPage /> : redirection}
      </ConfigureModuleProvider>
    </MyModuleContext.Provider>
  );
};

const useMyModule = () => {
  return useContext(MyModuleContext) as MyModuleCtxProps;
};

export default useMyModule;
