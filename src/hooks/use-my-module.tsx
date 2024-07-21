import LoadingPage from "@/components/loading-page";
import ModuleConfigPage from "@/pages/module-config";
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
import useHttpModuleService, { Module } from "./use-module-service";

interface MyModuleCtxProps {
  myModule: Module | undefined;
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
      }}
    >
      <Outlet />
      {loading ? (
        <LoadingPage />
      ) : shouldRequestIp ? (
        <ModuleConfigPage />
      ) : (
        redirection
      )}
    </MyModuleContext.Provider>
  );
};

const useMyModule = () => {
  return useContext(MyModuleContext) as MyModuleCtxProps;
};

export default useMyModule;
