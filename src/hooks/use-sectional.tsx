import { Room } from "@/services/room-service";
import { Sectional } from "@/services/sectional-service";
import React, { useContext, useState } from "react";
import useAsync from "./use-async";
import useRoomService from "./use-room-service";
import useSectionalService from "./use-sectional-service";
import { ModuleType } from "@/services/module-type-service";
import useModuleTypeService from "./use-module-type-service";

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
  const [moduleTypes, setModuleTypes] = useState<ModuleType[]>([]);
  const [roomsBySectional, setRoomsBySectional] = useState<Room[]>([]);
  const sectionalService = useSectionalService();
  const roomService = useRoomService();
  const moduleTypeService = useModuleTypeService();

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

  useAsync<ModuleType[]>(
    async () => {
      return moduleTypeService.getModuleTypes();
    },
    (data) => {
      setModuleTypes(data);
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
