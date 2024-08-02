import ClientInfo from "@/components/ClientInfo";
import ModuleDistracted from "@/components/ModuleDistracted";
import ModuleInfo from "@/components/ModuleInfo";
import ServiceList from "@/components/ServiceList";
import WaitingClients from "@/components/WaitingClients";
import useShifts from "@/hooks/operator/use-shifts";
import useAuth from "@/hooks/use-auth";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

const OperatorPage: React.FC = () => {
  const { currentShift } = useShifts();
  const { logout } = useAuth();
  return (
    <GridContainer>
      <div className="grid grid-cols-1 lg:grid-cols-3 grid-rows-4 gap-3 w-full h-full">
        <div className="col-span-1 row-span-2 bg-green-500 text-white">
          <ModuleInfo />
        </div>
        {currentShift ? (
          <div className="col-span-1 row-span-4 bg-blue-500 text-white">
            <ClientInfo />
          </div>
        ) : (
          <div className="col-span-1 row-span-4 bg-white text-blue-500 border-blue-500 border-2">
            <WaitingClients />
          </div>
        )}
        <div className="col-span-1 row-span-3 bg-gray-500 text-white">
          <ServiceList />
        </div>
        <div className="col-span-1 row-span-2 bg-blue-500 text-white">
          <ModuleDistracted />
        </div>
        <div className="col-span-1 row-span-1 bg-orange-500 text-white">

          <div className="flex flex-row justify-center items-center gap-x-2 h-full w-full cursor-pointer"
            onClick={logout}
          >
            <FontAwesomeIcon icon={faSignOut} className="text-2vw" />
            <span className="text-2vw font-bold">
              SALIR DEL SISTEMA
            </span>
          </div>
        </div>
      </div>
    </GridContainer>
  );
};

const GridContainer = styled.div`
  height: calc(100vh);
  padding: 10px;
  .col-span-1 {
    border-radius: 10px;
  }
  
`;

export default OperatorPage;
