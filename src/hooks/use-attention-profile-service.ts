import AttentionProfileService from "@/services/attention-profile-service";
import useHttpClient from "./operator/use-http-client";

export default function useAttentionProfileService() {
  return new AttentionProfileService(useHttpClient());
}
