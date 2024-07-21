import "@fortawesome/free-solid-svg-icons";
import "@fortawesome/react-fontawesome";
import React from "react";
import "../styles/WaitingClients.css";
import GenericComponent from "./GenericComponent";
import { Shift } from "@/services/shift-service";

const WaitingClients: React.FC<{
  shifts: Shift[];
}> = ({ shifts }) => {
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
                  <i className="fas fa-bullhorn"></i>{" "}
                  {/* Botón para llamar cliente */}
                </button>

                <button className="mandar-distraidos" onClick={() => {}}>
                  <i className="fas fa-frown"></i>
                </button>

                <button
                  className="subir-cliente"
                  onClick={() => {}}
                  disabled={true}
                >
                  <i className="fas fa-upload"></i>
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
