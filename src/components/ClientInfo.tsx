import useShifts from "@/hooks/operator/use-shifts";
import { faCheck, faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import GenericComponent from "./GenericComponent";
import styled from "styled-components";

const ClientInfo: React.FC = () => {
  const { currentShift, completeShift, transferShift } = useShifts();
  return currentShift ? (
    <GenericComponent title="CLIENTE EN ATENCIÓN">
      <section className="flex flex-col gap-y-3 h-full w-full justify-stretch items-center p-5">
        <div className="flex flex-col justify-center items-center">
          <div className="text font-bold">
            <p>C.C. {currentShift.client.dni}</p>
          </div>

          <p className="text-2xl font-bold">{currentShift.client.name}</p>
        </div>

        <div className="flex-grow"></div>

        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex flex-col justify-center items-center">
            <p className="text">Hora de Inicio:</p>
            <p className="text-3xl font-bold"> {"10:00:20  PM"} </p>
          </div>

          <div className="flex flex-col justify-center items-center">
            <p className="text">Tiempo transcurrido:</p>
            <p className="text-3xl font-bold"> {"10:30:10 OM"} </p>
          </div>
        </div>

        <div className="flex-grow"></div>

        <div className="flex flex-row justify-evenly items-center w-full">
          <ButtonGradient onClick={() => completeShift(currentShift)}>
            <FontAwesomeIcon icon={faCheck} className="mr-2" />
            ATENDIDO
          </ButtonGradient>
          <ButtonGradient onClick={() => transferShift(currentShift)}>
            <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />
            TRANSFERIR
          </ButtonGradient>
        </div>
      </section>
    </GenericComponent>
  ) : null;
};

export default ClientInfo;

const ButtonGradient = styled.button`
  background: linear-gradient(90deg, var(--bg-blue-400), var(--bg-blue-300));
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1.5rem;
  &:hover {
    transform: scale(1.05);
  }
`;
