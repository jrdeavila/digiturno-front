import useAuth from "@/hooks/use-auth";
import useMyModule from "@/hooks/use-my-module";
import { faDesktop, faPerson, faSignOut, faToilet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useMemo } from "react";
import GenericComponent from "./GenericComponent";
import { Button } from "@nextui-org/react";

const ModuleInfo: React.FC = () => {
  const { myModule, attentionProfile } = useMyModule();
  const { logout } = useAuth();
  const { attendant } = useAuth();
  // =======================================================

  const moduleStatus = useMemo(() => {
    switch (myModule?.status) {
      case "offline": {
        return (
          <div className="flex flex-row gap-x-2 items-center text-gray-700">
            <FontAwesomeIcon icon={faDesktop} />
            <span> Desconectado </span>
          </div>
        )
      }
      case "online": {
        return (
          <div className="flex flex-row gap-x-2 items-center text-green-600">
            <FontAwesomeIcon icon={faDesktop} />
            <span> Conectado </span>
          </div>
        )
      }
      default: {
        return (
          <div className="flex flex-row gap-x-2 items-center">
            <FontAwesomeIcon icon={faDesktop} />
            <span> Desconocido </span>
          </div>
        )
      }
    }
  }, [myModule]);

  const attendantStatus = useMemo(() => {
    switch (attendant?.status) {
      case "free": {
        return (
          <div className="flex flex-row gap-x-2 items-center text-green-600">
            <FontAwesomeIcon icon={faPerson} />
            <span> Disponible </span>
          </div>
        )
      }
      case "offline": {
        return (
          <div className="flex flex-row gap-x-2 items-center text-gray-700">
            <FontAwesomeIcon icon={faPerson} />
            <span> Desconectado </span>
          </div>
        )
      }
      case "busy": {
        return (
          <div className="flex flex-row gap-x-2 items-center text-blue-600">
            <FontAwesomeIcon icon={faPerson} />
            <span> Ocupado </span>
          </div>
        )
      }

      case "absent": {
        return (
          <div className="flex flex-row gap-x-2 items-center text-yellow-600">
            <FontAwesomeIcon icon={faPerson} />
            <span> Ausente </span>
          </div>
        )
      }
      default: {
        return (
          <div className="flex flex-row gap-x-2 items-center">
            <FontAwesomeIcon icon={faPerson} />
            <span> Desconocido </span>
          </div>
        )
      }
    }
  }, [attendant]);

  // =======================================================
  return (
    <GenericComponent
      title="INFORMACIÓN DEL MODULO"
      rightComponent={<FontAwesomeIcon icon={faDesktop} />}
    >
      <div className="flex flex-col gap-y-1 h-full">
        <p className="text-2xl font-bold"> {myModule?.name} </p>
        <p className="text-xl"> {attendant?.name} </p>
        <p className="text-sm font-bold"> {attentionProfile?.name} </p>


        <div className="flex flex-row gap-x-1 items-center justify-between">
          {moduleStatus}
          {attendantStatus}
        </div>

        <div className="flex-grow"></div>
        <div className="flex flex-row items-center flex-wrap justify-stretch gap-x-3">
          <Button style={{
            backgroundColor: "#00204D",
          }} className=" text-white font-bold"
            onClick={logout}
          >
            <div className="flex flex-row gap-x-2 items-center">
              <FontAwesomeIcon icon={faSignOut} />
              <span> SALIR DEL SISTEMA </span>
            </div>
          </Button>

          <Button className="bg-red-700 text-white font-bold">
            <FontAwesomeIcon icon={faToilet} />
            <span> AUSENTARSE </span>

          </Button>

        </div>
      </div>

    </GenericComponent>
  );
};

export default ModuleInfo;
