import useAuth from "@/hooks/use-auth";
import useMyModule from "@/hooks/use-my-module";
import { faBook, faDesktop, faPerson, faSignOut, faToilet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useMemo, useState } from "react";
import GenericComponent from "./GenericComponent";
import { Button } from "@nextui-org/react";
import { useAbsence } from "@/providers/absence-provider";
import AttentionProfile from "@/models/attention-profile";
import { useAttentionProfileResource } from "@/providers/attention-profile-provider";
import CasesModal from "@/components/CasesModal"; 

const ModuleInfo: React.FC = () => {
  const { myModule } = useMyModule();
  const { attendant, logout } = useAuth(); 
  const { openModal, backToWork } = useAbsence();
  const [attentionProfile, setAttentionProfile] = useState<AttentionProfile | undefined>(undefined);

  const { attentionProfiles } = useAttentionProfileResource();

  useEffect(() => {
    const ap = attentionProfiles.find((ap) => ap.id === myModule?.attentionProfileId);
    if (ap) {
      setAttentionProfile(ap);
    }
  }, [attentionProfiles, myModule]);

  const at = attentionProfiles.find((ap) => ap.id === myModule?.attentionProfileId);
  const isAJ = useMemo(() => at?.name === "ASESORIA JURIDICA", [at]);


  const moduleStatus = useMemo(() => {
    switch (myModule?.status) {
      case "offline":
        return (
          <div className="flex flex-row gap-x-2 items-center text-gray-700">
            <FontAwesomeIcon icon={faDesktop} />
            <span> Desconectado </span>
          </div>
        );
      case "online":
        return (
          <div className="flex flex-row gap-x-2 items-center text-green-600">
            <FontAwesomeIcon icon={faDesktop} />
            <span> Conectado </span>
          </div>
        );
      default:
        return (
          <div className="flex flex-row gap-x-2 items-center">
            <FontAwesomeIcon icon={faDesktop} />
            <span> Desconocido </span>
          </div>
        );
    }
  }, [myModule]);

  const attendantStatus = useMemo(() => {
    switch (attendant?.status) {
      case "free":
        return (
          <div className="flex flex-row gap-x-2 items-center text-green-600">
            <FontAwesomeIcon icon={faPerson} />
            <span> Disponible </span>
          </div>
        );
      case "offline":
        return (
          <div className="flex flex-row gap-x-2 items-center text-gray-700">
            <FontAwesomeIcon icon={faPerson} />
            <span> Desconectado </span>
          </div>
        );
      case "busy":
        return (
          <div className="flex flex-row gap-x-2 items-center text-blue-600">
            <FontAwesomeIcon icon={faPerson} />
            <span> Ocupado </span>
          </div>
        );
      case "absent":
        return (
          <div className="flex flex-row gap-x-2 items-center text-yellow-600">
            <FontAwesomeIcon icon={faPerson} />
            <span> Ausente </span>
          </div>
        );
      default:
        return (
          <div className="flex flex-row gap-x-2 items-center">
            <FontAwesomeIcon icon={faPerson} />
            <span> Desconocido </span>
          </div>
        );
    }
  }, [attendant]);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);


  const handleOpenCaseModal = () => {
    setIsModalOpen(true);
  };

  return (
    <GenericComponent
      title="INFORMACIÓN DEL MODULO"
      rightComponent={<FontAwesomeIcon icon={faDesktop} />}
    >
      <div className="flex flex-col gap-y-1 h-full">
        <p className="text-2xl font-bold"> {myModule?.name} </p>
        <p className="text-xl"> {attendant?.name} </p>
        <p className="text-sm font-bold"> {attentionProfile?.name} </p>

        <div className="flex flex-row gap-x-1 items-center justify-between">
          {moduleStatus}
          {attendantStatus}
        </div>

        <div className="flex-grow"></div>
        <div className="flex flex-row items-center flex-wrap justify-stretch gap-3">
          <Button
            style={{
              backgroundColor: "#00204D",
            }}
            className="text-white font-bold"
            onClick={logout}
          >
            <div className="flex flex-row gap-x-4 items-center">
              <FontAwesomeIcon icon={faSignOut} />
              <span> SALIR DEL SISTEMA </span>
            </div>
          </Button>

          {attendant?.status === "absent" ? (
            <Button
              onClick={() => backToWork(attendant)}
              className="bg-green-700 text-white font-bold"
            >
              <FontAwesomeIcon icon={faToilet} />
              <span> VOLVER A TRABAJAR </span>
            </Button>
          ) : (
            <Button
              onClick={openModal}
              className="bg-red-700 text-white font-bold"
            >
              <FontAwesomeIcon icon={faToilet} />
              <span> AUSENTARSE </span>
            </Button>
          )}
          {isAJ && (
            <Button
              onClick={handleOpenCaseModal}
              className="bg-blue-700 text-white font-bold"
            >
              <FontAwesomeIcon icon={faBook} />
              <span> VER CASO </span>
            </Button>
          )}

          {isAJ && (
            <CasesModal
              isOpen={isModalOpen}
              onClose={closeModal}
              cases={[]}
              loading={false}
              error={null} onSave={function (caseData: { id: number; caseNumber: string; subject: string; attendedBy: string; username: string; identification: string; recordType: string; documentType: string; creationDate: string; modificationDate: string; observation: string; }): void {
                throw new Error("Function not implemented.");
              } } onDelete={function (id: number): void {
                throw new Error("Function not implemented.");
              } }            />
          )}
        </div>
      </div>
    </GenericComponent>
  );
};

export default ModuleInfo;
