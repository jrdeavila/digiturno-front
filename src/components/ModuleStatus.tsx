import { faDesktop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled from "styled-components";
import "../styles/ModuleStatus.css";
import GenericComponent from "./GenericComponent";

const ModuleStatus: React.FC = () => {
  return (
    <>
      <GenericComponent
        title="Estado Modulo"
        rightComponent={<FontAwesomeIcon icon={faDesktop} />}
      >
        <div className="flex h-full w-full justify-center items-center">
          <ModuleStatusButtonGradient>
            {"DISPONIBLE"}
          </ModuleStatusButtonGradient>
        </div>
      </GenericComponent>
    </>
  );
};

const ModuleStatusButtonGradient = styled.button`
  background: linear-gradient(
    90deg,
    var(--bg-green-300) 0%,
    var(--bg-green-400) 100%
  );
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    transform: scale(1.1);
  }
  font-size: 1.5rem;
`;
export default ModuleStatus;
