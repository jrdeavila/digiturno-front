import SearchClient from "@/components/search-client";
import ServiceList from "@/components/service-list";
import DefaultLayout from "@/layouts/default";
import CreateShiftProvider, {
  useCreateShift,
} from "@/providers/create-shift-provider";
import { Button } from "@nextui-org/button";

export default function SectionalModulePage() {
  return (
    <DefaultLayout className='h-[calc(100vh-80px)] pt-10'>
      <div className="container mx-auto h-full relative">

        <CreateShiftProvider>
          <div className="grid grid-cols-1 grid-row-4 lg:grid-cols-5 gap-3 h-full">
            <div className="lg:col-span-5 row-span-1 ">
              <h1 className="text-3xl font-bold">Reservar turno</h1>
              <p className="text-lg">
                Bienvenido a nuestro sistema de reserva de turnos. Por favor,
                seleccione el tipo de servicio que desea reservar.
              </p>
            </div>
            <div className="lg:col-span-3 row-span-3 ">
              <ServiceList />
            </div>
            <div className="lg:col-span-2 row-span-3 ">
              <SearchClient />
            </div>
            <div className="row-span-1 lg:col-span-5 ">
              <CurrentActionButton />
            </div>
          </div>
        </CreateShiftProvider>
      </div>
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
      <Button
        style={{
          backgroundColor: "#19255a"
        }}
        onClick={onCreateClient} className="w-full text-white text-xl">
        CREAR CLIENTE
      </Button>
    )
  ) : null;
};
