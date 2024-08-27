import { useEffect, useState } from "react";

const TimeClockAnimation = ({ createdAt }: { createdAt: Date }) => {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - createdAt.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      setTime(`${hours}h ${minutes % 60}m ${seconds % 60}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt]);

  return <span>{time}</span>;
};

export default TimeClockAnimation;
