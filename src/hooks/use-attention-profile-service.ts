import AttentionProfileService from "@/services/attention-profile-service";
import useHttpClient from "./use-http-client";

export default function useAttentionProfileService() {
  return new AttentionProfileService(useHttpClient());
}
