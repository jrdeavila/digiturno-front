import useAsync from "@/hooks/use-async";
import useAttentionProfileService from "@/hooks/use-attention-profile-service";
import useCache from "@/hooks/use-cache";
import useMyModule from "@/hooks/use-my-module";
import AttentionProfile from "@/models/attention-profile";
import { createContext, useContext, useEffect, useState } from "react";

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
  const cache = useCache();

  // ==============================================================================

  useEffect(() => {
    console.log("Attention Profile Provider mounted");
  }, [])



  // ==============================================================================

  useAsync<AttentionProfile[]>(
    async () => {
      if (!myModule) return [];
      let ap = cache.get<AttentionProfile[]>("attention_profiles");
      if (ap) {
        return ap;
      }
      ap = await attentionProfileService.getAll(myModule.ipAddress);
      cache.set("attention_profiles", ap);
      return ap;
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
    cache.set("attention_profiles", attentionProfiles);
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
