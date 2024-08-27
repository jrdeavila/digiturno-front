import AttentionProfileList from "@/components/attention-profile-list";
import SearchClientForm from "@/components/search-client-form";
import ShiftList from "@/components/shift-list";
import useEcho from "@/hooks/operator/use-echo";
import useReceptorShifts from "@/hooks/operator/use-receptor-shifts";
import useModule, { ModuleProvider } from "@/hooks/use-module";
import {
  Module,
  ModuleResponse,
  moduleResponseToModule,
} from "@/hooks/use-module-service";
import DefaultLayout from "@/layouts/default";
import AttentionProfile from "@/models/attention-profile";
import { useAttentionProfileResource } from "@/providers/attention-profile-provider";
import CreateShiftProvider, {
  useCreateShift,
} from "@/providers/create-shift-provider";
import { faDesktop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider } from "@nextui-org/react";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect } from "react";
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
              <SearchClientForm />
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
  const { shifts } = useReceptorShifts();
  const { attentionProfiles } = useAttentionProfileResource();
  const { modules } = useModule();

  return (
    <div className="flex flex-col items-center h-full w-full rounded-lg p-5">
      <h1 className="text-3xl font-bold">Perfiles de atención</h1>
      <div className="flex flex-col gap-y-2 w-full overflow-y-auto px-2">
        {attentionProfiles.map((attentionProfile) => (
          <div className="flex flex-col" key={attentionProfile.id}>
            <Divider className="w-full" />
            <div
              key={attentionProfile.id}
              className="flex flex-row items-center justify-between gap-x-2 w-full"
            >
              <span className="font-bold">{attentionProfile.name}</span>
              <CountIndicatorTarget>
                {
                  shifts.filter(
                    (shift) => shift.attentionProfile === attentionProfile.name
                  ).length
                }
              </CountIndicatorTarget>
            </div>
            <Divider className="w-full" />
            <div className="flex flex-col">
              {modules
                .filter(
                  (module) => module.attentionProfileId === attentionProfile.id
                )
                .map((module) => (
                  <ModuleLiveInfo
                    key={module.id}
                    module={module}
                    attentionProfile={attentionProfile}
                  />
                ))}
            </div>
          </div>
        ))}
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

  // =====================================================

  const echo = useEcho();

  // =====================================================

  useEffect(() => {
    echo
      .channel(`modules.${module.id}`)
      .listen(".module.updated", (event: { module: ModuleResponse }) => {
        const module = moduleResponseToModule(event.module);
        setCurrentModule(module);
      });
  }, [echo, module]);

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
      <div className="flex-grow"></div>
      <CountIndicatorTarget>
        {
          shifts.filter((shift) => {
            return (
              shift.module === currentModule.name &&
              module.attentionProfileId === attentionProfile.id
            );
          }).length
        }
      </CountIndicatorTarget>
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
