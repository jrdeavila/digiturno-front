import ModuleConfigForm from "@/components/module-config-form";
import styled, { keyframes } from "styled-components";

export default function ModuleConfigPage() {
  return (
    <ModuleConfigFormContainer>
      <ModuleConfigForm />
    </ModuleConfigFormContainer>
  );
}

const moduleConfigFormKeyframes = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

const ModuleConfigFormContainer = styled.div`
  z-index: 100;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  #module-config-form {
    width: 40rem;
    height: 30rem;
    animation: ${moduleConfigFormKeyframes} 1s forwards;
  }
`;
