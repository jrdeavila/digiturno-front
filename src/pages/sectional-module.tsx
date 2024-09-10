import SearchClientForm from "@/components/search-client-form";
import ServiceList from "@/components/service-list";
import useMyModule from "@/hooks/use-my-module";
import DefaultLayout from "@/layouts/default";
import CreateShiftProvider, { useCreateShift } from "@/providers/create-shift-provider";

export default function SectionalModulePage() {
  const { myModule } = useMyModule();
  return (
    <DefaultLayout className="overflow-y-auto pb-10 h-full w-full">
      <CreateShiftProvider>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:grid-rows-4 h-full w-full">

          <div className="col-span-1 row-span-3">

            <h2 className="mt-3 w-full text-center">
              {myModule?.room.name}
            </h2>

            <SearchClientForm />
          </div>
          <div className="col-span-3 row-span-4">
            <ServiceList />
          </div>


          <div className="col-span-1 row-span-2 p-2">
            <div className="flex flex-col gap-y-2">
              <CreateShiftButton />
              <ClearServicesButton />
            </div>

          </div>

        </div>
      </CreateShiftProvider>
    </DefaultLayout >
  );
}



const ClearServicesButton = () => {
  const {
    setServices,
  } = useCreateShift();
  const clearServices = () => {
    setServices([]);
  }
  return (
    <button onClick={clearServices} className="w-full bg-primary text-white rounded-lg py-2">Limpiar servicios</button>
  )
}

const CreateShiftButton = () => {
  const {
    startQualification,
  } = useCreateShift();
  return (
    <button onClick={startQualification} className="w-full bg-primary text-white rounded-lg py-2"> Terminar y calificar</button>
  )
}

