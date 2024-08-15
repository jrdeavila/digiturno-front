import { Shift } from "@/hooks/operator/use-http-shifts-service";
import useReceptorShifts from "@/hooks/operator/use-receptor-shifts";
import { faCancel, faPaperPlane, faPerson, faUsersSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useCallback, useEffect, useState } from "react";

const ShiftList = () => {

  const { shifts, cancelShift } = useReceptorShifts();
  const [filterShifts, setFilterShifts] = useState<Shift[]>([]);

  useEffect(() => {
    setFilterShifts(shifts.filter(shift => shift.state == "pending" || shift.state == "pending-transferred"));
  }, [shifts])

  const columns = [
    {
      key: 'id',
      title: "Tipo de atención",
    },
    {
      key: 'client',
      title: "Cliente",
    },
    {
      key: 'attentionProfile',
      title: "Perfil de atención",
    },
    {
      key: 'state',
      title: "Estado",
    },
    {
      key: "cancel",
      title: "Cancelar",
    }
  ]

  const renderClientType = useCallback((shift: Shift) => {
    return {
      processor: <div className="flex flex-row gap-x-1 items-center">
        <FontAwesomeIcon icon={faPaperPlane} color="orange" />
        <span className="font-bold">
          Tramitador
        </span>
      </div>,
      preferential: <div className="flex flex-row gap-x-1 items-center">
        <FontAwesomeIcon icon={faPaperPlane} color="primary" />
        <span className="font-bold">
          Preferencial
        </span>
      </div>,
      standard: <div className="flex flex-row gap-x-1 items-center">
        <FontAwesomeIcon icon={faPaperPlane} color="green" />
        <span className="font-bold">
          Estándar
        </span>
      </div>,

    }[shift.client.clientType]



  }, [shifts])

  const renderState = useCallback((shift: Shift) => {
    return {
      pending: <div className="flex flex-row gap-x-1 items-center">
        <FontAwesomeIcon className="text-yellow-500" icon={
          faPerson
        } />
        <span>
          Pendiente
        </span>
      </div>,
      in_progress: <div className="flex flex-row gap-x-1 items-center">
        <FontAwesomeIcon className="text-blue-500" icon={
          faPerson
        } />
        <span>
          En atención
        </span>
      </div>,

      transferred: <div className="flex flex-row gap-x-1 items-center">
        <FontAwesomeIcon className="text-blue-500" icon={
          faPerson
        } />
        <span>
          Transferido
        </span>
      </div>,

      "pending-transferred": <div className="flex flex-row gap-x-1 items-center">
        <FontAwesomeIcon className="text-blue-500" icon={
          faPerson
        } />
        <span>
          Transferido pendiente
        </span>
      </div>,
      distracted: <div className="flex flex-row gap-x-1 items-center">
        <FontAwesomeIcon className="text-blue-500" icon={
          faPerson
        } />
        <span>
          Distraído
        </span>
      </div>,

      completed: <div className="flex flex-row gap-x-1 items-center">
        <FontAwesomeIcon className="text-green-500" icon={
          faPerson
        } />
        <span>
          Completado
        </span>
      </div>,
      canceled: <div className="flex flex-row gap-x-1 items-center">
        <FontAwesomeIcon className="text-red-500" icon={
          faPerson
        } />
        <span>
          Cancelado
        </span>
      </div>,
      qualified: <div className="flex flex-row gap-x-1 items-center">
        <FontAwesomeIcon className="text-green-500" icon={
          faPerson
        } />
        <span>
          Calificado
        </span>
      </div>,
    }[shift.state]
  }, [shifts])

  const renderCell = useCallback(
    (shift: Shift, column: {
      key: string;
      title: string;
    }) => {
      switch (column.key) {
        case 'id':
          return renderClientType(shift);
        case 'client':
          return <div className="flex flex-col gap-y-1">
            <span className="font-bold">
              {shift.client.name}
            </span>
            <span>
              {shift.client.dni}
            </span>
          </div>;
        case 'attentionProfile':
          return <div className="flex flex-col gap-y-1 ">
            <span>{shift.attentionProfile}</span>
            <span>{shift.module ?? "No Asignado"}</span>

          </div>;
        case 'state': {
          const dateCreatedAt = new Date(shift.createdAt);
          return <div className="flex flex-col gap-y-1">
            {renderState(shift)}
            <TimeClockAnimation createdAt={dateCreatedAt} />
          </div>
        }
        case 'cancel':
          return <button onClick={() => cancelShift(shift)}>
            <div className="flex flex-row gap-x-2 items-center">
              <FontAwesomeIcon icon={faCancel} color="red" />
              <span>
                Cancelar
              </span>
            </div>
          </button>
        default:
          return null
      }
    }, [shifts]
  )

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
      <TableHeader
        columns={columns} >
        {(column) => (
          <TableColumn
            allowsSorting={true}
            allowsResizing={true}
            key={column.key}>{column.title}</TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={
          <div className="flex flex-col items-center justify-center h-full w-full">
            <FontAwesomeIcon icon={faUsersSlash} size="3x" />
            <p>No hay turnos</p>
          </div>
        }
        items={filterShifts}>
        {
          (shift) => (
            <TableRow key={shift.id}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {renderCell(shift, column)}
                </TableCell>
              ))}

            </TableRow>
          )
        }
      </TableBody>
    </Table>
  )
}

const TimeClockAnimation = ({ createdAt }: { createdAt: Date }) => {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - createdAt.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      setTime(`${hours}h ${minutes % 60}m ${seconds % 60}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt])

  return <span>{time}</span>

}


export default ShiftList;