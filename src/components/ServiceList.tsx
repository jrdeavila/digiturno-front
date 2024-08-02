import useShifts from "@/hooks/operator/use-shifts";
import useMyModule from "@/hooks/use-my-module";
import Service from "@/models/service";
import { Switch } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import "./GenericComponent";
import GenericComponent from "./GenericComponent";

const ServiceList: React.FC = () => {

  const [currentServices, setCurrentServices] = useState<Service[] | undefined>(undefined);

  // ==============================================================================

  const { attentionProfile } = useMyModule();
  const { setServices } = useShifts();

  // ==============================================================================

  useEffect(() => {
    if (currentServices) {
      setServices(currentServices);
    }
  }, [currentServices])

  // ==============================================================================

  return (
    <GenericComponent title="Servicios">
      <ul className="list-disc">
        {attentionProfile?.services.map((service) => (
          <li key={service.id} className="flex flex-row gap-x-3 my-1">
            <Switch
              checked={currentServices?.some((s) => s.id === service.id)}
              onChange={(event) => {
                if (event.target.checked) {
                  setCurrentServices([...(currentServices || []), service]);
                } else {
                  setCurrentServices(currentServices?.filter((s) => s.id !== service.id));
                }
              }}
            />
            <label htmlFor={`service${service.id}`}>{service.name}</label>
          </li>
        ))}
      </ul>
    </GenericComponent>
  );
};

export default ServiceList;
