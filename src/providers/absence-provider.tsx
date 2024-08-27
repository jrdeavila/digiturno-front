import useAbsenceService from "@/hooks/use-absence-service";
import useAsync from "@/hooks/use-async";
import useAuth from "@/hooks/use-auth";
import { Attendant } from "@/hooks/use-authentication-service";
import { Absence } from "@/services/absence-service";
import { createContext, useContext, useState } from "react";
import styled, { keyframes } from "styled-components";

interface AbsenceContextType {
  absences: Absence[];
  openModal: () => void;
  closeModal: () => void;
  createAbsence: (absence: Absence, attendant: Attendant) => void;
  backToWork: (attendant: Attendant) => void;
}

const AbsenceCtx = createContext<AbsenceContextType | undefined>(undefined);

const AbsenceProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [showModal, setShowModal] = useState(false);
  // ================================================================

  const absenceService = useAbsenceService();

  // ================================================================

  useAsync<Absence[]>(
    async () => {
      return absenceService.getAbsences();
    },
    (data) => {
      setAbsences(data);
    },
    (error) => {
      console.error(error);
    },
    undefined,
    []
  );

  // ================================================================

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCreateAbsence = async (
    absence: Absence,
    attendant: Attendant
  ) => {
    await absenceService.createAbsence(absence.id, attendant.id);
    setShowModal(false);
  };

  const handleBackToWork = async (attendant: Attendant) => {
    await absenceService.backToWork(attendant.id);
  };

  // ================================================================
  return (
    <AbsenceCtx.Provider
      value={{
        absences,
        openModal: handleOpenModal,
        closeModal: handleCloseModal,
        createAbsence: handleCreateAbsence,
        backToWork: handleBackToWork,
      }}
    >
      {children}
      {showModal && <AbsenceModal />}
    </AbsenceCtx.Provider>
  );
};

export const useAbsence = () => {
  const ctx = useContext(AbsenceCtx);
  if (!ctx) {
    throw new Error("useAbsence must be used within AbsenceProvider");
  }
  return ctx;
};

const AbsenceModal: React.FC = () => {
  const { absences, closeModal, createAbsence } = useAbsence();
  const [selectedAbsence, setSelectedAbsence] = useState<Absence | null>(null);
  const { attendant } = useAuth();

  // ================================================================

  const handleSelectAbsence = (absenceId: number) => {
    setSelectedAbsence(
      absences.find((absence) => absence.id === absenceId) || null
    );
  };

  const handleCreateAbsence = () => {
    if (selectedAbsence && attendant) {
      createAbsence(selectedAbsence, attendant);
    }
  };

  const handleCancel = () => {
    closeModal();
  };

  // ================================================================

  return (
    <ModalContainer>
      <div id="waiting-qualification-card" className="bg-white p-4 rounded-lg">
        <h1 className="text-xl font-bold">Motivos de ausencia</h1>
        <ul>
          {absences.map((absence) => (
            <li key={absence.id} className="flex flex-row items-center gap-x-2">
              <input
                type="radio"
                name="absence"
                value={absence.id}
                onChange={() => handleSelectAbsence(absence.id)}
              />
              <label> {absence.name} </label>
            </li>
          ))}
        </ul>
        <div className="flex flex-row justify-end">
          <button
            onClick={handleCreateAbsence}
            className="bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Aceptar
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
          >
            Cancelar
          </button>
        </div>
      </div>
    </ModalContainer>
  );
};

const transitionKeyframes = keyframes`
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ModalContainer = styled.div`
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.5);

  #waiting-qualification-card {
    animation: ${transitionKeyframes} 0.3s;
  }
`;

export default AbsenceProvider;
