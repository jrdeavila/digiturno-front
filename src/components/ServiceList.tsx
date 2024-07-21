import React from "react";
import "./GenericComponent";
import GenericComponent from "./GenericComponent";
import "@/styles/ServiceList.css";
import useMyModule from "@/hooks/use-my-module";

const ServiceList: React.FC = () => {
  const { attentionProfile } = useMyModule();
  return (
    <GenericComponent
      title="Servicios"
      customClass="generic-component-service-list"
    >
      <ul className="list-disc">
        {attentionProfile?.services.map((service) => (
          <li key={service.id}>
            <label htmlFor={`service${service.id}`}>{service.name}</label>
          </li>
        ))}
      </ul>
    </GenericComponent>
  );
};

export default ServiceList;
