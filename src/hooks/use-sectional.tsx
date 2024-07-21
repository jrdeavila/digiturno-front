import { Sectional } from "@/services/sectional-service";
import { useState } from "react";
import useAsync from "./use-async";
import useSectionalService from "./use-sectional-service";
import useRoomService from "./use-room-service";
import { Room } from "@/services/room-service";
import {
  faArrowLeftLong,
  faCashRegister,
  faLaptop,
  faTv,
} from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface ModuleType {
  id: number;
  name: string;
  icon: IconProp;
}

export default function useSectional() {
  const [sectionals, setSectionals] = useState<Sectional[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [moduleTypes] = useState<ModuleType[]>([
    {
      id: 1,
      name: "Caja",
      icon: faCashRegister,
    },
    {
      id: 2,
      name: "Recepción",
      icon: faLaptop,
    },
    {
      id: 3,
      name: "Pantalla",
      icon: faTv,
    },
    {
      id: 4,
      name: "Modulo sucursal",
      icon: faArrowLeftLong,
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

  return {
    sectionals,
    roomsBySectional,
    rooms,
    refreshSectionals,
    moduleTypes,
    filterRooms,
  };
}
