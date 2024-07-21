import { Room } from "@/services/room-service";
import { Sectional } from "@/services/sectional-service";
import {
  faArrowLeftLong,
  faCashRegister,
  faLaptop,
  faTv,
} from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useState } from "react";
import useAsync from "./use-async";
import useRoomService from "./use-room-service";
import useSectionalService from "./use-sectional-service";
import ModuleType from "@/models/module-type";

type SectionalCtxProps = {
  sectionals: Sectional[];
  roomsBySectional: Room[];
  rooms: Room[];
  refreshSectionals: () => void;
  moduleTypes: ModuleType[];
  filterRooms: (sectionalId: number) => void;
};

const SectionalCtx = React.createContext<SectionalCtxProps | undefined>(
  undefined
);

export const SectionalProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [sectionals, setSectionals] = useState<Sectional[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [moduleTypes] = useState<ModuleType[]>([
    {
      id: 1,
      name: "Caja",
      icon: faCashRegister,
      useQualification: true,
    },
    {
      id: 2,
      name: "Recepción",
      icon: faLaptop,
      useQualification: false,
    },
    {
      id: 3,
      name: "Pantalla",
      icon: faTv,
      useQualification: false,
    },
    {
      id: 4,
      name: "Modulo sucursal",
      icon: faArrowLeftLong,
      useQualification: true,
    },
  ]);
  const [roomsBySectional, setRoomsBySectional] = useState<Room[]>([]);
  const sectionalService = useSectionalService();
  const roomService = useRoomService();

  // ==================================================================

  useAsync<Sectional[]>(
    async () => {
      return sectionalService.getSectionals();
    },
    (data) => {
      setSectionals(data);
    },
    (error) => {
      console.error(error);
    },
    () => {},
    []
  );

  useAsync<Room[]>(
    async () => {
      return roomService.getRooms();
    },
    (data) => {
      setRooms(data);
    },
    (error) => {
      console.error(error);
    },
    () => {},
    []
  );

  // ==================================================================

  const refreshSectionals = () => {
    sectionalService.getSectionals().then(setSectionals);
  };

  const filterRooms = (sectionalId: number) => {
    setRoomsBySectional(
      rooms.filter((room) => room.sectionalId === sectionalId)
    );
  };

  // ==================================================================
  return (
    <SectionalCtx.Provider
      value={{
        sectionals,
        roomsBySectional,
        rooms,
        refreshSectionals,
        moduleTypes,
        filterRooms,
      }}
    >
      {children}
    </SectionalCtx.Provider>
  );
};

export default function useSectional() {
  return useContext(SectionalCtx) as SectionalCtxProps;
}
