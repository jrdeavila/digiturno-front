import SearchClient from "@/components/search-client";
import ServiceList from "@/components/service-list";
import DefaultLayout from "@/layouts/default";
import CreateShiftProvider, {
  useCreateShift,
} from "@/providers/create-shift-provider";
import { Button } from "@nextui-org/button";

export default function SectionalModulePage() {
  return (
    <DefaultLayout>
      <CreateShiftProvider>
        <div className="grid grid-cols-1 grid-row-4 lg:grid-cols-4 gap-3 h-full">
          <div className="lg:col-span-4">
            <h1 className="text-3xl font-bold">Reservar turno</h1>
            <p className="text-lg">
              Bienvenido a nuestro sistema de reserva de turnos. Por favor,
              seleccione el tipo de servicio que desea reservar.
            </p>
          </div>
          <div className="lg:col-span-3 row-span-2">
            <ServiceList />
          </div>
          <div className="lg:col-span-1 row-span-1">
            <SearchClient />
          </div>
          <div className="row-span-1">
            <CurrentActionButton />
          </div>
        </div>
      </CreateShiftProvider>
    </DefaultLayout>
  );
}

const CurrentActionButton = () => {
  const { startQualification, services, client, onCreateClient } =
    useCreateShift();
  return services ? (
    client ? (
      <Button
        onClick={startQualification}
        className="w-full bg-primary text-white"
      >
        CALIFICAR TURNO
      </Button>
    ) : (
      <Button onClick={onCreateClient} className="w-full bg-primary text-white">
        CREAR CLIENTE
      </Button>
    )
  ) : null;
};
