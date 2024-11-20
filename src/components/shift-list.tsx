import { Shift } from "@/hooks/operator/use-http-shifts-service";
import useReceptorShifts from "@/hooks/operator/use-receptor-shifts";
import {
  faCancel,
  faCog,
  faPaperPlane,
  faPerson,
  faUsersSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useCallback, useEffect, useState } from "react";
import TimeClockAnimation from "./time-clock-animation";

const ShiftList = () => {
  const {
    shifts,
    cancelShift,
    transferToAnotherRoom,
    transferToAnotherModule,
    modifyShift,
  } = useReceptorShifts();
  const [filterShifts, setFilterShifts] = useState<Shift[]>([]);

  useEffect(() => {
    setFilterShifts(
      shifts.filter(
        (shift) =>
          shift.state == "pending" || shift.state == "pending-transferred"
      )
    );
  }, [shifts]);

  const columns = [
    {
      key: "id",
      title: "Tipo de atención",
    },
    {
      key: "client",
      title: "Cliente",
    },
    {
      key: "attentionProfile",
      title: "Perfil de atención",
    },
    {
      key: "state",
      title: "Estado",
    },
    {
      key: "actions",
      title: "Acciones",
    },
  ];

  const renderClientType = useCallback(
    (shift: Shift) => {
      return {
        processor: (
          <div className="flex flex-row gap-x-1 items-center">
            <FontAwesomeIcon icon={faPaperPlane} color="orange" />
            <span className="font-bold">Tramitador</span>
          </div>
        ),
        preferential: (
          <div className="flex flex-row gap-x-1 items-center">
            <FontAwesomeIcon icon={faPaperPlane} color="primary" />
            <span className="font-bold">Preferencial</span>
          </div>
        ),
        standard: (
          <div className="flex flex-row gap-x-1 items-center">
            <FontAwesomeIcon icon={faPaperPlane} color="green" />
            <span className="font-bold">Estándar</span>
          </div>
        ),
      }[shift.client.clientType];
    },
    [shifts]
  );

  const renderState = useCallback(
    (shift: Shift) => {
      return {
        pending: (
          <div className="flex flex-row gap-x-1 items-center">
            <FontAwesomeIcon className="text-yellow-500" icon={faPerson} />
            <span>Pendiente</span>
          </div>
        ),
        in_progress: (
          <div className="flex flex-row gap-x-1 items-center">
            <FontAwesomeIcon className="text-blue-500" icon={faPerson} />
            <span>En atención</span>
          </div>
        ),

        transferred: (
          <div className="flex flex-row gap-x-1 items-center">
            <FontAwesomeIcon className="text-blue-500" icon={faPerson} />
            <span>Transferido</span>
          </div>
        ),

        "pending-transferred": (
          <div className="flex flex-row gap-x-1 items-center">
            <FontAwesomeIcon className="text-blue-500" icon={faPerson} />
            <span>Transferido pendiente</span>
          </div>
        ),
        distracted: (
          <div className="flex flex-row gap-x-1 items-center">
            <FontAwesomeIcon className="text-blue-500" icon={faPerson} />
            <span>Distraído</span>
          </div>
        ),

        completed: (
          <div className="flex flex-row gap-x-1 items-center">
            <FontAwesomeIcon className="text-green-500" icon={faPerson} />
            <span>Completado</span>
          </div>
        ),
        canceled: (
          <div className="flex flex-row gap-x-1 items-center">
            <FontAwesomeIcon className="text-red-500" icon={faPerson} />
            <span>Cancelado</span>
          </div>
        ),
        qualified: (
          <div className="flex flex-row gap-x-1 items-center">
            <FontAwesomeIcon className="text-green-500" icon={faPerson} />
            <span>Calificado</span>
          </div>
        ),
      }[shift.state];
    },
    [shifts]
  );

  const renderCell = useCallback(
    (
      shift: Shift,
      column: {
        key: string;
        title: string;
      }
    ) => {
      switch (column.key) {
        case "id":
          return renderClientType(shift);
        case "client":
          return (
            <div className="flex flex-col gap-y-1">
              <span className="font-bold">{shift.client.name}</span>
              <span>{shift.client.dni}</span>
            </div>
          );
        case "attentionProfile":
          return (
            <div className="flex flex-col gap-y-1 ">
              <span>{shift.attentionProfile}</span>
            </div>
          );
        case "state": {
          const dateCreatedAt = new Date(shift.createdAt);
          return (
            <div className="flex flex-col gap-y-1">
              {renderState(shift)}
              <TimeClockAnimation createdAt={dateCreatedAt} />
            </div>
          );
        }
        case "actions":
          return (
            <Popover>
              <PopoverTrigger>
                <Button>
                  <div className="flex flex-row items-center gap-x-1">
                    <span>Acciones</span>
                    <FontAwesomeIcon icon={faCog} />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="w-full flex flex-col gap-y-1">
                  {[
                    {
                      label: "Cancelar",
                      onClick: () => cancelShift(shift),
                      icon: faCancel,
                      color: "text-red-500",
                      enabled: true,
                    },
                    {
                      label: "Transferir a otra sala",
                      onClick: () => transferToAnotherRoom(shift),
                      icon: faPaperPlane,
                      color: "text-blue-500",
                      enabled: true,
                    },
                    {
                      label: "Cambiar perfil de atención",
                      onClick: () => transferToAnotherModule(shift),
                      icon: faPaperPlane,
                      color: "text-blue-500",
                      enabled: true,
                    },
                    {
                      label: "Modificar",
                      onClick: () => modifyShift(shift),
                      icon: faCog,
                      color: "text-orange-500",
                      enabled: true,
                    },
                  ]
                    .filter((action) => action.enabled)
                    .map((action) => (
                      <div
                        key={action.label}
                        onClick={action.onClick}
                        className="w-full hover:bg-gray-300 rounded-lg px-4 py-3 cursor-pointer select-none"
                      >
                        <div className="flex flex-row gap-x-1 items-center w-full">
                          <FontAwesomeIcon
                            icon={action.icon}
                            className={action.color}
                          />
                          <span className={action.color}>{action.label}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </PopoverContent>
            </Popover>
          );
        default:
          return null;
      }
    },
    [shifts]
  );

  // Height 100% overflow-y-auto
  return (
    <Table
      isStriped
      classNames={{
        table: "rounded-none border-none",
        base: "border-none h-full w-full rounded-none",
        wrapper: "h-full rounded-none shadow-none bg-transparent",
        tbody: "overflow-y-auto",
        sortIcon: "bg-gray-200",
        th: "uppercase",
        emptyWrapper: "h-full",
      }}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            allowsSorting={true}
            allowsResizing={true}
            key={column.key}
          >
            {column.title}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={
          <div className="flex flex-col items-center justify-center h-full w-full">
            <FontAwesomeIcon icon={faUsersSlash} size="3x" />
            <p>No hay turnos</p>
          </div>
        }
        items={filterShifts}
      >
        {(shift) => (
          <TableRow key={shift.id}>
            {columns.map((column) => (
              <TableCell key={column.key}>
                {renderCell(shift, column)}
              </TableCell>
            ))}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ShiftList;
