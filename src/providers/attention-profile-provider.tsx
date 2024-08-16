import useAsync from "@/hooks/use-async";
import useAttentionProfileService from "@/hooks/use-attention-profile-service";
import useMyModule from "@/hooks/use-my-module";
import AttentionProfile from "@/models/attention-profile";
import { createContext, useContext, useState } from "react";

const AttentionProfileContext = createContext<{
  attentionProfiles: AttentionProfile[];
  loading: boolean;
  refreshAttentionProfiles: () => Promise<void>;
}>({
  attentionProfiles: [],
  loading: false,
  refreshAttentionProfiles: async () => { },
});

export const useAttentionProfileResource = () => {
  const attentionProfileResource = useContext(AttentionProfileContext);
  if (!attentionProfileResource) {
    throw new Error("AttentionProfile resource is not available");
  }
  return attentionProfileResource;
};

const AttentionProfileProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [attentionProfiles, setAttentionProfiles] = useState<
    AttentionProfile[]
  >([]);

  const [loading] = useState<boolean>(false);
  const { myModule } = useMyModule();

  const attentionProfileService = useAttentionProfileService();

  // ==============================================================================

  useAsync<AttentionProfile[]>(
    async () => {
      if (!myModule) return [];
      return await attentionProfileService.getAll(myModule.ipAddress);
    },
    (data) => {
      return setAttentionProfiles(data);
    },
    (error) => console.error(error),
    undefined,
    [myModule]
  );

  // ==============================================================================

  const refreshAttentionProfiles = async () => {
    if (!myModule) return;
    const attentionProfiles = await attentionProfileService.getAll(myModule.ipAddress);
    setAttentionProfiles(attentionProfiles);
  };

  // ==============================================================================

  return (
    <AttentionProfileContext.Provider
      value={{
        attentionProfiles,
        loading,
        refreshAttentionProfiles,
      }}
    >
      {children}
    </AttentionProfileContext.Provider>
  );
};
export default AttentionProfileProvider;
