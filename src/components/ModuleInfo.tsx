import React from "react";
import "../styles/ModuleInfo.css";
import "./GenericComponent";
import GenericComponent from "./GenericComponent";
import useMyModule from "@/hooks/use-my-module";

const ModuleInfo: React.FC = () => {
  const { myModule, attentionProfile } = useMyModule();
  return (
    <GenericComponent customClass="generic-component-module-info">
      <section className="module-info">
        <div className="icon-computer">
          <i className="fas fa-desktop"></i>
        </div>

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
