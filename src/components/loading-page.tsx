import { Spinner } from "@nextui-org/react";
import styled from "styled-components";

const LoadingPage = () => {
  return (
    <LoadingContainer>
      <Spinner label="Cargando..." />
    </LoadingContainer>
  );
};

const LoadingContainer = styled.div`
  z-index: 100000;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f3f3f3;
`;
export default LoadingPage;
