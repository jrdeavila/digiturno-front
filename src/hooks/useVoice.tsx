import { useEffect, useState } from "react";

export default function useVoice() {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    setVoices(voices);

    const voice = voices.find((v) => v.lang === "es-ES");
    if (voice) {
      console.log("Voice found", voice);
      setVoice(voice);
    }
  }, []);

  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.voice = voice;
    synth.speak(utterThis);
  };

  return { voices, voice, speak };
}
