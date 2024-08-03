import { toast } from "react-toastify";
import { useSpeechSynthesis } from "react-speech-kit";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

const VoiceCtx = createContext<{ speak: (text: string) => void } | undefined>(undefined);

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queue, setQueue] = useState<string[]>([]);
  const { speak: speakSynthesis, speaking, supported, voices } = useSpeechSynthesis();

  const mxVoice = voices.find((v: { lang: string; default: boolean; }) => v.lang === "es-MX" && !v.default);


  const handleSpeak = useCallback(() => {
    if (!supported) {
      toast.error("Tu navegador no soporta la síntesis de voz");
      return;
    }

    if (!speaking && queue.length > 0) {
      const [text, ...rest] = queue;
      speakSynthesis({
        text,
        voice: mxVoice,

      });
      setQueue(rest);
    }
  }, [queue, speaking]);

  useEffect(() => {
    handleSpeak();
  }, [queue, handleSpeak]);

  const speak = (text: string) => {
    setQueue((prev) => [...prev, text]);
  };


  return (
    <VoiceCtx.Provider value={{ speak }}>
      {children}
    </VoiceCtx.Provider>

  )
}




export default function useVoice() {
  const ctx = useContext(VoiceCtx);
  if (!ctx) {
    throw new Error("useVoice must be used within a VoiceProvider");
  }
  return ctx;
}

