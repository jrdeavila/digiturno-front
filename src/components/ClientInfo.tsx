import useModuleShifts from "@/hooks/operator/use-module-shifts";
import { dateFormatter } from "@/utils/date";
import {
  faCheck,
  faExchangeAlt,
  faFrown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useMemo } from "react";
import styled from "styled-components";
import GenericComponent from "./GenericComponent";
import TimeClockAnimation from "./time-clock-animation";

const ClientInfo: React.FC = () => {
  const { currentShift, completeShift, onTransfer, sendToDistracted } =
    useModuleShifts();

  const renderStartDate = useMemo(() => {
    // 2024-07-25T02:22:30.000000Z
    const date = currentShift?.updatedAt;
    return <div className="text-4xl font-bold">{dateFormatter(date)}</div>;
  }, [currentShift]);

  const time = currentShift?.updatedAt
    ? new Date(currentShift.updatedAt)
    : new Date();

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
            {renderStartDate}
          </div>

          <div className="flex flex-col justify-center items-center">
            <p className="text">Tiempo transcurrido:</p>
            <div className="text-4xl font-bold">
              <TimeClockAnimation createdAt={time} />
            </div>
          </div>
        </div>

        <div className="flex-grow"></div>

        <div className="flex flex-col gap-y-3 flex-wrap items-center w-full">
          <div className="w-full">
            <ButtonGradient onClick={() => completeShift(currentShift)}>
              <FontAwesomeIcon icon={faCheck} className="mr-2" />
              ATENDIDO
            </ButtonGradient>
          </div>
          <div className="w-full">
            <ButtonGradient onClick={onTransfer}>
              <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />
              TRANSFERIR
            </ButtonGradient>
          </div>
          <div className="w-full">
            <ButtonGradient
              color="#a31d1d"
              onClick={() => sendToDistracted(currentShift)}
            >
              <FontAwesomeIcon icon={faFrown} className="mr-2" />
              DISTRAÍDO
            </ButtonGradient>
          </div>
        </div>
      </section>
    </GenericComponent>
  ) : null;
};

export default ClientInfo;

const ButtonGradient = styled.button<{
  color?: string;
}>`
  background-color: ${(props) => props.color || "var(--bg-primary)"};
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 5px;
  font-weight: 700;
  width: 100%;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1.1rem;
  &:hover {
    transform: scale(1.05);
  }
`;
