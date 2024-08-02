import useShifts from "@/hooks/operator/use-shifts";
import useClient, { ScreenClientProvider } from "@/hooks/use-client";
import DefaultLayout from "@/layouts/default";
import {
  faBullhorn,
  faSadCry,
  faSadTear,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

export default function ScreenPage() {
  return (
    <ScreenClientProvider>
      <DefaultLayout className="w-full h-[100vw]">
        <div className="grid grid-cols-3 grid-rows-1 w-full h-full">
          <div className="col-span-1 bg-blue-400">
          </div>
          <div className="col-span-2 bg-black">

          </div>
        </div>
      </DefaultLayout>
    </ScreenClientProvider>
  );
}



const ListOfCalledClients = () => {
  const { clients } = useClient();

  return (
    <div className="p-3">
      <div className="flex flex-row gap-x-3 items-center text-white">
        <h1 className="text-3xl font-bold">CLIENTES LLAMADOS</h1>
        <FontAwesomeIcon icon={faBullhorn} className="text-3xl" />
      </div>
      <div className="flex flex-col gap-y-3 pt-10">
        {clients?.map((client) => (
          <div
            key={client.id}
            className="bg-white rounded-lg flex flex-row items-center"
          >
            <p className="ml-3 text-3xl font-bold">{client.name}</p>
            <div className="flex-grow"></div>
            <div className="bg-primary h-16 w-16 rounded-r-lg flex justify-center items-center">
              <FontAwesomeIcon
                icon={faBullhorn}
                className="text-3xl text-white"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ListOfDistractedClients = () => {
  const { distractedShifts } = useShifts();
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
                icon={faSadCry}
                className="text-3xl text-white"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
