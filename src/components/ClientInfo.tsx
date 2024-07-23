import useShifts from "@/hooks/operator/use-shifts";
import React from "react";
import { Modal } from "react-bootstrap";
import "../styles/ClientInfo.css";
import GenericComponent from "./GenericComponent";

const ClientInfo: React.FC = () => {
  const { currentShift } = useShifts();
  return currentShift ? (
    <GenericComponent
      title="Cliente en Atención"
      customClass={`generic-component-client-info`}
    >
      <section className="section-client-info">
        <div className="container-texto-y-botones">
          <div className="container-cedula-cliente">
            <p>C.C. {"1.003.316.620"}</p>
          </div>

          <p className="name-client-attention">
            {"Jose Ricardo De Avila Moreno"}
          </p>
        </div>

        <div className="temporizador">
          <div className="time-section">
            <p className="text">Hora de Inicio:</p>
            <p className="time"> {"10:00:20  PM"} </p>
          </div>

          <div className="time-section">
            <p className="text">Tiempo transcurrido:</p>
            <p className="time"> {"10:30:10 OM"} </p>
          </div>
        </div>

        <div className="botones-client-info">
          <button className="button attended">
            <i className="fas fa-check"></i>
            ATENDIDO
          </button>
          <button className="button transfer">
            <i className="fas fa-exchange-alt"></i>
            TRANSFERIR
          </button>
        </div>

        <Modal show={false} backdrop="static" keyboard={false}>
          <Modal.Header>
            <Modal.Title>Procesando</Modal.Title>
          </Modal.Header>
          <Modal.Body>Esperando calificación...</Modal.Body>
        </Modal>
      </section>
    </GenericComponent>
  ) : null;
};

export default ClientInfo;
