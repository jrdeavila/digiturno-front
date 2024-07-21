import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons"; // Importar el ícono faClock
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Importar FontAwesomeIcon
import React from "react"; // Eliminado useState
import "../styles/ModuleDistracted.css";
import GenericComponent from "./GenericComponent";
import { Shift } from "@/services/shift-service";

const ModuleDistracted: React.FC<{
  distractedShifts: Shift[];
}> = ({ distractedShifts }) => {
  return (
    <GenericComponent
      title="Distraidos"
      rightComponent={
        <div className="number-distracted-clients">
          {distractedShifts.length}
        </div>
      }
      customClass="generic-component-module-distracted"
    >
      <section className={`section-module-distracted`}>
        {distractedShifts.map((shift) => (
          <div className="container-module-distracted" key={shift.id}>
            <p className="nombre-cliente-distraido">{shift.client.name}</p>

            <button className="btn-mandar-cliente-a-espera">
              <FontAwesomeIcon icon={faArrowCircleLeft} />{" "}
              {/* Botón con ícono de esperar */}
            </button>
          </div>
        ))}
      </section>
    </GenericComponent>
  );
};

export default ModuleDistracted;
