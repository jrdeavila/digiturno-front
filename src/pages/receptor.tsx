import AttentionProfileList from "@/components/attention-profile-list";
import SearchClientForm from "@/components/search-client-form";
import ShiftList from "@/components/shift-list";
import useReceptorShifts from "@/hooks/operator/use-receptor-shifts";
import DefaultLayout from "@/layouts/default";
import { useAttentionProfileResource } from "@/providers/attention-profile-provider";
import CreateShiftProvider, { useCreateShift } from "@/providers/create-shift-provider";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ReceptorPage() {
  return (
    <DefaultLayout
      showLogo={false}
      className="overflow-y-auto pb-10 h-full w-full">
      <CreateShiftProvider>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:grid-rows-4 h-full w-full">

          <div className="col-span-1 row-span-1">
            <SearchClientForm />
          </div>
          <div className="col-span-2 row-span-4">
            <ShiftList />
          </div>

          <div className="col-span-1 row-span-2 p-2">
            <ShiftInfo />
          </div>
          <div className="col-span-1 row-span-2 p-2">
            <AttentionProfileList />
            <CreateShiftButton />
          </div>

          <div className="col-span-1 row-span-3">
            <AttentionProfileShiftInfo />
          </div>
        </div>
      </CreateShiftProvider>
    </DefaultLayout >
  );
}

const CreateShiftButton = () => {
  const {
    createShiftWithAttentionProfile,
  } = useCreateShift();
  return (
    <button onClick={createShiftWithAttentionProfile} className="w-full bg-primary text-white rounded-lg py-2">Crear turno</button>
  )
}


const AttentionProfileShiftInfo = () => {
  const { shifts } = useReceptorShifts();
  const { attentionProfiles } = useAttentionProfileResource();

  return (
    <div
      className="flex flex-col items-center h-full w-full rounded-lg p-5">
      <h1 className="text-3xl font-bold">Perfiles de atención</h1>
      <div className="flex flex-col gap-y-2 w-full">
        {attentionProfiles.map((attentionProfile) => (
          <div key={attentionProfile.id} className="flex flex-row items-center justify-between gap-x-2 w-full">
            <span>{attentionProfile.name}</span>
            <span
              style={{
                backgroundColor: "#00204D",
                border: "1px solid white",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >{shifts.filter(shift => shift.attentionProfile === attentionProfile.name).length}</span>
          </div>
        ))}
      </div>

    </div>
  )
}


const ShiftInfo = () => {
  const { shifts } = useReceptorShifts();
  return (
    <div
      style={{
        backgroundColor: "#00204D",
        border: "1px solid white",
      }}
      className="flex flex-col items-center justify-center h-full w-full rounded-lg p-5 text-white">
      <h1 className="text-3xl font-bold">Recepción</h1>
      <div className="flex flex-row items-center justify-between w-full">
        <div className="flex flex-col items-center justify-between">
          <h2 className="text-sm font-bold">Pendientes</h2>
          <p className="text-2xl">{shifts.filter(shift => shift.state === 'pending' || shift.state === 'pending-transferred'
          ).length}</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-sm font-bold">Distraídos</h2>
          <p className="text-2xl">{shifts.filter(shift => shift.state === 'distracted').length}</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-sm font-bold">Atendidos</h2>
          <p className="text-2xl">{shifts.filter(shift => shift.state === 'qualified').length}</p>
        </div>
      </div>
    </div>
  )
}



