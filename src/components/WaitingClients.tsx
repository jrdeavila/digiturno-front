import useShifts from "@/hooks/operator/use-shifts";
import "@fortawesome/free-solid-svg-icons";
import {
  faBullhorn,
  faFrown,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/react-fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "../styles/WaitingClients.css";
import GenericComponent from "./GenericComponent";

const WaitingClients: React.FC = () => {
  const { shifts } = useShifts();
  return (
    <GenericComponent
      title="Clientes en Espera"
      rightComponent={
        <div className="right-component-waiting-clients">
          <input
            type="text"
            placeholder="Buscar cédula o nombre"
            className="input-buscador"
          />
          <div className="number-client-waiting">{shifts.length}</div>
        </div>
      }
      customClass={`generic-component-waiting-clients`}
    >
      <section className="section-waiting-clients">
        {shifts.map((shift, i) => (
          <div className="container-cliente-espera" key={shift.id}>
            <div className="indice-turno">
              <p>{i + 1}</p>
            </div>

            <div className="cliente-espera">
              <p>{shift.client.name}</p>
            </div>

            {i === 0 && (
              <div className="container-buttons">
                <button className="llamar-cliente-pantalla">
                  <FontAwesomeIcon icon={faBullhorn} />
                </button>

                <button className="mandar-distraidos" onClick={() => {}}>
                  <FontAwesomeIcon icon={faFrown} />
                </button>

                <button
                  className="subir-cliente"
                  onClick={() => {}}
                  disabled={true}
                >
                  <FontAwesomeIcon icon={faUpload} />
                </button>
              </div>
            )}
          </div>
        ))}
      </section>
    </GenericComponent>
  );
};

export default WaitingClients;
