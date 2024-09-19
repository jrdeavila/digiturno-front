import AttentionProfileList from "@/components/attention-profile-list";
import SearchClientForm from "@/components/search-client-form";
import ShiftList from "@/components/shift-list";
import useEcho from "@/hooks/operator/use-echo";
import useReceptorShifts from "@/hooks/operator/use-receptor-shifts";
import {
  Attendant,
  AttendantResponse,
  attendantResponseToAttendant,
} from "@/hooks/use-authentication-service";
import useModule, { ModuleProvider } from "@/hooks/use-module";
import {
  Module,
  ModuleResponse,
  moduleResponseToModule,
} from "@/hooks/use-module-service";
import useMyModule from "@/hooks/use-my-module";
import DefaultLayout from "@/layouts/default";
import AttentionProfile from "@/models/attention-profile";
import { useAttendantResource } from "@/providers/attendant-provider";
import { useAttentionProfileResource } from "@/providers/attention-profile-provider";
import CreateShiftProvider, {
  useCreateShift,
} from "@/providers/create-shift-provider";
import { faDesktop, faPerson } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider } from "@nextui-org/react";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useCallback, useEffect, useMemo } from "react";
import styled from "styled-components";

export default function ReceptorPage() {
  return (
    <DefaultLayout
      showLogo={false}
      className="overflow-y-auto pb-10 h-full w-full"
    >
      <ModuleProvider>
        <CreateShiftProvider>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:grid-rows-4 h-full w-full">
            <div className="col-span-1 row-span-1">
              <SearchClientForm enabledType={true} />
            </div>
            <div className="col-span-2 row-span-4">
              <ShiftList />
            </div>

            <div className="col-span-1 row-span-1 p-2">
              <ShiftInfo />
            </div>
            <div className="col-span-1 row-span-2 p-2">
              <AttentionProfileList />
              <CreateShiftButton />
            </div>

            <div className="col-span-1 row-span-3">
              <AttentionProfileShiftInfo />
            </div>
          </div>
        </CreateShiftProvider>
      </ModuleProvider>
    </DefaultLayout>
  );
}

const CreateShiftButton = () => {
  const { createShiftWithAttentionProfile } = useCreateShift();
  return (
    <button
      onClick={createShiftWithAttentionProfile}
      className="w-full bg-primary text-white rounded-lg py-2"
    >
      Crear turno
    </button>
  );
};

const AttentionProfileShiftInfo = () => {
  const { attentionProfiles } = useAttentionProfileResource();
  const { modules } = useModule();
  const { myModule } = useMyModule();

  const renderModules = useCallback(() => {
    return attentionProfiles
      .map((ap) => {
        return (
          <div className="flex flex-col" key={ap.id}>
            <div className="flex flex-row items-center justify-center gap-x-2 w-full">
              <span className="font-bold">{ap.name}</span>
            </div>
            <div className="flex flex-col">
              {modules
                .filter((module) => module.attentionProfileId === ap.id && module.room.id === myModule?.room.id)
                .map((module) => (
                  <ModuleLiveInfo
                    key={module.id}
                    module={module}
                    attentionProfile={ap}
                  />
                ))}
            </div>
          </div>
        );
      });
  }, [attentionProfiles, modules]);

  // =====================================================

  return (
    <div className="flex flex-col items-center h-full w-full rounded-lg p-5">
      <h1 className="text-3xl font-bold">Perfiles de atención</h1>
      <div className="flex flex-col gap-y-2 w-full overflow-y-auto px-2">
        <div className="flex flex-row justify-between">
          <div>
            <FontAwesomeIcon icon={faDesktop} color="red" className="mr-1" />
            <span className="text-sm text-gray-500">Modulo Inactivo</span>
          </div>
          <div>
            <FontAwesomeIcon icon={faDesktop} color="green" className="mr-1" />
            <span className="text-sm text-gray-500">Modulo Activo</span>
          </div>
        </div>
        <Divider className="w-full" />
        <div className="flex flex-row justify-between">
          <div>
            <FontAwesomeIcon icon={faPerson} color="red" className="mr-1" />
            <span className="text-sm text-gray-500">Funcionario Inactivo</span>
          </div>
          <div>
            <FontAwesomeIcon icon={faPerson} color="green" className="mr-1" />
            <span className="text-sm text-gray-500">
              Funcionario disponible
            </span>
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <div>
            <FontAwesomeIcon icon={faPerson} color="blue" className="mr-1" />
            <span className="text-sm text-gray-500">Funcionario ocupado</span>
          </div>
          <div>
            <FontAwesomeIcon icon={faPerson} color="orange" className="mr-1" />
            <span className="text-sm text-gray-500">Funcionario ausente</span>
          </div>
        </div>
        <Divider className="w-full" />
        {renderModules()}
      </div>
    </div>
  );
};

const ModuleLiveInfo: React.FC<{
  module: Module;
  attentionProfile: AttentionProfile;
}> = ({ module, attentionProfile }) => {
  const { shifts } = useReceptorShifts();
  const [currentModule, setCurrentModule] = React.useState<Module>(module);
  const [attendant, setAttendant] = React.useState<Attendant | undefined>(
    undefined
  );

  // =====================================================

  const echo = useEcho();
  const { attendants } = useAttendantResource();

  // =====================================================
  useEffect(() => {
    setAttendant(
      attendants.find((attendant) => attendant.id === module.currentAttendantId)
    );
  }, [attendants, module.currentAttendantId]);

  // =====================================================

  useEffect(() => {
    echo
      .channel(`attendants.${attendant?.id}`)
      .listen(
        ".attendant.updated",
        (event: { attendant: AttendantResponse }) => {
          const attendant = attendantResponseToAttendant(event.attendant);
          setAttendant(attendant);
        }
      );
    return () => {
      if (attendant) {
        echo.leaveChannel(`attendants.${attendant.id}`);
      }
    };
  }, [attendant]);

  // =====================================================

  useEffect(() => {
    echo
      .channel(`modules.${module.id}`)
      .listen(".module.updated", (event: { module: ModuleResponse }) => {
        const module = moduleResponseToModule(event.module);
        setCurrentModule(module);
      });
  }, [echo, module]);

  // =====================================================

  const renderAttendantStatus = useCallback(() => {
    switch (attendant?.status) {
      case "offline": {
        return <FontAwesomeIcon icon={faPerson} color="gray" />;
      }
      case "free": {
        return <FontAwesomeIcon icon={faPerson} color="green" />;
      }
      case "busy": {
        return <FontAwesomeIcon icon={faPerson} color="blue" />;
      }
      case "absent": {
        return <FontAwesomeIcon icon={faPerson} color="orange" />;
      }
    }
  }, [attendant?.status]);

  const qualifiedShiftCount = useMemo(() => {
    return shifts.filter((shift) => {
      return (
        shift.moduleId === currentModule.id &&
        // module.attentionProfileId === attentionProfile.id &&
        shift.state === "qualified"
      );
    }).length
  }, [shifts, currentModule]);
  // =====================================================
  return (
    <div
      key={module.id}
      className="flex flex-row items-center justify-start gap-x-1 pl-5"
    >
      <FontAwesomeIcon
        icon={faDesktop}
        color={currentModule.status === "offline" ? "red" : "green"}
      />
      <span>{currentModule.name}</span>
      {renderAttendantStatus()}
      <div className="flex-grow"></div>
      <CountIndicatorTarget> {qualifiedShiftCount} </CountIndicatorTarget>
    </div>
  );
};

const CountIndicatorTarget = styled.span`
  background-color: #00204d;
  border: 1px solid white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ShiftInfo = () => {
  const { shifts } = useReceptorShifts();
  return (
    <div
      style={{
        backgroundColor: "#00204D",
        border: "1px solid white",
      }}
      className="flex flex-col items-center justify-center h-full w-full rounded-lg p-5 text-white"
    >
      <h1 className="text-3xl font-bold">Recepción</h1>
      <div className="flex flex-row items-center justify-between w-full">
        <div className="flex flex-col items-center justify-between">
          <h2 className="text-sm font-bold">Pendientes</h2>
          <p className="text-2xl">
            {
              shifts.filter(
                (shift) =>
                  shift.state === "pending" ||
                  shift.state === "pending-transferred"
              ).length
            }
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-sm font-bold">Distraídos</h2>
          <p className="text-2xl">
            {shifts.filter((shift) => shift.state === "distracted").length}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-sm font-bold">Atendidos</h2>
          <p className="text-2xl">
            {shifts.filter((shift) => shift.state === "qualified").length}
          </p>
        </div>
      </div>
    </div>
  );
};
