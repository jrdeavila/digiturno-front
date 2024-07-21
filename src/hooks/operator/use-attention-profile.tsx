import { useState } from "react";
import useHttpAttentionProfileService, {
  AttentionProfile,
} from "./use-http-attention-profile-service";
import useAsync from "../use-async";

interface AttentionProfileCtxProps {
  attentionProfiles: AttentionProfile[];
  refreshAttentionProfiles: () => void;
  getAttentionProfile: (id: number) => AttentionProfile | undefined;
}

const useAttentionProfiles: () => AttentionProfileCtxProps = () => {
  const [attentionProfiles, setAttentionProfiles] = useState<
    AttentionProfile[]
  >([]);
  const attentionProfileService = useHttpAttentionProfileService();

  // ==================================================================

  useAsync<AttentionProfile[]>(
    async () => {
      return attentionProfileService.getAttentionProfiles();
    },
    (data) => {
      setAttentionProfiles(data);
    },
    (error) => {
      console.error(error);
    },
    () => {},
    []
  );

  // ==================================================================

  const refreshAttentionProfiles = () => {
    attentionProfileService.getAttentionProfiles().then((attentionProfiles) => {
      setAttentionProfiles(attentionProfiles);
    });
  };

  // ==================================================================

  const getAttentionProfile = (id: number) => {
    return attentionProfiles.find(
      (attentionProfile) => attentionProfile.id === id
    );
  };

  // ==================================================================

  return {
    attentionProfiles,
    refreshAttentionProfiles,
    getAttentionProfile,
  };
};

export default useAttentionProfiles;
