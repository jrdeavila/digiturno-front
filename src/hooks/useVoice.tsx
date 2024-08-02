import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function useVoice() {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadVoices();

    return () => {
      const synth = window.speechSynthesis;
      synth.cancel();
    }
  }, []);

  const loadVoices = async () => {
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    setVoices(voices);


    const voice = voices.find((v) => v.lang === "es-ES");
    if (voice) {
      setLoaded(true);
      setVoice(voice);
    }
  }

  const speak = (text: string) => {
    if (!loaded) toast.error("No se ha cargado la voz");
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.voice = voice;
    synth.speak(utterThis);
  };

  return { voices, voice, speak };
}
