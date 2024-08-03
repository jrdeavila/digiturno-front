import useShifts from "@/hooks/operator/use-shifts";
import { faCheck, faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useMemo, useState } from "react";
import GenericComponent from "./GenericComponent";
import styled from "styled-components";
import { dateFormatter } from "@/utils/date";

const ClientInfo: React.FC = () => {
  const { currentShift, completeShift, onTransfer } = useShifts();

  const renderCreatedDate = useMemo(() => {
    // 2024-07-25T02:22:30.000000Z
    const date = currentShift?.createdAt;
    return <div className="text-4xl font-bold">{dateFormatter(date)}</div>;
  }, [currentShift]);

  const time = useMemo(() => {
    return new Date();
  }, []);

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
            {renderCreatedDate}
          </div>

          <div className="flex flex-col justify-center items-center">
            <p className="text">Tiempo transcurrido:</p>
            <TemporaryComponent initial={time} />
          </div>
        </div>

        <div className="flex-grow"></div>

        <div className="flex flex-row justify-stretch gap-x-3 flex-wrap items-center w-full">
          <ButtonGradient onClick={() => completeShift(currentShift)}>
            <FontAwesomeIcon icon={faCheck} className="mr-2" />
            ATENDIDO
          </ButtonGradient>
          <ButtonGradient onClick={onTransfer}>
            <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />
            TRANSFERIR
          </ButtonGradient>
        </div>
      </section>
    </GenericComponent>
  ) : null;
};

const TemporaryComponent: React.FC<{
  initial: Date;
}> = ({ initial }) => {
  const [now, setNow] = useState(new Date());

  // Update time every second
  // Get the difference between the current time and the initial time
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date(new Date().getTime() - initial.getTime()));
    }, 1000);

    return () => clearInterval(interval);
  }, [initial]);

  // Render mm:ss
  return (
    <div className="text-4xl font-bold">{`${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`}</div>

  );
};

export default ClientInfo;

const ButtonGradient = styled.button`
  background-color: var(--bg-primary);
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
