import React, { useContext, useState } from "react";
import GenericComponent from "./GenericComponent";
import "../styles/ModuleStatus.css";
import { Button, Modal, Form, ModalTitle } from "react-bootstrap";
import { TurnoContext } from "@/pages/operator";

const ModuleStatus: React.FC = () => {
  const { estadoModulo, setEstadoModulo, estiloModulo, setEstiloModulo } =
    useContext(TurnoContext);
  const [switchActivado, setSwitchActivado] = useState<boolean>(false); // Estado para controlar el switch - Inicia activado
  const [modalAbierto, setModalAbierto] = useState<boolean>(false); // Estado para controlar el modal - Inicia cerrado
  // const [mostrarMotivosAusencia, setMostrarMotivosAusencia] = useState<boolean>(true); // Estado para mostrar motivos de ausencia
  const [motivoSeleccionado, setMotivoSeleccionado] = useState<string>(""); // Estado para el motivo seleccionado de la ausencia

  // Función para manejar el click del switch
  const handleSwitchClick = () => {
    if (estadoModulo === "LIBRE") {
      setEstadoModulo("AUSENTE"); // Cambiamos el estado a AUSENTE
      setEstiloModulo("estilo-estado-ausente"); // Aplicamos los estilos de AUSENTE
      setSwitchActivado(true); // Activamos el Switsh
      setModalAbierto(true); // Mostramos el modal
      setMotivoSeleccionado(""); // Reseteamos el motivo seleccionado paar seleccionar una opción nueva
      // setMostrarMotivosAusencia(true); // Mostramos motivos de ausencia
    } else if (estadoModulo === "AUSENTE") {
      setEstadoModulo("LIBRE"); // Cambiamos el estado del modulo a LIBRE
      setEstiloModulo("estilo-estado-libre"); // Aplicamos los estilos a LIBRE
      setSwitchActivado(false); // Desactivamos el Switch
      setModalAbierto(false); // Cerramos el modal}
      // setMostrarMotivosAusencia(false); // Cerramos motivos de Ausencia
    }
  };

  // Función para manejar cambios en los input de tipo radio
  const handleMotivoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMotivoSeleccionado(event.target.value);
  };

  // Función para envíar el motivo de la ausencia
  const EnviarMotivosAusencia = async () => {
    // Aquí enviarías el motivo al backend
    // Ejemplo:
    // await fetch('/api/motivo-ausencia', {
    //   method: 'POST',
    //   body: JSON.stringify({ motivo: selectedMotivo }),
    // });

    // setMostrarMotivosAusencia(false); // Ocultamos motivos y mostramos finalizar ausencia
    handleSwitchClick(); // Se ejecuta la función para cerra el modal y activar el estado libre
  };

  const closeModal = () => {
    setEstadoModulo("LIBRE");
    setEstiloModulo("estilo-estado-libre");
    setSwitchActivado(false); // El switch
    setModalAbierto(false); // cerramos el modal
    // setMostrarMotivosAusencia(true);  // Reseteamos para mostrar motivos en el próximo clic
  };

  return (
    <>
      <GenericComponent
        title="Estado Modulo"
        rightComponent={
          estadoModulo !== "OCUPADO" ? (
            <div
              className={`switch ${
                switchActivado ? "switch-on" : "switch-off"
              }`}
              onClick={handleSwitchClick}
            >
              <div className="switch-toggle" />
            </div>
          ) : null
        }
        customClass="generic-component-module-status"
      >
        <section className="module-status-content">
          <p className={estiloModulo}>{estadoModulo}</p>
        </section>
      </GenericComponent>

      <Modal
        show={modalAbierto}
        onHide={closeModal}
        centered
        backdrop="static"
        keyboard={false}
        className="module-status-modal"
      >
        {/* {mostrarMotivosAusencia ? ( */}
        <>
          <Modal.Header className="modal-status-modal-header">
            <ModalTitle>Motivo de Ausencia</ModalTitle>
          </Modal.Header>

          <Modal.Body className="module-status-modal-body">
            <p>¿Cuál es el motivo de la ausencia? Por favor selecciónelo:</p>
            <Form className="modal-form">
              {[
                "Ir al baño",
                "Consulta Interna",
                "Pausas Activas",
                "Tramite Interno",
              ].map((motivo) => (
                <Form.Check
                  type="radio"
                  label={motivo}
                  name="motivoAusencia"
                  value={motivo}
                  key={motivo}
                  checked={motivoSeleccionado === motivo}
                  onChange={handleMotivoChange}
                />
              ))}
            </Form>
          </Modal.Body>

          <Modal.Footer className="module-status-modal-footer">
            <Button
              onClick={EnviarMotivosAusencia}
              disabled={!motivoSeleccionado}
            >
              Enviar
            </Button>
          </Modal.Footer>
        </>
        {/* ) : (
           <>
             <Modal.Body className="module-status-modal-body">
               <ModalTitle>El modulo está AUSENTE</ModalTitle>
             </Modal.Body>
             <Modal.Footer className="module-status-modal-footer">
               <Button onClick={closeModal}>
                 Finalizar Ausencia
              </Button>
             </Modal.Footer>
           </>
         )} */}
      </Modal>
    </>
  );
};

export default ModuleStatus;
