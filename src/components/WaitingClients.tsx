import { Shift } from "@/hooks/operator/use-http-shifts-service";
import useModuleShifts from "@/hooks/operator/use-module-shifts";
import { useClientTypeResource } from "@/providers/client-type-provider";
import "@fortawesome/free-solid-svg-icons";
import {
  faArrowUp,
  faBullhorn,
  faFrown,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/react-fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider } from "@nextui-org/react";
import React from "react";
import "../styles/WaitingClients.css";
import GenericComponent from "./GenericComponent";

const WaitingClients: React.FC = () => {
  const { shifts } = useModuleShifts();

  return (
    <GenericComponent title="Clientes en Espera">
      <section className="section-waiting-clients">
        {shifts.map((shift, i) => (
          <ShiftDetail shift={shift} index={i} key={i} />
        ))}
      </section>
    </GenericComponent>
  );
};

const ShiftDetail: React.FC<{ shift: Shift; index: number }> = ({
  shift,
  index,
}) => {
  const { clientTypes } = useClientTypeResource();
  const { attendClient, sendToDistracted, callClient, moveToUpShift } =
    useModuleShifts();
  return (
    <div className="flex-flex-col">
      <div className="w-full flex flex-row gap-x-1">
        <div className="indice-turno">
          <p>{index + 1}</p>
        </div>

        <div className="flex flex-col w-full">
          <p className="text-2xl font-bold">{shift.client.name}</p>
          <p className="text-xl">
            {
              clientTypes.filter((ct) => ct.slug === shift.client.clientType)[0]
                .name
            }
          </p>
        </div>

        {
          // Only if the first shift
          index === 0 ? (
            <div className="flex flex-row gap-x-2 p-1">
              <button
                onClick={() => callClient(shift)}
                className="bg-orange-500 rounded-lg w-12 h-12 text-white hover:scale-105 transform transition-all"
              >
                <FontAwesomeIcon icon={faBullhorn} />
              </button>

              <button
                onClick={() => sendToDistracted(shift)}
                className="bg-red-600 rounded-lg w-12 h-12 text-white hover:scale-105 transform transition-all"
              >
                <FontAwesomeIcon icon={faFrown} />
              </button>

              <button
                className="bg-primary-700 rounded-lg w-12 h-12 text-white hover:scale-105 transform transition-all"
                onClick={() => attendClient(shift)}
              >
                <FontAwesomeIcon icon={faUpload} />
              </button>
            </div>
          ) : (
            <div className="flex flex-row gap-x-2 p-1">
              <button
                onClick={() => moveToUpShift(shift)}
                className="bg-primary-700 rounded-lg w-12 h-12 text-white hover:scale-105 transform transition-all"
              >
                <FontAwesomeIcon icon={faArrowUp} />
              </button>
            </div>
          )
        }
      </div>
      <Divider
        className="w-full"
        style={{ marginTop: "1rem", marginBottom: "1rem" }}
      />
    </div>
  );
};

export default WaitingClients;
