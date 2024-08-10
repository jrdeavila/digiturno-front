import { Shift } from "@/hooks/operator/use-http-shifts-service";
import useScreenShifts from "@/hooks/operator/use-screen-shifts";
import useClient, { ScreenClientProvider } from "@/hooks/use-client";
import { VoiceProvider } from "@/hooks/useVoice";
import DefaultLayout from "@/layouts/default";
import {
  faFrown,
  faSadTear
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";


export default function ScreenPage() {
  return (
    <VoiceProvider>
      <ScreenClientProvider>
        <DefaultLayout className="w-full h-[100vw]">
          <div className="grid grid-cols-3 grid-rows-1 w-full h-full">
            <div className="col-span-1 p-4">
              <div className="flex flex-col gap-y-1">
                <DistractedHeader />
                <ListOfDistractedClients />
              </div>
            </div>
            <div className="col-span-2 p-4">
              <ClientHeader />
              <ListOfCalledClients />
            </div>
          </div>
        </DefaultLayout>
      </ScreenClientProvider>
    </VoiceProvider>
  );
}

const ClientHeader = () => {
  return (
    <div className="flex flex-row gap-x-3 items-center px-3 py-1 rounded-e-lg">
      <h1 className="text-3xl font-bold text-primary">TURNOS LLAMADOS</h1>
    </div>
  )
}

const DistractedHeader = () => {
  return (
    <div className="flex flex-row gap-x-3 items-center bg-primary text-white px-3 py-1 rounded-e-lg">
      <h1 className="text-3xl font-bold">TURNOS DISTRAÍDOS</h1>
    </div>
  )
}

const ListOfCalledClients = () => {
  const { clients } = useClient();

  return (
    <div className="p-3">
      <div className="flex flex-col gap-y-3 pt-10">
        {clients?.map((client) => (
          <div
            key={client.id}
            className="bg-white rounded-lg flex flex-row items-center"
          >
            <p className="ml-3 text-3xl font-bold">{client.name}</p>
            <div className="flex-grow"></div>
            <div className="bg-primary h-16 w-16 rounded-r-lg flex justify-center items-center text-white text-2xl">
              {client.moduleName}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ListOfDistractedClients = () => {
  const { shifts } = useScreenShifts();
  const [distractedShifts, setDistractedShifts] = useState<Shift[]>([]);

  useEffect(() => {
    const distractedShifts = shifts.filter((shift) => shift.state === "distracted");
    setDistractedShifts(distractedShifts);
  }, [shifts]);


  return (
    <div className="p-3">
      <div className="flex flex-row gap-x-3 items-center text-white">
        <h1 className="text-3xl font-bold">CLIENTES DISTRAÍDOS</h1>
        <FontAwesomeIcon icon={faSadTear} className="text-3xl" />
      </div>
      <div className="flex flex-col gap-y-3 pt-10">
        {distractedShifts.map((shift) => (
          <div
            key={shift.id}
            className="bg-white rounded-lg flex flex-row items-center"
          >
            <p className="ml-3 text-3xl font-bold">{shift.client.name}</p>
            <div className="flex-grow"></div>
            <div className="bg-red-500 h-16 w-16 rounded-r-lg flex justify-center items-center">
              <FontAwesomeIcon
                icon={faFrown}
                className="text-3xl text-white"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


