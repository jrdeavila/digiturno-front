import { ModuleType } from "@/services/module-type-service";
import { Room } from "@/services/room-service";
import { Sectional } from "@/services/sectional-service";
import React, { useContext, useEffect, useState } from "react";
import useAsync from "./use-async";
import useCache from "./use-cache";
import useModuleTypeService from "./use-module-type-service";
import useRoomService from "./use-room-service";
import useSectionalService from "./use-sectional-service";

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

  const cache = useCache();

  // ==============================================================================

  useEffect(() => {
    console.log("Sectional Provider mounted");
  }, [])



  // ==================================================================

  useAsync<Sectional[]>(
    async () => {
      let sectionals = cache.get<Sectional[]>("sectionals");
      if (sectionals) {
        return sectionals;
      }
      sectionals = await sectionalService.getSectionals();
      cache.set("sectionals", sectionals);
      return sectionals;

    },
    (data) => {
      setSectionals(data);
    },
    (error) => {
      console.error(error);
    },
    () => { },
    []
  );

  useAsync<Room[]>(
    async () => {
      let rooms = cache.get<Room[]>("rooms");
      if (rooms) {
        return rooms;
      }
      rooms = await roomService.getRooms();
      cache.set("rooms", rooms);
      return rooms;
    },
    (data) => {
      setRooms(data);
    },
    (error) => {
      console.error(error);
    },
    () => { },
    []
  );

  useAsync<ModuleType[]>(
    async () => {
      let types = cache.get<ModuleType[]>("module_types");
      if (types) {
        return types;
      }
      types = await moduleTypeService.getModuleTypes();
      cache.set("module_types", types);
      return types;
    },
    (data) => {
      setModuleTypes(data);
    },
    (error) => {
      console.error(error);
    },
    () => { },
    []
  );

  // ==================================================================

  const refreshSectionals = () => {
    sectionalService.getSectionals().then(setSectionals);
    cache.set("sectionals", sectionals);
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
