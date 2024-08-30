import useModuleShifts from "@/hooks/operator/use-module-shifts";
import useMyModule from "@/hooks/use-my-module";
import AttentionProfile from "@/models/attention-profile";
import { useAttentionProfileResource } from "@/providers/attention-profile-provider";
import { Switch } from "@nextui-org/react";
import React, { useCallback, useEffect, useState } from "react";
import "./GenericComponent";
import GenericComponent from "./GenericComponent";

const ServiceList: React.FC = () => {
  const [attentionProfile, setAttentionProfile] = useState<
    AttentionProfile | undefined
  >(undefined);

  // ==============================================================================

  const { myModule } = useMyModule();
  const { setServices, services } = useModuleShifts();
  const { attentionProfiles } = useAttentionProfileResource();

  // ==============================================================================

  useEffect(() => {
    const ap = attentionProfiles.find(
      (ap) => ap.id === myModule?.attentionProfileId
    );
    if (ap) {
      setAttentionProfile(ap);
    }
  }, [attentionProfiles, myModule]);

  // ==============================================================================

  // ==============================================================================

  const renderServices = useCallback(() => {
    return attentionProfile?.services.map((service) => (
      <li key={service.id} className="flex flex-row gap-x-3 my-1">
        <Switch
          isSelected={services?.some((s) => s.id === service.id)}
          onChange={(event) => {
            if (event.target.checked) {
              setServices && setServices([...(services || []), service]);
            } else {
              setServices &&
                setServices(services?.filter((s) => s.id !== service.id));
            }
          }}
        />
        <label htmlFor={`service${service.id}`}>{service.name}</label>
      </li>
    ));
  }, [attentionProfile?.services, services]);

  // ==============================================================================

  return (
    <GenericComponent title="Servicios">
      <ul className="list-disc">{renderServices()}</ul>
    </GenericComponent>
  );
};

export default ServiceList;
