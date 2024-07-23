import ClientInfo from "@/components/ClientInfo";
import ModuleDistracted from "@/components/ModuleDistracted";
import ModuleInfo from "@/components/ModuleInfo";
import ModuleStatus from "@/components/ModuleStatus";
import OperatorViewHeader from "@/components/OperatorViewHeader";
import ServiceList from "@/components/ServiceList";
import WaitingClients from "@/components/WaitingClients";
import "@/styles/OperatorView.css";
import { createContext } from "react";
import { Button, Modal } from "react-bootstrap";

interface Distracted {
  id: number;
  cedula: number;
  nombre: string;
  tipoCliente: string;
  estado: string;
}

interface Client {
  //Se definen el tipo de variables que resivira del .json
  id: number;
  cedula: number;
  nombre: string;
  tipoCliente: string;
  estado: string;
}

export const TurnoContext = createContext<{
  setClienteEnAtencion: (cliente: Client | null) => void;
  isWaitingClientsDisabled: boolean;
  setIsWaitingClientsDisabled: (value: boolean) => void;
  isClientInfoDisabled: boolean;
  setIsClientInfoDisabled: (value: boolean) => void;
  isModuleDistractedDisabled: boolean;
  setIsModuleDistractedDisabled: (value: boolean) => void;
  estadoModulo: string;
  setEstadoModulo: (value: string) => void;
  estiloModulo: string;
  setEstiloModulo: (value: string) => void;
  mardarClienteAEspera: (cliente: Distracted) => void;
}>({
  setClienteEnAtencion: () => {},
  isWaitingClientsDisabled: false,
  setIsWaitingClientsDisabled: () => {},
  isClientInfoDisabled: true,
  setIsClientInfoDisabled: () => {},
  isModuleDistractedDisabled: false,
  setIsModuleDistractedDisabled: () => {},
  estadoModulo: "LIBRE",
  setEstadoModulo: () => {},
  estiloModulo: "estilo-estado-libre",
  setEstiloModulo: () => {},
  mardarClienteAEspera: () => {},
});

const OperatorPage: React.FC = () => {
  return (
    <>
      <div className="operator-view no-select">
        <OperatorViewHeader />
        <div className="main-content">
          <div className="left-column">
            <ModuleInfo />
            <ServiceList />
          </div>
          <div className="center-column">
            <ClientInfo />
            <WaitingClients />
          </div>
          <div className="right-column">
            <ModuleStatus />
            <ModuleDistracted />
          </div>
        </div>

        <Modal
          show={false}
          onHide={() => {}}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Conectar Dispositivo Calificador</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Es necesario conectar el dispositivo calificador para continuar.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => {}}>
              Conectar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default OperatorPage;
