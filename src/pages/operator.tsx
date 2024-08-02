import ClientInfo from "@/components/ClientInfo";
import ModuleDistracted from "@/components/ModuleDistracted";
import ModuleInfo from "@/components/ModuleInfo";
import ServiceList from "@/components/ServiceList";
import WaitingClients from "@/components/WaitingClients";
import useShifts from "@/hooks/operator/use-shifts";
import useAuth from "@/hooks/use-auth";
import DefaultLayout from "@/layouts/default";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

const OperatorPage: React.FC = () => {
  const { currentShift } = useShifts();
  const { logout } = useAuth();
  return (
    <DefaultLayout className="">
      <GridContainer>
        <div className="grid grid-cols-1 lg:grid-cols-3 grid-rows-4 gap-3 w-full h-full">
          <div className="col-span-1 row-span-2">
            <ModuleInfo />
          </div>
          {currentShift ? (
            <div className="col-span-1 row-span-4">
              <ClientInfo />
            </div>
          ) : (
            <div className="col-span-1 row-span-4">
              <WaitingClients />
            </div>
          )}
          <div className="col-span-1 row-span-3">
            <ServiceList />
          </div>
          <div className="col-span-1 row-span-2">
            <ModuleDistracted />
          </div>
          <div className="col-span-1 row-span-1 ">

            <div className="flex flex-row justify-start items-center gap-x-2 h-full w-full"
              onClick={logout}
            >
              <div className="rounded-lg cursor-pointer bg-red-500 px-4 py-1 flex flex-row justify-center items-center gap-x-2 ">
                <FontAwesomeIcon icon={faSignOut} className="text-2vw" />
                <span className="text-2vw font-bold">
                  SALIR DEL SISTEMA
                </span>
              </div>
            </div>
          </div>
        </div>
      </GridContainer>

    </DefaultLayout>
  );
};

const GridContainer = styled.div`
  height: calc(100vh);
  padding: 20px;
  .col-span-1 {
    border-radius: 10px;

  }
  
`;

export default OperatorPage;
