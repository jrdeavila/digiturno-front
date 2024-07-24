import { timeToQualify } from "@/config/qualification";
import { useConfigureModule } from "@/hooks/use-my-module";
import { Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import { useEffect } from "react";

const WaitingClientQualification: React.FC<{
  onQualified: (qualification: number) => void;
}> = ({ onQualified }) => {
  const { onListenQualification, removeListener } = useConfigureModule();
  // ==============================================================================

  useEffect(() => {
    const timeout = setTimeout(() => {
      onQualified(0);
    }, timeToQualify);
    return () => {
      clearTimeout(timeout);
    };
  }, [onQualified]);

  useEffect(() => {
    onListenQualification((qualification) => {
      onQualified(qualification);
    });
    return () => {
      removeListener((qualification) => {
        onQualified(qualification);
      });
    };
  }, [onQualified]);

  // ==============================================================================

  return (
    <Card id="waiting-qualification-card">
      <CardHeader className="flex items-center justify-center">
        <span className="text-lg font-bold">
          ESPERANDO CALIFICACIÓN DEL CLIENTE
        </span>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col gap-3 h-full">
          <Spinner label="Esperando calificación..." />
        </div>
      </CardBody>
    </Card>
  );
};
export default WaitingClientQualification;
