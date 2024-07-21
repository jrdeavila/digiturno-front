import { useConfigureModule } from "@/hooks/use-my-module";
import { faPlug } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import styled, { keyframes } from "styled-components";

const ModalRequestQualificationModule: React.FC = () => {
  const { requestQualificationModule } = useConfigureModule();
  return (
    <StyledCard id="modal-request-qualification-module">
      <CardHeader>
        <span className="text-2xl font-bold">
          CONFIGURAR MÓDULO DE CALIFICACIÓN
        </span>
      </CardHeader>
      <CardBody>
        <p>
          Para poder continuar, es necesario conectar el módulo de calificación.
        </p>
      </CardBody>
      <CardFooter>
        <Button onClick={requestQualificationModule} className="w-full">
          <div className="flex flex-row items-center">
            <FontAwesomeIcon icon={faPlug} className="mr-2" />
            <span className="font-bold ">Conectar módulo de calificación</span>
          </div>
        </Button>
      </CardFooter>
    </StyledCard>
  );
};

const ConfigureQualificationModuleContainer = styled.div`
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
  width: 40rem;
  height: 15rem;
  animation: ${transitionCard} 0.5s ease;
`;

export default function ConfigureQualificationModulePage() {
  return (
    <ConfigureQualificationModuleContainer>
      <ModalRequestQualificationModule />
    </ConfigureQualificationModuleContainer>
  );
}
