import AttentionProfile from "@/models/attention-profile";
import Service from "@/models/service";

export interface ServiceResponse {
  id: number;
  name: string;
}

export interface AttentionProfileResponse {
  id: number;
  name: string;
  services: ServiceResponse[];
}

export const mapService = (service: ServiceResponse): Service => {
  return new Service(service.id, service.name);
};

export const mapAttentionProfile = (
  attentionProfile: AttentionProfileResponse
): AttentionProfile => {
  return new AttentionProfile(
    attentionProfile.id,
    attentionProfile.name,
    attentionProfile.services.map(mapService)
  );
};

export const mapServiceResponse = (service: Service): ServiceResponse => {
  return {
    id: service.id,
    name: service.name,
  };
};
