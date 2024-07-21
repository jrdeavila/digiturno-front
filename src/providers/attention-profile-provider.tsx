import useAsync from "@/hooks/use-async";
import useAttentionProfileService from "@/hooks/use-attention-profile-service";
import AttentionProfile from "@/models/attention-profile";
import { createContext, useContext, useState } from "react";

const AttentionProfileContext = createContext<{
  attentionProfiles: AttentionProfile[];
  loading: boolean;
  refreshAttentionProfiles: () => Promise<void>;
}>({
  attentionProfiles: [],
  loading: false,
  refreshAttentionProfiles: async () => {},
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

  const attentionProfileService = useAttentionProfileService();

  // ==============================================================================

  useAsync<AttentionProfile[]>(
    () => {
      return attentionProfileService.getAll();
    },
    (data) => setAttentionProfiles(data),
    (error) => console.error(error),
    undefined,
    []
  );

  // ==============================================================================

  const refreshAttentionProfiles = async () => {
    const attentionProfiles = await attentionProfileService.getAll();
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
