import { useAttentionProfileResource } from "@/providers/attention-profile-provider";
import { Room } from "@/services/room-service";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled, { keyframes } from "styled-components";
import useAsync from "../use-async";
import { ModuleProvider } from "../use-module";
import useMyModule from "../use-my-module";
import useRoomService from "../use-room-service";
import useEcho from "./use-echo";
import { AttentionProfile } from "./use-http-attention-profile-service";
import useHttpShiftService, {
  Shift,
  ShiftResponse,
  shiftResponseToModel,
} from "./use-http-shifts-service";

interface ReceptorShiftCtxProps {
  shifts: Shift[];
  distractedShifts: Shift[];
  editingShift: Shift | null;
  modifyShift: (shift: Shift) => void;
  transferToAnotherRoom: (shift: Shift) => void;
  transferToAnotherModule: (shift: Shift) => void;
  cancelShift: (shift: Shift) => void;
}

const ReceptorShiftsContext = createContext<ReceptorShiftCtxProps | undefined>(
  undefined
);

export const ReceptorShiftsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [distractedShifts, setDistractedShifts] = useState<Shift[]>([]);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [editingName, setEditingName] = useState<boolean>(false);
  const [editingRoom, setEditingRoom] = useState<boolean>(false);
  const [editingModule, setEditingModule] = useState<boolean>(false);

  // ==============================================================================

  const { myModule } = useMyModule();
  // ==============================================================================

  const echo = useEcho();
  const shiftService = useHttpShiftService();

  // ==============================================================================

  useAsync<Shift[]>(
    async () => {
      if (!myModule) return [];
      return shiftService.getShiftsByRoom(
        myModule!.room.id,
        myModule!.ipAddress
      );
    },
    (shifts) => {
      setShifts(shifts);
    },
    (error) => {
      console.error(error);
    },
    () => { },
    [myModule]
  );

  useAsync<Shift[]>(
    async () => {
      if (!myModule) return [];
      return shiftService.getDistractedShiftsByModule(
        myModule!.room.id,
        myModule!.ipAddress
      );
    },
    (shifts) => {
      setDistractedShifts(shifts);
    },
    (error) => {
      console.error(error);
    },
    () => { },
    [myModule]
  );

  useEffect(() => {
    const orderByPreferential = (prevShifts: Shift[], shift: Shift) => {
      if (prevShifts.find((s) => s.id === shift.id)) {
        return prevShifts.map((s) =>
          s.id === shift.id
            ? {
              ...s,
              state: "pending",
            }
            : s
        );
      }
      if (shift.client.clientType === "preferential") {
        const preferential = prevShifts.filter(
          (s) => s.client.clientType === "preferential"
        );
        const normals = prevShifts.filter(
          (s) => s.client.clientType !== "preferential"
        );
        return [...preferential, shift, ...normals];
      } else {
        return [...prevShifts, shift];
      }
    };

    if (!myModule) return;

    const roomShiftChannelName = `rooms.${myModule?.room.id}.shifts`;

    // ======================================== ROOM CHANNEL ========================================

    echo
      .channel(roomShiftChannelName)
      .listen(".shift.distracted", (data: { shift: ShiftResponse }) => {
        const shift = shiftResponseToModel(data.shift);

        setShifts((prevShifts) =>
          prevShifts.map((s) => {
            if (s.id !== shift.id) return s;
            return {
              ...s,
              state: "distracted",
            };
          })
        );
      });

    echo
      .channel(roomShiftChannelName)
      .listen(".shift.created", (data: { shift: ShiftResponse }) => {
        const shift = shiftResponseToModel(data.shift);
        setShifts((prevShifts) => orderByPreferential(prevShifts, shift));
      });

    echo
      .channel(roomShiftChannelName)
      .listen(".shift.pending", (data: { shift: ShiftResponse }) => {
        const shift = shiftResponseToModel(data.shift);
        setShifts((prevShifts) => orderByPreferential(prevShifts, shift));
      });

    echo
      .channel(roomShiftChannelName)
      .listen(".shift.deleted", (data: { shift: ShiftResponse }) => {
        setShifts((prevShifts) =>
          prevShifts.filter((shift) => shift.id !== data.shift.id)
        );
      });

    echo
      .channel(roomShiftChannelName)
      .listen(".shift.transferred", (data: { shift: ShiftResponse }) => {
        setShifts((prevShifts) =>
          prevShifts.map((shift) => {
            if (shift.id !== data.shift.id) return shift;
            return {
              ...shift,
              state: "transferred",
            };
          })
        );
      });

    echo
      .channel(roomShiftChannelName)
      .listen(".shift.qualified", (data: { shift: ShiftResponse }) => {
        setShifts((prevShifts) =>
          prevShifts.map((shift) => {
            if (shift.id !== data.shift.id) return shift;
            return {
              ...shift,
              state: "qualified",
            };
          })
        );
      });

    echo
      .channel(roomShiftChannelName)
      .listen(".shift.in-progress", (data: { shift: ShiftResponse }) => {
        setShifts((prevShifts) => {
          // Change state to in-progress
          return prevShifts.map((shift) => {
            if (shift.id !== data.shift.id) return shift;
            return {
              ...shift,
              state: "in_progress",
            };
          });
        });
      });

    return () => {
      echo.leave(roomShiftChannelName);
    };
  }, [myModule]);

  // ==============================================================================

  const cancelShift = async (shift: Shift) => {
    await shiftService.deleteShift(shift.id, myModule!.ipAddress);
    toast.success("Turno cancelado");
  };

  const modifyShift = async (shift: Shift) => {
    setEditingShift(shift);
    setEditingName(true);
  };

  const transferToAnotherRoom = async (shift: Shift) => {
    setEditingShift(shift);
    setEditingRoom(true);
  };

  const transferToAnotherModule = async (shift: Shift) => {
    setEditingShift(shift);
    setEditingModule(true);
  };

  const handleChangeShiftName = async (name: string) => {
    let shift: Shift = {
      ...editingShift!,
      client: {
        ...editingShift!.client,
        name,
      },
    };
    shift = await shiftService.updateShift(shift, myModule!.ipAddress);
    setShifts((prev) => prev.map((s) => (s.id === shift.id ? shift : s)));
    toast.success("El turno ha sido modificado con éxito");
  };

  const handleChangeShiftRoom = async (room: Room) => {
    const shift = {
      ...editingShift!,
      roomId: room.id,
    };
    await shiftService.updateShift(shift, myModule!.ipAddress);
    setShifts((prev) => prev.filter((s) => s.id != editingShift?.id));
    toast.success("El turno se ha enviado a otra sala");
  };
  const handleChangeShiftModule = async (
    attentionProfile: AttentionProfile
  ) => {
    let shift: Shift = {
      ...editingShift!,
      attentionProfileId: attentionProfile.id,
    };
    shift = await shiftService.updateShift(shift, myModule!.ipAddress);

    setShifts((prev) => prev.map((s) => (s.id === shift.id ? shift : s)));
  };

  // ==============================================================================

  return (
    <ReceptorShiftsContext.Provider
      value={{
        shifts,
        editingShift,
        distractedShifts,
        cancelShift,
        modifyShift,
        transferToAnotherRoom,
        transferToAnotherModule,
      }}
    >
      {children}
      {editingShift && editingName && (
        <EditNameModal
          onClose={() => {
            setEditingShift(null);
            setEditingName(false);
          }}
          onUpdate={handleChangeShiftName}
        />
      )}
      {editingShift && editingRoom && (
        <EditRoomModal
          onClose={() => {
            setEditingShift(null);
            setEditingRoom(false);
          }}
          onUpdate={handleChangeShiftRoom}
        />
      )}
      {editingShift && editingModule && (
        <ModuleProvider>
          <EditAttentionProfileModal
            onClose={() => {
              setEditingShift(null);
              setEditingModule(false);
            }}
            onUpdate={handleChangeShiftModule}
          />
        </ModuleProvider>
      )}
    </ReceptorShiftsContext.Provider>
  );
};

const ModalContainer = styled.div`
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
`;

const transitionCard = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  } 
`;

const StyledCard = styled(Card)`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  width: 500px;
  animation: ${transitionCard} 0.3s;
`;

const EditNameModal: React.FC<{
  onClose: () => void;
  onUpdate: (name: string) => void;
}> = ({ onClose, onUpdate }) => {
  const { editingShift } = useReceptorShifts();
  const [name, setName] = useState<string>(editingShift?.client.name || "");
  return (
    <ModalContainer>
      <StyledCard>
        <CardHeader>
          <h1>Editar nombre</h1>
        </CardHeader>
        <CardBody>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Nombre"
            placeholder="Nombre"
            className="w-full"
          />
          <div className="flex flex-row gap-x-2">
            <button
              onClick={onClose}
              className="w-full bg-red-500 text-white rounded-lg p-2 mt-2"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onUpdate(name);
                onClose();
              }}
              className="w-full bg-blue-500 text-white rounded-lg p-2 mt-2"
            >
              Guardar
            </button>
          </div>
        </CardBody>
      </StyledCard>
    </ModalContainer>
  );
};

const EditRoomModal: React.FC<{
  onClose: () => void;
  onUpdate: (room: Room) => void;
}> = ({ onClose, onUpdate }) => {
  const [room, setRoom] = useState<Room | undefined>(undefined);
  const [rooms, setRooms] = useState<Room[]>([]);
  // =======================================================

  const roomService = useRoomService();
  // =======================================================

  const { myModule } = useMyModule();

  // =======================================================

  useAsync<Room[]>(
    async () => {
      const rooms = await roomService.getRooms();
      return rooms.filter(
        (r) =>
          r.sectionalId === myModule?.room.branch_id && r.id != myModule.room.id
      );
    },
    (rooms) => {
      setRooms(rooms);
    },
    (error) => {
      console.error(error);
    },
    () => { },
    [myModule?.room.branch_id, myModule?.room.id]
  );

  // =======================================================
  return (
    <ModalContainer>
      <StyledCard>
        <CardHeader>
          <h1>Editar sala</h1>
        </CardHeader>
        <CardBody>
          <Select
            label="Sala"
            name="room"
            placeholder="Seleccione una sala"
            onChange={(e) => {
              setRoom(rooms.find((r) => r.id.toString() === e.target.value));
            }}
          >
            {rooms.map((room) => (
              <SelectItem key={room.id} value={room.id} textValue={room.name}>
                {room.name}
              </SelectItem>
            ))}
          </Select>

          <div className="flex flex-row gap-x-2">
            <button
              onClick={onClose}
              className="w-full bg-red-500 text-white rounded-lg p-2 mt-2"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                room && onUpdate(room);
                onClose();
              }}
              className="w-full bg-blue-500 text-white rounded-lg p-2 mt-2"
            >
              Guardar
            </button>
          </div>
        </CardBody>
      </StyledCard>
    </ModalContainer>
  );
};

const EditAttentionProfileModal: React.FC<{
  onClose: () => void;
  onUpdate: (attentionProfile: AttentionProfile) => void;
}> = ({ onClose, onUpdate }) => {
  const { attentionProfiles, refreshAttentionProfiles } =
    useAttentionProfileResource();
  const [attentionProfile, setAttentionProfile] = useState<
    AttentionProfile | undefined
  >(undefined);
  const { editingShift } = useReceptorShifts();

  // ==============================================================
  useEffect(() => {
    refreshAttentionProfiles();
  }, []);

  // ==============================================================

  return (
    <ModalContainer>
      <StyledCard>
        <CardHeader>
          <h1>Editar Perfil de atención</h1>
        </CardHeader>
        <CardBody>
          <Select
            label="Módulo"
            name="module"
            placeholder="Seleccione un perfil de atención"
            onChange={(e) => {
              setAttentionProfile(
                attentionProfiles.find(
                  (ap) => ap.id.toString() === e.target.value
                )
              );
            }}
          >
            {attentionProfiles
              .filter((ap) => ap.id != editingShift?.attentionProfileId)
              .map((ap) => (
                <SelectItem key={ap.id} value={ap.id} textValue={ap.name}>
                  {ap.name}
                </SelectItem>
              ))}
          </Select>

          <div className="flex flex-row gap-x-2">
            <button
              onClick={onClose}
              className="w-full bg-red-500 text-white rounded-lg p-2 mt-2"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                attentionProfile && onUpdate(attentionProfile);
                onClose();
              }}
              className="w-full bg-blue-500 text-white rounded-lg p-2 mt-2"
            >
              Guardar
            </button>
          </div>
        </CardBody>
      </StyledCard>
    </ModalContainer>
  );
};

export default function useReceptorShifts() {
  const context = useContext(ReceptorShiftsContext);
  if (!context) {
    throw new Error(
      "useReceptorShifts must be used within a ReceptorShiftsProvider"
    );
  }
  return context;
}
