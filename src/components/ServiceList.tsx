import React from "react";
import "./GenericComponent";
import GenericComponent from "./GenericComponent";
import useMyModule from "@/hooks/use-my-module";

const ServiceList: React.FC = () => {
  const { attentionProfile } = useMyModule();
  return (
    <GenericComponent title="Servicios">
      <ul className="list-disc">
        {attentionProfile?.services.map((service) => (
          <li key={service.id} className="flex flex-row gap-x-3">
            <input type="checkbox" id={`service${service.id}`} />
            <label htmlFor={`service${service.id}`}>{service.name}</label>
          </li>
        ))}
      </ul>
    </GenericComponent>
  );
};

export default ServiceList;
