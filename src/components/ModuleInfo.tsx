import useMyModule from "@/hooks/use-my-module";
import { faDesktop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import GenericComponent from "./GenericComponent";

const ModuleInfo: React.FC = () => {
  const { myModule, attentionProfile } = useMyModule();
  return (
    <GenericComponent
      title="INFORMACIÓN DEL MODULO"
      rightComponent={<FontAwesomeIcon icon={faDesktop} />}
    >
      <section className="module-info">
        <div className="module">
          <p className="text-2xl text-white"> {myModule?.name} </p>
          <p className="text-white"> {myModule?.ipAddress} </p>
          <p className="text-white font-bold"> {attentionProfile?.name} </p>
        </div>
      </section>
    </GenericComponent>
  );
};

export default ModuleInfo;
