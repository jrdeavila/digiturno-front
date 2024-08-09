import AttentionProfile from "@/models/attention-profile";
import { useAttentionProfileResource } from "@/providers/attention-profile-provider";
import { useCreateShift } from "@/providers/create-shift-provider";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useRef, useState } from "react";

const AttentionProfileList = () => {
  const { attentionProfiles } = useAttentionProfileResource();
  const [filterAP, setFilterAP] = useState<AttentionProfile[]>([]);
  const ref = useRef<HTMLInputElement>(null);
  const { setAttentionProfile } = useCreateShift();

  // ==================================================================================================================

  useEffect(() => {
    setFilterAP(attentionProfiles);
  }, [attentionProfiles]);

  // ==================================================================================================================

  const handleSearch = () => {
    const value = ref.current?.value;
    if (!value) {
      setFilterAP(attentionProfiles);
      return;
    }
    setFilterAP(attentionProfiles.filter(attentionProfile => attentionProfile.name.toLowerCase().includes(value!.toLowerCase())));
  }

  // ==================================================================================================================


  return (
    <div className="flex flex-col p-4 gap-y-2 w-full h-full">
      <h1 className="font-bold text-2xl">Perfiles de atención</h1>
      <input ref={ref} onChange={handleSearch} className="border-b-2 border-black text-black outline-none focus:ring-0 focus:outline-none  bg-transparent placeholder:text-black py-1" type="text" placeholder="Buscar perfil de atención" />
      <div className="flex flex-col gap-y-2 overflow-y-auto">
        {filterAP.map((attentionProfile) => (
          <div key={attentionProfile.id} className="flex flex-row items-center gap-x-2">
            <input type="radio" name="attentionProfile" id={attentionProfile.id.toString()} onClick={() => {
              setAttentionProfile(attentionProfile);
            }} />
            <label htmlFor={attentionProfile.id.toString()}>{attentionProfile.name}</label>
          </div>
        ))}
      </div>
    </div>
  )

}

export default AttentionProfileList;